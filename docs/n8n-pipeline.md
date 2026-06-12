# PIPELINE DE AUTOMATIZACIÓN — FORMULARIO RESET → n8n → EMAILS

Cómo conectar el formulario de captura (`/reset`, home y comunidad) con n8n
para guardar el lead y disparar la secuencia "Instalación del Kernel"
(`docs/SECUENCIA_EMAILS_RESET.md`).

## Arquitectura

```
[Formulario ResetCapture]
        │  POST JSON (fire-and-forget desde src/lib/leads.ts)
        ▼
[n8n Webhook] ──► [Validar + normalizar] ──► [Dedupe por email]
                                                  │ nuevo
                                                  ▼
                                   [Insertar lead en Supabase]
                                                  │
                                                  ▼
                                   [Email 1 — inmediato]
                                                  │
                                                  ▼
                                   [Wait 24 h] ──► [Email 2]
                                                  │
                                                  ▼
                                   [Waits día 4 / 6 / 8 → Emails 3-5]
```

Nota: el frontend TAMBIÉN inserta directo en Supabase (doble vía a propósito:
si una falla, la otra captura el lead). El dedupe en n8n y el `unique` de la
tabla `leads` evitan duplicados.

## 1. Nodo Webhook (entrada)

| Parámetro       | Valor                                            |
| --------------- | ------------------------------------------------ |
| HTTP Method     | `POST`                                           |
| Path            | `lead-reset`                                     |
| Respond         | `Immediately` (el frontend no espera la respuesta) |
| Response Code   | `200`                                            |

URL resultante (producción): `https://TU-INSTANCIA-N8N/webhook/lead-reset`

Esa URL se configura en el sitio mediante la env var **`VITE_LEAD_WEBHOOK_URL`**
(en Vercel → Settings → Environment Variables, luego redeploy) o, como
fallback, en `leadWebhookUrl` de `src/data/funnel.ts`.

### Payload JSON que envía el formulario

Generado en `src/lib/leads.ts` (`sendLeadToWebhook`). Si cambias campos allí,
actualiza esta tabla y el workflow.

```json
{
  "event": "lead.created",
  "email": "lead@gmail.com",
  "source": "reset",
  "site": "https://tabordasystem.com",
  "page": "/reset",
  "referrer": "https://www.tiktok.com/",
  "timestamp": "2026-06-11T21:45:00.000Z"
}
```

| Campo       | Tipo   | Descripción                                                       |
| ----------- | ------ | ----------------------------------------------------------------- |
| `event`     | string | Siempre `lead.created`. Permite reusar el webhook para más eventos. |
| `email`     | string | Ya validado, en minúsculas y sin espacios.                        |
| `source`    | string | Origen del lead: `reset` \| `home` \| `community`.                |
| `site`      | string | Dominio canónico (`funnel.siteUrl`).                              |
| `page`      | string | Ruta exacta donde se envió el formulario.                         |
| `referrer`  | string | De dónde llegó el visitante (vacío si entró directo).             |
| `timestamp` | string | ISO 8601, hora del navegador del lead.                            |

## 2. Validación y dedupe

1. **IF node** — descartar si `event !== "lead.created"` o si `email` no
   cumple `^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$`. (El frontend ya valida;
   esto blinda contra POSTs directos al webhook.)
2. **Dedupe** — nodo Supabase/Postgres: `SELECT` por `email`. Si ya existe,
   terminar el flujo (el lead ya está en secuencia; nunca reenviar Email 1).

## 3. Persistencia (Supabase)

Nodo **Supabase → Insert** sobre la tabla `public.leads`
(esquema en `supabase/leads.sql`):

| Columna  | Valor                  |
| -------- | ---------------------- |
| `email`  | `{{ $json.email }}`    |
| `source` | `{{ $json.source }}`   |

Credencial: **service role key** (la anon key solo inserta; para el dedupe
con SELECT se necesita la service key). Guardarla únicamente en n8n, jamás
en el frontend.

Si el insert falla con `unique_violation` (23505), continuar sin error:
significa que el frontend ya lo insertó — es el caso normal, no un bug.

## 4. Trigger de correos

Proveedor recomendado: Resend, Brevo o SMTP propio — con SPF, DKIM y DMARC
configurados en `tabordasystem.com` ANTES del primer envío.

| Paso | Nodo            | Configuración                                                            |
| ---- | --------------- | ------------------------------------------------------------------------ |
| 1    | Send Email      | Email 1 — `[TABORDA SYSTEM] Archivos de instalación listos. Módulo 0.0`  |
| 2    | Wait            | `24 hours`                                                               |
| 3    | Send Email      | Email 2 — `[TABORDA SYSTEM] Error en el sistema detectado (Dopamina barata)` |
| 4    | Wait            | hasta día 4 (72 h más) → Email 3                                          |
| 5    | Wait            | hasta día 6 → Email 4                                                     |
| 6    | Wait            | hasta día 8 → Email 5 (venta de la cohorte)                               |

- Remitente: `Carlos — Disciplina Fénix <carlos@tabordasystem.com>`.
- Copy exacto y placeholders (`[LINK_PDF]`, `[LINK_PROTOCOLO]`):
  `docs/SECUENCIA_EMAILS_RESET.md`.
- `[LINK_PDF]` → `https://tabordasystem.com/reset-protocolo.html`.
- Los nodos Wait de n8n sobreviven reinicios (estado en DB): aptos para
  esperas de días.
- Cuando la cohorte se llene: desactivar solo el branch del Email 5.

## 5. Prueba end-to-end

```bash
curl -X POST https://TU-INSTANCIA-N8N/webhook/lead-reset \
  -H "Content-Type: application/json" \
  -d '{
    "event": "lead.created",
    "email": "prueba@gmail.com",
    "source": "reset",
    "site": "https://tabordasystem.com",
    "page": "/reset",
    "referrer": "",
    "timestamp": "2026-06-11T12:00:00.000Z"
  }'
```

Checklist de verificación:

1. El lead aparece en `public.leads` (dashboard de Supabase).
2. Email 1 llega de inmediato (revisar también spam: si cae ahí, revisar
   SPF/DKIM antes de seguir).
3. El workflow queda "running" en el nodo Wait de 24 h.
4. Repetir el mismo curl: NO debe duplicar el lead ni reenviar Email 1.

## 6. Seguridad

- El webhook es público por naturaleza (lo llama el navegador del lead).
  Mitigaciones: validación estricta en el paso 2, dedupe por email, y el
  honeypot del formulario que filtra bots antes de llegar aquí.
- No exponer la service key de Supabase fuera de las credenciales de n8n.
- Si llega spam masivo al webhook: activar rate-limit en el proxy de la
  instancia n8n (Cloudflare delante de la instancia es la vía rápida).

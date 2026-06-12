# WEBHOOK DE VENTAS HOTMART — POSTVENTA AUTOMATIZADA

Cómo cada venta aprobada en Hotmart activa al alumno en Supabase y dispara
el email de bienvenida (credenciales + agendamiento 1:1) sin tocar nada a mano.

Código: `api/hotmart-webhook.ts` (Vercel Serverless Function).
Esquema: `supabase/ventas.sql` (ejecutar después de `supabase/leads.sql`).

## Arquitectura

```
[Hotmart] venta aprobada
    │ POST JSON v2.0.0 + header X-HOTMART-HOTTOK
    ▼
[/api/hotmart-webhook]  (Vercel Function — mismo dominio del sitio)
    ├─ 1. valida HOTTOK            → inválido: 401, se descarta
    ├─ 2. filtra evento            → APPROVED activa · REFUNDED/CHARGEBACK revierte
    ├─ 3. INSERT en `purchases`    → transaction UNIQUE = idempotencia
    ├─ 4. UPDATE `leads` status='active' (o INSERT si compró sin ser lead)
    └─ 5. POST a n8n (N8N_SALE_WEBHOOK_URL)
              │
              ▼
       [n8n: workflow hotmart-venta]
          ├─ Email de bienvenida (credenciales + link 1:1)
          └─ (opcional) aviso a tu WhatsApp/Telegram: "VENTA: {{email}}"
```

¿Por qué una función serverless y no n8n directo? El endpoint vive en
`tabordasystem.com` (cero dependencia de que la instancia n8n esté viva
en el momento de la venta), la activación en Supabase ocurre SIEMPRE
aunque n8n falle, y `purchases` queda como registro de auditoría para
reprocesar a mano cualquier email que no haya salido.

## Setup (una sola vez)

### 1. Supabase

Ejecutar `supabase/ventas.sql` en el SQL Editor. Añade `status` y
`purchased_at` a `leads` y crea la tabla `purchases`.

### 2. Vercel → Settings → Environment Variables

| Variable | Valor | Notas |
| --- | --- | --- |
| `HOTMART_HOTTOK` | token del paso 3 | sin él, el endpoint rechaza todo |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | **service** key, no la anon |
| `SUPABASE_URL` | `https://xxxx.supabase.co` | opcional si ya existe `VITE_SUPABASE_URL` |
| `N8N_SALE_WEBHOOK_URL` | `https://TU-N8N/webhook/hotmart-venta` | opcional; sin él no hay email automático |

Sin prefijo `VITE_`: viven solo en el servidor. **Redeploy** después de definirlas.

### 3. Hotmart → Herramientas → Webhook (API de notificaciones)

1. URL: `https://tabordasystem.com/api/hotmart-webhook`
2. Versión: **2.0.0** (JSON).
3. Eventos: `PURCHASE_APPROVED` (obligatorio) + `PURCHASE_REFUNDED` y
   `PURCHASE_CHARGEBACK` (recomendados: revierten el acceso solos).
4. Copiar el **Hottok** que muestra Hotmart → pegarlo en `HOTMART_HOTTOK`.

### 4. n8n — workflow `hotmart-venta`

```
[Webhook POST /hotmart-venta, Respond Immediately 200]
   → [IF event == "sale.approved"]
   → [Send Email — bienvenida]
   → (opcional) [Telegram/WhatsApp: "VENTA: {{ $json.email }}"]
```

El payload que recibe n8n (lo arma la función, NO es el de Hotmart):

```json
{
  "event": "sale.approved",
  "email": "alumno@gmail.com",
  "name": "Nombre Apellido",
  "transaction": "HP1234567890",
  "product_id": "123456",
  "price_value": 35,
  "timestamp": "2026-06-12T18:00:00.000Z"
}
```

Email de bienvenida (remitente `carlos@tabordasystem.com`, igual que la
secuencia RESET — SPF/DKIM ya configurados antes del primer envío):

- Asunto sugerido: `[TABORDA SYSTEM] Acceso concedido — Instalación Supervisada`
- Cuerpo: bienvenida + credenciales/acceso al material + **link de
  agendamiento de la llamada 1:1** (Cal.com o Calendly) + qué hacer hoy.
- La validación del hottok ya ocurrió en la función: n8n puede confiar
  en este payload (aún así el IF del paso 2 filtra ruido).

## Prueba end-to-end (sin venta real)

```bash
curl -X POST https://tabordasystem.com/api/hotmart-webhook \
  -H "Content-Type: application/json" \
  -H "X-HOTMART-HOTTOK: TU_HOTTOK" \
  -d '{
    "event": "PURCHASE_APPROVED",
    "data": {
      "buyer": { "email": "prueba-venta@gmail.com", "name": "Prueba" },
      "purchase": { "transaction": "TEST-001", "price": { "value": 35, "currency_value": "USD" } },
      "product": { "id": 123456 }
    }
  }'
```

Checklist:

1. Respuesta `200 {"ok":true,...,"welcome_email":"triggered"}`.
2. En Supabase: fila nueva en `purchases` y el lead con `status='active'`.
3. Llega el email de bienvenida (revisar spam la primera vez).
4. Repetir el MISMO curl → `{"ok":true,"skipped":"duplicate_transaction"}`
   y NO llega segundo email (idempotencia).
5. Curl sin header hottok → `401`.
6. Hotmart tiene botón "probar webhook" en el panel: usarlo al final.

## Operación

- Venta confirmada ⇒ además subir `cohortSpotsTaken` en `src/data/funnel.ts`
  (+ redeploy) — ver `docs/OPERACIONES.md`.
- Alumnos activos: `select email, purchased_at from leads where status='active'`.
- Email que no salió (n8n caído): la fila queda en `purchases`; reenviar a
  mano o re-disparar el workflow de n8n con ese payload.
- La secuencia de leads (5 emails de `docs/n8n-pipeline.md`) sigue corriendo
  aparte: si quieres cortarla cuando alguien compra, añade en n8n un IF que
  consulte `leads.status != 'active'` antes de cada envío.

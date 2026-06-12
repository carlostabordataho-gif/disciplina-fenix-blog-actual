# MANUAL DE OPERACIÓN DEL ADMINISTRADOR — TABORDA SYSTEM

Procedimientos manuales de producción. Este es el documento que abres cuando
hay que **operar** el sistema (vender, activar el checkout, conectar emails),
no cuando hay que programarlo.

- Dominio canónico: **https://tabordasystem.com**
- Hosting: **Vercel** (deploy automático con cada push a `main`)
- Captura de leads: **Supabase** (tabla `public.leads`) + webhook **n8n**
- Cohorte Fundadora: inicia **lunes 23 de junio**, cierre de inscripciones
  **domingo 22 de junio** (fechas en `src/data/funnel.ts`)

> Regla de oro: **toda variable `VITE_*` es de build-time.** Cambiarla en
> Vercel NO hace nada hasta que ejecutes un **Redeploy**. Lo mismo aplica a
> cualquier edición de código: no existe hasta que hay push + deploy.

---

## 1. Actualizar el stock de cupos de la cohorte (`cohortSpotsTaken`)

Cada venta confirmada se refleja a mano para activar la urgencia real en
todos los contadores del sitio (hero, /protocolo, banners).

**Archivo:** `src/data/funnel.ts`

1. Abre `src/data/funnel.ts` y localiza el bloque de la cohorte:

   ```ts
   cohortSpotsTotal: 10,
   cohortSpotsTaken: 0, // ACTUALIZAR A MANO con cada venta confirmada
   ```

2. Sube `cohortSpotsTaken` en **+1 por cada venta confirmada** (pago
   recibido, no "me interesa"). Ejemplo con 3 ventas:

   ```ts
   cohortSpotsTaken: 3,
   ```

3. Guarda, commitea y haz push a `main`:

   ```bash
   git add src/data/funnel.ts
   git commit -m "ops: venta confirmada — cupos tomados 3/10"
   git push origin main
   ```

4. Vercel despliega solo (1–2 min). Verifica en
   https://tabordasystem.com/protocolo que el contador muestre `7/10
   disponibles`.

**Notas:**

- El helper `cohortSpotsLeft` calcula los disponibles y nunca baja de 0:
  si te pasas (`cohortSpotsTaken > cohortSpotsTotal`), el sitio muestra 0
  cupos, no números negativos.
- Para mover fechas de la cohorte edita `cohortStartDate` /
  `cohortCloseDate` en el mismo archivo (son texto literal, escribe el día
  como quieres que se lea).
- `src/data/funnel.ts` es **el único archivo que se edita a mano** durante
  la operación. Si te ves editando otro archivo para operar, algo va mal.

---

## 2. Activar el checkout automático (`VITE_COHORTE_CHECKOUT_URL` en Vercel)

Mientras esta variable no exista, **todos** los botones de compra abren
WhatsApp con un mensaje de intención de compra (modo cierre 1:1). Cuando
tengas el link real de Hotmart / Gumroad / Bold / Wompi, esto los conmuta
todos a pasarela de pago **sin tocar una línea de código**.

### Procedimiento exacto en Vercel

1. Crea el producto en la pasarela y copia el **link público de pago**
   (debe empezar por `https://`).
2. Entra a [vercel.com](https://vercel.com) → tu proyecto →
   **Settings → Environment Variables**.
3. **Add New** (o **Add Another**):
   - **Key:** `VITE_COHORTE_CHECKOUT_URL`
   - **Value:** el link de pago completo, p. ej.
     `https://pay.hotmart.com/XXXXXXXX`
   - **Environments:** marca al menos **Production** (marca también
     Preview si quieres probar el flujo en deploys de preview).
4. **Save**.
5. **Forzar el Redeploy** (obligatorio — la variable es de build-time):
   - Ve a la pestaña **Deployments**.
   - En el deployment más reciente de Production, abre el menú `⋯` →
     **Redeploy**.
   - En el diálogo, confirma **Redeploy** (no hace falta "Use existing
     Build Cache" desactivado, pero si dudas, desmárcalo).
6. Espera a que el deployment quede **Ready** (1–2 min).

### Verificación (no te saltes esto)

1. Abre https://tabordasystem.com/protocolo en ventana de incógnito.
2. Pulsa el botón principal de compra:
   - ✅ Debe abrir **la pasarela de pago**.
   - ❌ Si sigue abriendo WhatsApp: la variable no llegó al build
     (revisa el nombre exacto, el environment marcado y que el Redeploy
     haya terminado).
3. En los logs del build de Vercel, el health check (`scripts/check-env.js`)
   debe mostrar `[OK] VITE_COHORTE_CHECKOUT_URL`.

### Reglas internas del sistema (por si algo no cuadra)

- El link solo se considera válido si **empieza por `http`** y **no
  contiene la palabra `REEMPLAZAR`** (guarda anti-placeholder en
  `src/data/funnel.ts` → `isValidCheckout`).
- Prioridad: `VITE_COHORTE_CHECKOUT_URL` (Vercel) **gana** sobre el campo
  `checkoutUrl` fijo de `funnel.ts`. Con la env var válida no necesitas
  tocar `paymentMode`.
- **Rollback** (volver a WhatsApp): borra la variable en Vercel (o déjala
  vacía) y haz Redeploy. Los CTA vuelven solos al modo 1:1.

---

## 3. Webhook de n8n — payload esperado (`VITE_LEAD_WEBHOOK_URL`)

Cuando configures la automatización de correos, el formulario RESET
(footer, /reset, home, comunidad) hace un **POST JSON fire-and-forget** al
webhook de n8n. La guía completa del workflow (nodos, dedupe, secuencia de
5 emails) está en [`docs/n8n-pipeline.md`](n8n-pipeline.md); este es el
contrato de datos que tu webhook debe aceptar:

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

| Campo       | Tipo   | Descripción                                                                  |
| ----------- | ------ | ---------------------------------------------------------------------------- |
| `event`     | string | Siempre `"lead.created"`. Filtra por este valor en n8n (blinda el webhook).  |
| `email`     | string | Ya validado en frontend, minúsculas, sin espacios.                           |
| `source`    | string | Origen del lead: `reset` \| `home` \| `community` \| `footer`.               |
| `site`      | string | Dominio canónico (`funnel.siteUrl`).                                         |
| `page`      | string | Ruta exacta donde se envió el formulario (ej. `/reset`).                     |
| `referrer`  | string | De dónde llegó el visitante; vacío si entró directo.                         |
| `timestamp` | string | ISO 8601, hora del navegador del lead.                                       |

**Configuración:**

1. Crea el workflow en n8n siguiendo `docs/n8n-pipeline.md` (nodo Webhook
   con method `POST`, path `lead-reset`, respond `Immediately`).
2. Copia la URL de producción del webhook
   (`https://TU-INSTANCIA/webhook/lead-reset`).
3. En Vercel → Settings → Environment Variables añade
   `VITE_LEAD_WEBHOOK_URL` con esa URL (Production) y **Redeploy**
   (mismo procedimiento de la sección 2).
4. Prueba end-to-end con el `curl` de la sección 5 de `n8n-pipeline.md` y
   verifica: lead en Supabase, Email 1 recibido, sin duplicados al repetir.

**Comportamiento del frontend** (definido en `src/lib/leads.ts`):

- El POST es **fire-and-forget**: si n8n está caído, el usuario no ve
  error y el lead igual se guarda en Supabase (doble vía a propósito).
- Si Supabase fallara, el webhook actúa de respaldo: con que una de las
  dos vías entre, el formulario reporta éxito.
- n8n debe **deduplicar por email** (el frontend también inserta directo
  en Supabase; el `unique` de la tabla + el dedupe del workflow evitan
  emails repetidos).
- ⚠ Si cambias campos del payload en `src/lib/leads.ts`, actualiza esta
  tabla, `docs/n8n-pipeline.md` y el workflow de n8n. Los tres deben
  decir lo mismo.

---

## 4. Health check de entorno (`scripts/check-env.js`)

Corre **automáticamente antes de cada build** (hook `prebuild` de npm,
local y en Vercel) y reporta el estado de las 4 variables críticas:

| Variable                    | Si falta…                                                        |
| --------------------------- | ----------------------------------------------------------------- |
| `VITE_SUPABASE_URL`         | Los leads no se guardan en Supabase.                              |
| `VITE_SUPABASE_ANON_KEY`    | El cliente de Supabase no se inicializa.                          |
| `VITE_LEAD_WEBHOOK_URL`     | No se dispara la secuencia de emails (leads solo en Supabase).    |
| `VITE_COHORTE_CHECKOUT_URL` | Los CTA de compra abren WhatsApp en vez de la pasarela.           |

Uso manual:

```bash
npm run check-env           # reporte (nunca rompe el build)
node scripts/check-env.js --strict   # exit 1 si falta una requerida (para CI)
```

Por diseño el aviso **no bloquea el build**: el sitio degrada con
elegancia (formulario avisa el fallo, CTA caen a WhatsApp). El objetivo es
que nunca más subas un build "roto" **sin enterarte**: revisa siempre el
log del build en Vercel después de tocar variables.

---

## 5. Checklist rápido del operador

| Situación                          | Acción                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------- |
| Venta confirmada                   | §1 — subir `cohortSpotsTaken` +1, commit, push                          |
| Llegó el link de Hotmart/Gumroad   | §2 — env var `VITE_COHORTE_CHECKOUT_URL` + Redeploy + verificar CTA     |
| Configurar emails automáticos      | §3 — workflow n8n + env var `VITE_LEAD_WEBHOOK_URL` + Redeploy          |
| Mover fechas de cohorte            | §1 — `cohortStartDate` / `cohortCloseDate` en `funnel.ts`               |
| ¿El deploy quedó bien configurado? | §4 — leer el health check en el log del build de Vercel                 |
| Cohorte llena                      | Subir `cohortSpotsTaken` al total **y** desactivar branch Email 5 en n8n |

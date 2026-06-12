// ─────────────────────────────────────────────────────────────────────
// TABORDA SYSTEM — Webhook de ventas de Hotmart (Vercel Serverless Function)
//
// URL pública (Vercel la expone sola al detectar la carpeta /api):
//   https://tabordasystem.com/api/hotmart-webhook
//
// FLUJO DE DATOS (de principio a fin):
//
//   [Hotmart] venta aprobada
//      │  POST JSON v2.0.0 + header X-HOTMART-HOTTOK
//      ▼
//   [1] Validar método + token HOTTOK        → si falla: 401 (se descarta)
//   [2] Filtrar evento (APPROVED/REFUNDED…)  → otros eventos: 200 ignorado
//   [3] Registrar la transacción en `purchases` (idempotencia: el unique
//       de (transaction, event) detecta los REINTENTOS del mismo evento y
//       NO repite el email de bienvenida — pero deja pasar el REFUNDED
//       que llega con la misma transaction de la compra original)
//   [4] Activar al alumno en `leads` (status='active', purchased_at=now)
//       — si nunca fue lead, se crea con source='hotmart'
//   [5] Disparar el email de bienvenida vía n8n (credenciales + link 1:1)
//      │
//      ▼
//   200 OK → Hotmart no reintenta. 5xx → Hotmart reintenta (a propósito:
//   si Supabase está caído queremos el reintento).
//
// VARIABLES DE ENTORNO (Vercel → Settings → Environment Variables,
// SIN prefijo VITE_ = solo servidor, jamás llegan al navegador):
//   HOTMART_HOTTOK             token del panel de Hotmart (obligatoria)
//   SUPABASE_URL               https://xxxx.supabase.co (o se reusa VITE_SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY  service key (NUNCA la anon: necesita UPDATE)
//   N8N_SALE_WEBHOOK_URL       webhook de n8n que envía el email de bienvenida
//
// Documentación operativa completa: docs/HOTMART_WEBHOOK.md
// ─────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

// Tipos mínimos de la firma de Vercel (evita instalar @vercel/node solo
// para esto; si algún día lo instalas, puedes reemplazarlos).
interface VercelReq {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body: unknown
}
interface VercelRes {
  status(code: number): VercelRes
  json(payload: unknown): void
}

// ── Forma del payload v2.0.0 de Hotmart (solo los campos que usamos) ──
interface HotmartPayload {
  event?: string // 'PURCHASE_APPROVED' | 'PURCHASE_REFUNDED' | 'PURCHASE_CHARGEBACK' | ...
  data?: {
    buyer?: { email?: string; name?: string }
    purchase?: {
      transaction?: string
      price?: { value?: number; currency_value?: string }
    }
    product?: { id?: number | string; name?: string }
  }
}

// Eventos que activan al alumno vs. los que revierten el acceso.
const ACTIVATE_EVENTS = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE']
const REVOKE_EVENTS = ['PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK']

export default async function handler(req: VercelReq, res: VercelRes) {
  // Cada request deja huella en los logs de Vercel (Dashboard → Functions
  // → /api/hotmart-webhook → Logs). Nunca se loguea el HOTTOK esperado.
  console.log(`[hotmart-webhook] → ${req.method ?? 'SIN_METODO'} recibido`)

  // [1] Solo POST y solo con el token secreto de Hotmart.
  if (req.method !== 'POST') {
    console.error(`[hotmart-webhook] ✗ método rechazado: ${req.method}`)
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const hottok = req.headers['x-hotmart-hottok']
  const expected = process.env.HOTMART_HOTTOK
  if (!expected || hottok !== expected) {
    // Sin token válido no se procesa nada: el endpoint es público
    // y cualquiera podría intentar inyectar "ventas" falsas.
    console.error(
      `[hotmart-webhook] ✗ HOTTOK inválido (env configurada: ${Boolean(expected)}, header presente: ${Boolean(hottok)})`
    )
    return res.status(401).json({ error: 'invalid_hottok' })
  }
  console.log('[hotmart-webhook] ✓ HOTTOK verificado')

  // [2] Clasificar el evento.
  const payload = (req.body ?? {}) as HotmartPayload
  const event = payload.event ?? ''
  const isActivate = ACTIVATE_EVENTS.includes(event)
  const isRevoke = REVOKE_EVENTS.includes(event)
  if (!isActivate && !isRevoke) {
    // Evento que no nos interesa (carrito abandonado, boleto impreso…):
    // 200 para que Hotmart no reintente.
    console.log(`[hotmart-webhook] ◌ evento ignorado: ${event || 'no_event'}`)
    return res.status(200).json({ ok: true, skipped: event || 'no_event' })
  }

  // Datos del comprador, normalizados igual que en el funnel de leads.
  const email = (payload.data?.buyer?.email ?? '').trim().toLowerCase()
  const buyerName = payload.data?.buyer?.name ?? ''
  const transaction = payload.data?.purchase?.transaction ?? ''
  if (!email || !transaction) {
    console.error(
      `[hotmart-webhook] ✗ payload incompleto (email: ${Boolean(email)}, transaction: ${Boolean(transaction)}) — evento ${event}`
    )
    return res.status(200).json({ ok: false, skipped: 'missing_email_or_transaction' })
  }
  console.log(`[hotmart-webhook] ● evento ${event} | tx=${transaction} | email=${email}`)

  // Cliente de Supabase con SERVICE KEY (solo servidor: puede UPDATE/SELECT,
  // cosas que la anon key del frontend tiene prohibidas por RLS).
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    // 500 => Hotmart reintenta más tarde; la venta no se pierde.
    console.error(
      `[hotmart-webhook] ✗ Supabase sin configurar (url: ${Boolean(supabaseUrl)}, service_key: ${Boolean(serviceKey)})`
    )
    return res.status(500).json({ error: 'supabase_not_configured' })
  }
  const db = createClient(supabaseUrl, serviceKey)

  // [3] Registro de auditoría + idempotencia.
  // (transaction, event) es UNIQUE: si Hotmart REINTENTA el mismo evento,
  // el insert falla con 23505 y cortamos sin duplicar email de bienvenida.
  // Un REFUNDED con la misma transaction que el APPROVED original SÍ pasa
  // (es otro evento) y revoca el acceso en el paso [4].
  const { error: purchaseError } = await db.from('purchases').insert({
    transaction,
    email,
    buyer_name: buyerName,
    product_id: String(payload.data?.product?.id ?? ''),
    price_value: payload.data?.purchase?.price?.value ?? null,
    price_currency: payload.data?.purchase?.price?.currency_value ?? null,
    event,
    raw: payload,
  })
  if (purchaseError) {
    if (purchaseError.code === '23505') {
      console.log(`[hotmart-webhook] ◌ tx duplicada (reintento de Hotmart): ${transaction}`)
      return res.status(200).json({ ok: true, skipped: 'duplicate_transaction' })
    }
    console.error(
      `[hotmart-webhook] ✗ insert en purchases falló (tx=${transaction}): [${purchaseError.code}] ${purchaseError.message}`
    )
    return res.status(500).json({ error: 'purchase_insert_failed' })
  }
  console.log(`[hotmart-webhook] ✓ purchase registrada: tx=${transaction}`)

  // [4] Activar (o desactivar) al alumno en la tabla `leads`.
  // Gamificación del Personal OS: todo alumno que entra arranca su
  // partida desde cero — os_score=0 y os_state='ZONA DE PELIGRO'
  // (mismos defaults que las columnas en supabase/setup-completo.sql).
  // En reembolso/chargeback SOLO se toca `status`: purchased_at conserva
  // la fecha de compra original (dato histórico) y el Personal OS no se resetea.
  const newStatus = isActivate ? 'active' : 'refunded'
  const personalOsInit = isActivate
    ? { os_score: 0, os_state: 'ZONA DE PELIGRO' }
    : {}
  const leadPatch = isActivate
    ? { status: newStatus, purchased_at: new Date().toISOString(), ...personalOsInit }
    : { status: newStatus }
  const { data: updated, error: updateError } = await db
    .from('leads')
    .update(leadPatch)
    .eq('email', email)
    .select('id')
  if (updateError) {
    console.error(
      `[hotmart-webhook] ✗ update de lead falló (${email}): [${updateError.code}] ${updateError.message}`
    )
    return res.status(500).json({ error: 'lead_update_failed' })
  }
  if ((updated?.length ?? 0) === 0 && isActivate) {
    // Compró sin pasar por el formulario RESET (p.ej. link directo de
    // TikTok al checkout): lo damos de alta como lead-cliente.
    console.log(`[hotmart-webhook] ● ${email} no era lead — alta directa desde Hotmart`)
    const { error: insertError } = await db.from('leads').insert({
      email,
      source: 'hotmart',
      status: 'active',
      purchased_at: new Date().toISOString(),
      ...personalOsInit,
    })
    // 23505 = carrera con el formulario; ya existe, no es un error.
    if (insertError && insertError.code !== '23505') {
      console.error(
        `[hotmart-webhook] ✗ alta de lead falló (${email}): [${insertError.code}] ${insertError.message}`
      )
      return res.status(500).json({ error: 'lead_insert_failed' })
    }
  }
  console.log(
    `[hotmart-webhook] ✓ alumno ${email} → status=${newStatus}${isActivate ? ' | Personal OS inicializado: score=0, estado=ZONA DE PELIGRO' : ''}`
  )

  // [5] Disparador del email de bienvenida (n8n envía credenciales +
  // link de agendamiento 1:1). Payload propio, documentado en
  // docs/HOTMART_WEBHOOK.md — NO reenviamos el payload crudo de Hotmart.
  let welcomeTriggered = false
  const n8nUrl = process.env.N8N_SALE_WEBHOOK_URL
  if (isActivate && n8nUrl?.startsWith('http')) {
    try {
      const n8nRes = await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'sale.approved',
          email,
          name: buyerName,
          transaction,
          product_id: String(payload.data?.product?.id ?? ''),
          price_value: payload.data?.purchase?.price?.value ?? null,
          timestamp: new Date().toISOString(),
        }),
      })
      welcomeTriggered = n8nRes.ok
      if (!n8nRes.ok) {
        console.error(`[hotmart-webhook] ✗ n8n respondió ${n8nRes.status} para tx=${transaction}`)
      }
    } catch (err) {
      // El alumno YA quedó activo en la base; si n8n falló, el registro
      // en `purchases` permite reprocesar el email a mano.
      console.error(
        `[hotmart-webhook] ✗ n8n inalcanzable para tx=${transaction}: ${err instanceof Error ? err.message : String(err)}`
      )
      welcomeTriggered = false
    }
  } else if (isActivate) {
    console.log('[hotmart-webhook] ◌ N8N_SALE_WEBHOOK_URL sin configurar — email de bienvenida no disparado')
  }

  console.log(
    `[hotmart-webhook] ✓ FIN ok | evento=${event} | tx=${transaction} | welcome_email=${welcomeTriggered ? 'triggered' : 'not_triggered'}`
  )
  return res.status(200).json({
    ok: true,
    event,
    status: newStatus,
    welcome_email: welcomeTriggered ? 'triggered' : 'not_triggered',
  })
}

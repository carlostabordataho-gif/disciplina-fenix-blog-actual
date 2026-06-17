import { funnel } from '../data/funnel'

// Captura de leads SIN el SDK de Supabase: un POST directo a la API REST
// (PostgREST) mantiene el chunk de la ruta /reset en ~3 kB en vez de los
// ~55 kB gzip que pesaba `@supabase/supabase-js`. El comportamiento es
// idéntico al del SDK: mismo endpoint, mismo payload, misma seguridad
// (anon key + RLS), y el 23505 (duplicado) que el SDK trataba como éxito
// aquí llega como HTTP 409 y se mapea igual.
//
// Guardas: si faltan las env vars el sitio NO se cae, el formulario reporta
// el fallo y ofrece la vía alterna (DM por WhatsApp).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const supabaseReady = !!(supabaseUrl && supabaseKey)

// Endpoint REST de la tabla `leads` (sin barra final duplicada).
const leadsRestUrl = supabaseUrl
  ? `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/leads`
  : ''

type InsertOutcome = 'ok' | 'duplicate' | 'fail'

/**
 * fetch con timeout duro vía AbortController. Blindaje contra adblockers
 * agresivos (uBlock/Brave/Pi-hole): si bloquean el endpoint COLGANDO la
 * petición en vez de rechazarla, abortamos a los `ms` para que el caller
 * dispare su fallback (webhook/WhatsApp) en vez de dejar al usuario clavado
 * en "REGISTRANDO…". Si no hay AbortController (navegador muy viejo), hace
 * un fetch normal: nunca rompe.
 */
function fetchWithTimeout(url: string, init: RequestInit, ms = 8000): Promise<Response> {
  if (typeof AbortController === 'undefined') return fetch(url, init)
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(timer))
}

/**
 * Inserta el lead vía API REST de Supabase (PostgREST).
 * - 200/201        => 'ok' (fila creada).
 * - 409 (23505)    => 'duplicate' (ya estaba registrado; el SDK lo daba por éxito).
 * - otro / throw   => 'fail' (la red o Supabase fallaron; el caller usa el webhook/DM).
 * Mismo payload que el SDK: { email, source }; la RLS aplica status='lead'/score 0.
 */
async function insertLeadRest(email: string, source: string): Promise<InsertOutcome> {
  try {
    const res = await fetchWithTimeout(leadsRestUrl, {
      method: 'POST',
      headers: {
        apikey: supabaseKey as string,
        Authorization: `Bearer ${supabaseKey as string}`,
        'Content-Type': 'application/json',
        // return=minimal: PostgREST no devuelve la fila => menos ancho de banda,
        // emula el insert estándar del SDK (que tampoco hace select por defecto).
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ email, source }),
    })
    if (res.ok) return 'ok'
    // 409 Conflict = unique_violation (23505): email ya registrado => éxito idempotente.
    if (res.status === 409) return 'duplicate'
    return 'fail'
  } catch {
    // Red caída / CORS / DNS: nunca lanzamos, el caller decide el fallback.
    return 'fail'
  }
}

// Webhook de automatización (n8n). Ver docs/n8n-pipeline.md.
// Prioridad: env var (por entorno) > valor fijo en funnel.ts.
const webhookUrl =
  (import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined) ||
  funnel.leadWebhookUrl

export interface SaveLeadResult {
  ok: boolean
  error?: string
  /** true cuando falló la infraestructura (no el email del usuario):
   *  el formulario ofrece la vía alterna por WhatsApp. */
  offerFallback?: boolean
}

/**
 * Validación estricta de email en frontend.
 * @returns mensaje de error, o null si el email es válido.
 */
export function validateEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase()
  if (!email) return 'Escribe tu email para recibir el protocolo.'
  if (email.length < 6 || email.length > 254) return 'Email inválido.'
  // Formato: local@dominio.tld — sin espacios, TLD de mínimo 2 letras.
  if (!/^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(email)) {
    return 'Email inválido. Revisa el formato (ej: nombre@gmail.com).'
  }
  const [local, domain] = email.split('@')
  if (local.length > 64) return 'Email inválido.'
  if (email.includes('..') || local.startsWith('.') || local.endsWith('.')) {
    return 'Email inválido. Revisa los puntos.'
  }
  // Typos frecuentes de los dominios masivos (gmail.con, hotmail.co, etc.)
  if (/@(gmail|hotmail|outlook|yahoo)\.(con|co|cm|comm|vom)$/.test(`@${domain}`)) {
    return `¿Seguro? Revisa la terminación de "${domain}".`
  }
  return null
}

/**
 * Dispara el lead hacia el pipeline de automatización (n8n).
 * Fire-and-forget: nunca bloquea ni rompe el flujo del usuario.
 * El payload está documentado en docs/n8n-pipeline.md — si cambias
 * campos aquí, actualiza ese documento y el workflow de n8n.
 */
function sendLeadToWebhook(email: string, source: string): Promise<boolean> {
  if (!webhookUrl.startsWith('http')) return Promise.resolve(false)
  // fetchWithTimeout: si un adblocker cuelga el webhook, no dejamos colgado
  // el await del caller cuando este es la única vía (Supabase ausente/caído).
  return fetchWithTimeout(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'lead.created',
      email,
      source,
      site: funnel.siteUrl,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      timestamp: new Date().toISOString(),
    }),
  })
    .then((res) => res.ok)
    .catch(() => false)
}

/**
 * Guarda un lead en la tabla `leads` y lo envía al webhook de n8n.
 * @param email email del lead
 * @param source de dónde vino: 'reset' | 'home' | 'community' | ...
 */
export async function saveLead(email: string, source: string): Promise<SaveLeadResult> {
  const clean = email.trim().toLowerCase()
  const validationError = validateEmail(clean)
  if (validationError) {
    return { ok: false, error: validationError }
  }

  // El webhook se dispara en paralelo: si Supabase fallara, el lead
  // igual entra al pipeline de emails (n8n deduplica por email).
  const webhookPromise = sendLeadToWebhook(clean, source)

  if (!supabaseReady) {
    // Sin Supabase, el webhook es la única vía: aquí sí lo esperamos.
    const webhookOk = await webhookPromise
    if (webhookOk) return { ok: true }
    return {
      ok: false,
      error: '> ERROR DE CONEXIÓN. Reintenta en unos segundos.',
      offerFallback: true,
    }
  }

  const outcome = await insertLeadRest(clean, source)

  // 'ok' (fila nueva) y 'duplicate' (23505 → ya registrado) son éxito, igual que el SDK.
  if (outcome === 'ok' || outcome === 'duplicate') return { ok: true }

  // Supabase falló: si el webhook entró, el lead no se pierde.
  if (await webhookPromise) return { ok: true }
  return {
    ok: false,
    error: '> ERROR AL REGISTRAR. Reintenta en unos segundos.',
    offerFallback: true,
  }
}

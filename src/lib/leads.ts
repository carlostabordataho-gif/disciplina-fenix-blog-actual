import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { funnel } from '../data/funnel'

// Cliente con guardas: si faltan las env vars el sitio NO se cae,
// el formulario reporta el fallo y ofrece la vía alterna (DM).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let client: SupabaseClient | null = null
if (supabaseUrl && supabaseKey) {
  client = createClient(supabaseUrl, supabaseKey)
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
  return fetch(webhookUrl, {
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

  if (!client) {
    // Sin Supabase, el webhook es la única vía: aquí sí lo esperamos.
    const webhookOk = await webhookPromise
    if (webhookOk) return { ok: true }
    return {
      ok: false,
      error: '> ERROR DE CONEXIÓN. Reintenta en unos segundos.',
      offerFallback: true,
    }
  }

  const { error } = await client.from('leads').insert({ email: clean, source })

  if (error) {
    // 23505 = unique_violation: ya estaba registrado => lo tratamos como éxito
    if (error.code === '23505') return { ok: true }
    // Supabase falló: si el webhook entró, el lead no se pierde.
    if (await webhookPromise) return { ok: true }
    return {
      ok: false,
      error: '> ERROR AL REGISTRAR. Reintenta en unos segundos.',
      offerFallback: true,
    }
  }

  return { ok: true }
}

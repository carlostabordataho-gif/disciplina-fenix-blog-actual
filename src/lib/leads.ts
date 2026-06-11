import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Cliente con guardas: si faltan las env vars el sitio NO se cae,
// el formulario reporta el fallo y ofrece la vía alterna (DM).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let client: SupabaseClient | null = null
if (supabaseUrl && supabaseKey) {
  client = createClient(supabaseUrl, supabaseKey)
}

export interface SaveLeadResult {
  ok: boolean
  error?: string
}

/**
 * Guarda un lead en la tabla `leads`.
 * @param email email del lead
 * @param source de dónde vino: 'reset' | 'home' | 'community' | ...
 */
export async function saveLead(email: string, source: string): Promise<SaveLeadResult> {
  const clean = email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return { ok: false, error: 'Email inválido.' }
  }

  if (!client) {
    return {
      ok: false,
      error: 'Registro no disponible en este momento. Escríbeme por TikTok @carlostaho y te lo envío directo.',
    }
  }

  const { error } = await client.from('leads').insert({ email: clean, source })

  if (error) {
    // 23505 = unique_violation: ya estaba registrado => lo tratamos como éxito
    if (error.code === '23505') return { ok: true }
    return {
      ok: false,
      error: 'No se pudo registrar. Intenta de nuevo o escríbeme por TikTok @carlostaho.',
    }
  }

  return { ok: true }
}

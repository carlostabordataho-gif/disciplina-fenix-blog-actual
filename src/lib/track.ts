// ─────────────────────────────────────────────────────────────────────
// TABORDA SYSTEM — Tracking de eventos para CRO (sin dependencias).
//
// Objetivo: medir el embudo landing → click en CTA → ingreso al operativo.
//
// Diseño (mismo espíritu que src/lib/leads.ts: el tracking NUNCA bloquea
// ni rompe la UX):
//   1. Loguea SIEMPRE en consola → visibilidad inmediata sin contratar nada.
//   2. Si VITE_ANALYTICS_URL está configurada, hace un POST fire-and-forget
//      (Plausible/Umami/n8n/webhook propio). Usa navigator.sendBeacon para
//      que el evento sobreviva a la navegación — clave en los clicks que
//      cambian de página o de dominio (ingreso al operativo).
//   3. Asigna un id anónimo persistente (localStorage, sin cookies de
//      terceros) para poder correlacionar el recorrido del mismo visitante.
//
// CERRAR EL LAZO CROSS-DOMAIN (clicks vs. llegadas al dashboard):
//   el subdominio del sistema (sistema.tabordasystem.com) puede emitir un
//   evento `operativo_arrival` con el mismo `vid` (se le puede pasar por la
//   URL) hacia el mismo VITE_ANALYTICS_URL. Así se mide cuánta gente hace
//   click aquí vs. cuánta realmente aterriza en el operativo.
// ─────────────────────────────────────────────────────────────────────

const COLLECTOR = import.meta.env.VITE_ANALYTICS_URL as string | undefined

const VID_KEY = 'ts_vid'

/** Id anónimo y persistente del visitante (sin PII, sin cookies). */
export function visitorId(): string {
  if (typeof localStorage === 'undefined') return 'ssr'
  try {
    let id = localStorage.getItem(VID_KEY)
    if (!id) {
      id = `v_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
      localStorage.setItem(VID_KEY, id)
    }
    return id
  } catch {
    // Modo incógnito con storage bloqueado: no rompemos nada.
    return 'no_storage'
  }
}

export interface TrackProps {
  [key: string]: unknown
}

/**
 * Registra un evento de producto.
 * @param event nombre del evento: 'cta_click' | 'operativo_enter' | 'lead_submit' | ...
 * @param props metadata libre (cta, to, source, ...).
 */
export function track(event: string, props: TrackProps = {}): void {
  const payload = {
    event,
    ...props,
    vid: visitorId(),
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    ts: new Date().toISOString(),
  }

  // 1) Consola: medición de día 1 sin depender de ningún servicio externo.
  if (typeof console !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log(`[track] ${event}`, payload)
  }

  // 2) Colector externo opcional (fire-and-forget, nunca lanza).
  if (COLLECTOR && COLLECTOR.startsWith('http') && typeof navigator !== 'undefined') {
    try {
      const body = JSON.stringify(payload)
      if (typeof navigator.sendBeacon === 'function') {
        // sendBeacon sobrevive al unload → no se pierde el click que navega.
        navigator.sendBeacon(COLLECTOR, body)
      } else {
        void fetch(COLLECTOR, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {})
      }
    } catch {
      /* El tracking jamás interrumpe la experiencia del usuario. */
    }
  }
}

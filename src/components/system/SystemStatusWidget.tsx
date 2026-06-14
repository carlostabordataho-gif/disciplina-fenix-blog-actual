import { useEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────
// TABORDA SYSTEM — Widget de Estado del Ecosistema.
//
// Muestra métricas en vivo del sistema (operadores activos + racha global)
// como prueba social junto a los CTA de ingreso al operativo.
//
// Se conecta por fetch al subdominio del sistema. Si la API no está
// disponible (o aún no existe), degrada con elegancia a un estado "STANDBY"
// — NUNCA rompe el render del blog ni bloquea la página.
//
// ── CONTRATO DE LA API (a implementar en sistema.tabordasystem.com) ──
//   GET ${VITE_SYSTEM_STATUS_URL}
//   → 200 application/json
//     {
//       "activeOperators": number,   // operadores con sesión activa hoy
//       "globalStreak": number,      // racha global agregada (días)
//       "updatedAt": string          // ISO8601 (opcional)
//     }
//   El endpoint debe responder con cabecera CORS:
//     Access-Control-Allow-Origin: https://tabordasystem.com
//   (es una petición cross-domain blog → sistema).
//
// Mientras VITE_SYSTEM_STATUS_URL no esté configurada, el widget vive en
// modo STANDBY: la estructura ("el sistema le habla al blog") ya queda
// lista; solo falta exponer el endpoint del lado del sistema.
// ─────────────────────────────────────────────────────────────────────

const STATUS_URL = import.meta.env.VITE_SYSTEM_STATUS_URL as string | undefined

interface SystemStatus {
  activeOperators: number
  globalStreak: number
  updatedAt?: string
}

type WidgetState = 'loading' | 'live' | 'offline'

export default function SystemStatusWidget() {
  const [data, setData] = useState<SystemStatus | null>(null)
  const [state, setState] = useState<WidgetState>(STATUS_URL ? 'loading' : 'offline')

  useEffect(() => {
    if (!STATUS_URL || !STATUS_URL.startsWith('http')) {
      setState('offline')
      return
    }
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 4000)

    fetch(STATUS_URL, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? (r.json() as Promise<SystemStatus>) : Promise.reject(r.status)))
      .then((json) => {
        setData(json)
        setState('live')
      })
      .catch(() => setState('offline'))
      .finally(() => clearTimeout(timeout))

    return () => {
      clearTimeout(timeout)
      ctrl.abort()
    }
  }, [])

  const isLive = state === 'live' && data
  const dotClass =
    state === 'live'
      ? 'bg-neon-primary animate-pulse'
      : state === 'loading'
        ? 'bg-accent-warn animate-pulse'
        : 'bg-neon-dim'
  const statusLabel =
    state === 'live' ? 'LIVE' : state === 'loading' ? 'SYNC…' : 'STANDBY'

  return (
    <div className="terminal-panel border border-bg-border inline-block text-left font-mono">
      {/* Header del panel */}
      <div className="flex items-center justify-between gap-6 px-4 py-2 border-b border-bg-border bg-bg-panel">
        <span className="text-[10px] uppercase tracking-widest text-text-muted">
          ECOSISTEMA :: estado_en_vivo
        </span>
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neon-primary">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotClass}`} />
          {statusLabel}
        </span>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 divide-x divide-bg-border">
        <div className="px-5 py-3">
          <div className="text-xl font-bold text-neon-primary">
            {isLive ? data!.activeOperators.toLocaleString('es-CO') : '——'}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-text-dim">
            Operadores activos
          </div>
        </div>
        <div className="px-5 py-3">
          <div className="text-xl font-bold text-neon-primary">
            {isLive ? `${data!.globalStreak.toLocaleString('es-CO')}d` : '——'}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-text-dim">
            Racha global
          </div>
        </div>
      </div>
    </div>
  )
}

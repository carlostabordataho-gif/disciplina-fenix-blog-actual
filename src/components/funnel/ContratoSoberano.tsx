import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { track } from '../../lib/track'
import { synth } from '../../lib/synth'

// ─────────────────────────────────────────────────────────────────────
// CONTRATO SOBERANO — dispositivo de compromiso (puente free → paid).
//
// Estrategia: un lead que acaba de pedir el RESET está en su pico de
// intención. Un "contrato" firmado consigo mismo (declarar enemigo +
// no-negociable + firma) sube la finalización del protocolo por
// psicología de compromiso, y abre la transición natural hacia la
// Cohorte: "un contrato sin testigo se rompe; la Cohorte es el testigo".
//
// No promete nada que no exista: el valor es el compromiso en sí. Se
// guarda en localStorage para que se sienta real y persista entre visitas.
// Cada firma emite un evento `contrato_firmado` para medir el puente.
// ─────────────────────────────────────────────────────────────────────

interface SignedContract {
  enemy: string
  nonNegotiable: string
  name: string
  date: string
}

const STORAGE_KEY = 'taborda_contrato_soberano'

interface Props {
  /** De dónde viene (para atribución del evento). */
  source?: string
}

export default function ContratoSoberano({ source = 'reset' }: Props) {
  const [enemy, setEnemy] = useState('')
  const [nonNegotiable, setNonNegotiable] = useState('')
  const [name, setName] = useState('')
  const [signed, setSigned] = useState<SignedContract | null>(null)

  // Si ya firmó antes, recuperamos su contrato (compromiso persistente).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSigned(JSON.parse(raw) as SignedContract)
    } catch {
      /* storage bloqueado (incógnito): el formulario sigue funcionando */
    }
  }, [])

  const canSign = enemy.trim() && nonNegotiable.trim() && name.trim()

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSign) return
    const contract: SignedContract = {
      enemy: enemy.trim(),
      nonNegotiable: nonNegotiable.trim(),
      name: name.trim(),
      date: new Date().toISOString().slice(0, 10),
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contract))
    } catch {
      /* sin persistencia: igual mostramos el contrato sellado en esta sesión */
    }
    synth.playSuccess()
    track('contrato_firmado', { source, enemy: contract.enemy, nonNegotiable: contract.nonNegotiable })
    setSigned(contract)
  }

  // ── Estado firmado: contrato sellado + puente a la Cohorte ──────────
  if (signed) {
    return (
      <div className="border border-neon-primary/30 bg-neon-primary/[0.03] px-5 py-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
          <span className="font-mono text-xs text-neon-primary tracking-widest uppercase">
            Contrato Soberano :: SELLADO
          </span>
        </div>

        <div className="font-mono text-xs leading-relaxed space-y-2 mb-5 border border-bg-border bg-bg-base p-4">
          <p className="text-text-muted">
            Yo, <span className="text-neon-primary font-bold">{signed.name}</span>, declaro la guerra a
            mi enemigo: <span className="text-accent-warn font-bold">{signed.enemy}</span>.
          </p>
          <p className="text-text-muted">
            Mi no-negociable diario es: <span className="text-text-primary font-bold">{signed.nonNegotiable}</span>.
          </p>
          <p className="text-text-muted">
            Lo ejecuto porque lo firmé, no porque tenga ganas. La motivación se agota. El sistema se ejecuta.
          </p>
          <p className="text-text-dim pt-2 border-t border-bg-border mt-2">
            Firmado el {signed.date} · expediente local #{Math.abs(hashCode(signed.name + signed.date)) % 100000}
          </p>
        </div>

        {/* Puente a la Cohorte: el contrato pide un testigo */}
        <div className="border border-accent-warn/30 bg-accent-warn/[0.04] p-4">
          <p className="font-mono text-xs text-text-muted leading-relaxed mb-3">
            <span className="text-accent-warn font-bold">⚠ Un contrato sin testigo es un deseo.</span> Casi todos
            estos pactos se rompen en los primeros 9 días — en privado, sin costo. La Cohorte Fénix es el testigo:
            alguien revisa cada noche si cumpliste lo que firmaste.
          </p>
          <Link
            to="/protocolo"
            onClick={() => { synth.playClick(); track('cta_click', { cta: 'contrato_bridge_cohorte', to: '/protocolo' }) }}
            onMouseEnter={() => synth.playHover()}
            className="btn-primary inline-block text-xs"
          >
            [ PONERLE TESTIGO A MI CONTRATO :: COHORTE FÉNIX ]
          </Link>
        </div>
      </div>
    )
  }

  // ── Estado inicial: firmar el contrato ──────────────────────────────
  return (
    <form onSubmit={handleSign} className="border border-bg-border bg-bg-base px-5 py-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-xs text-neon-primary tracking-widest uppercase">
          Paso 2 — Firma tu Contrato Soberano
        </span>
      </div>
      <p className="font-mono text-xs text-text-dim leading-relaxed mb-5">
        No es papeleo. Es la primera decisión del sistema: ponerle nombre a tu enemigo y a tu
        no-negociable. Lo que se nombra y se firma, se ejecuta.
      </p>

      <div className="space-y-3 mb-5">
        <label className="block">
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-wider">Mi enemigo principal</span>
          <input
            type="text"
            value={enemy}
            onChange={(e) => setEnemy(e.target.value)}
            placeholder="ej: el scroll nocturno, la nicotina, el porno…"
            maxLength={60}
            className="mt-1 w-full bg-bg-panel border border-bg-border text-text-primary font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-neon-primary/50 placeholder-text-dim transition-colors"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-wider">Mi no-negociable diario</span>
          <input
            type="text"
            value={nonNegotiable}
            onChange={(e) => setNonNegotiable(e.target.value)}
            placeholder="ej: entrenar 30 min, 0 redes antes de las 12…"
            maxLength={60}
            className="mt-1 w-full bg-bg-panel border border-bg-border text-text-primary font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-neon-primary/50 placeholder-text-dim transition-colors"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-wider">Firma (tu nombre)</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu nombre para firmar"
            maxLength={40}
            className="mt-1 w-full bg-bg-panel border border-bg-border text-text-primary font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-neon-primary/50 placeholder-text-dim transition-colors"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={!canSign}
        onMouseEnter={() => synth.playHover()}
        className="btn-primary w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
      >
        FIRMAR Y SELLAR EL CONTRATO
      </button>
    </form>
  )
}

/** Hash determinista para el número de expediente (estético, no seguridad). */
function hashCode(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}

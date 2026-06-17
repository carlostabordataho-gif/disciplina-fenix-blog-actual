import { useState } from 'react'
import { Link } from 'react-router-dom'
import { saveLead, validateEmail } from '../../lib/leads'
import { funnel, whatsappUrl } from '../../data/funnel'
import { track } from '../../lib/track'
import ContratoSoberano from './ContratoSoberano'

interface ResetCaptureProps {
  /** De dónde viene el lead: 'reset' | 'home' | 'community' */
  source: string
  /** Versión compacta (solo formulario, sin panel envolvente) */
  compact?: boolean
  /** Mostrar el Contrato Soberano al convertir. Por defecto: !compact.
   *  Se fuerza en /reset (form minimalista pero con puente post-registro). */
  showContrato?: boolean
}

type Status = 'idle' | 'sending' | 'done' | 'error'

export default function ResetCapture({ source, compact = false, showContrato }: ResetCaptureProps) {
  const contratoEnabled = showContrato ?? !compact
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  // Si la infraestructura falla (red/Supabase caídos), ofrecemos pedir
  // el protocolo por WhatsApp para no perder el lead.
  const [showFallback, setShowFallback] = useState(false)
  // Honeypot anti-bots: campo invisible que un humano nunca llena.
  const [trap, setTrap] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return

    // Bot detectado: fingimos éxito sin tocar la base de datos.
    if (trap) {
      setStatus('done')
      return
    }

    // Validación estricta en frontend antes de tocar la red.
    const validationError = validateEmail(email)
    if (validationError) {
      setErrorMsg(validationError)
      setStatus('error')
      return
    }

    setStatus('sending')
    const result = await saveLead(email, source)
    if (result.ok) {
      track('lead_submit', { source })
      setStatus('done')
    } else {
      setErrorMsg(result.error ?? 'Error desconocido.')
      setShowFallback(result.offerFallback === true)
      setStatus('error')
    }
  }

  const handleChange = (value: string) => {
    setEmail(value)
    if (status === 'error') {
      setStatus('idle')
      setErrorMsg('')
      setShowFallback(false)
    }
  }

  if (status === 'done') {
    return (
      <div className="border border-neon-primary/30 bg-neon-primary/5 px-5 py-5 text-left">
        {/* Log de instalación: el lead ve su Módulo 0.0 sin esperar el correo */}
        <div className="font-mono text-xs leading-relaxed mb-4">
          <p className="text-neon-primary font-bold">&gt; TABORDA SYSTEM v1.0 — acceso concedido</p>
          <p className="text-text-muted">&gt; descargando componentes........ <span className="text-neon-primary">100%</span></p>
          <p className="text-text-muted">&gt; Protocolo RESET inicializado.</p>
          <p className="text-text-muted">&gt; ejecutar hoy: <span className="text-neon-primary font-bold">MÓDULO 0.0</span></p>
        </div>

        <div className="border border-bg-border bg-bg-base px-4 py-3 mb-4">
          <p className="font-mono text-xs text-neon-primary tracking-widest uppercase mb-2">
            Módulo 0.0 — esta noche, antes de dormir
          </p>
          <ul className="font-mono text-xs text-text-muted space-y-1.5">
            <li>▸ Declarar tu vicio principal por escrito <span className="text-text-dim">[15 min]</span></li>
            <li>▸ Purgar el entorno: el vicio fuera de alcance <span className="text-text-dim">[45 min]</span></li>
            <li>▸ Dejar configurada la victoria de mañana <span className="text-text-dim">[10 min]</span></li>
          </ul>
          <p className="font-mono text-xs text-text-dim mt-2">
            Dependencias: 1 hoja · 1 esfero · 1 bolsa de basura. Motivación requerida: 0%.
          </p>
        </div>

        <div className="text-center">
          <a
            href={funnel.resetPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            ABRIR PROTOCOLO RESET — MÓDULO 0.0
          </a>
          {/* Sin promesa de email mientras n8n no esté activo: el protocolo
              se entrega completo aquí mismo, en el momento. */}
          <p className="font-mono text-xs text-text-dim mt-3">
            Acceso directo e inmediato. Guarda este enlace: es tuyo.
          </p>
        </div>

        {/* PASO 2 — Contrato Soberano: convierte el lead en compromiso firmado
            y abre el puente a la Cohorte. En /reset y en las capturas completas;
            se omite en el footer para no recargarlo. */}
        {contratoEnabled && (
          <div className="mt-5">
            <ContratoSoberano source={source} />
          </div>
        )}
      </div>
    )
  }

  const form = (
    <>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        {/* Honeypot: oculto para humanos, irresistible para bots */}
        <input
          type="text"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="tu@email.com"
          aria-label="Tu correo electrónico"
          aria-invalid={status === 'error'}
          autoComplete="email"
          required
          maxLength={254}
          disabled={status === 'sending'}
          className="flex-1 bg-bg-base border border-bg-border text-text-primary font-mono text-sm px-4 py-3 focus:outline-none focus:border-neon-primary/50 placeholder-text-dim transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-primary whitespace-nowrap disabled:opacity-50"
        >
          {status === 'sending' ? 'REGISTRANDO…' : 'EMPEZAR GRATIS'}
        </button>
      </form>
      {status === 'error' && (
        <p className="font-mono text-xs text-accent-warn mt-3 text-center">{errorMsg}</p>
      )}
      {status === 'error' && showFallback && (
        <p className="font-mono text-xs text-text-muted mt-2 text-center">
          ¿Sigue fallando?{' '}
          <a
            href={whatsappUrl('Hola Carlos, quiero el Protocolo RESET pero el formulario de la web me da error. Mi correo es: ')}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-neon-primary hover:text-neon-primary/80 transition-colors"
          >
            Pídemelo directo por WhatsApp
          </a>{' '}
          y te lo envío a mano.
        </p>
      )}
      <p className="font-mono text-xs text-text-dim mt-4 text-center">
        Sin spam. Sin frases bonitas. Un protocolo que se ejecuta o no se ejecuta.{' '}
        <Link to="/legal" className="underline hover:text-neon-primary transition-colors">
          Tratamiento de datos
        </Link>
        .
      </p>
    </>
  )

  if (compact) return <div>{form}</div>

  return (
    <section className="py-24 bg-bg-panel relative overflow-hidden">
      <div className="absolute inset-0 border-y border-bg-border pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className="terminal-panel border border-neon-primary/20 p-8 md:p-12 text-center"
          style={{ boxShadow: '0 0 40px rgba(0,255,65,0.05)' }}
        >
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
              <span className="section-label">PROTOCOLO RESET — GRATIS</span>
              <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
            </div>
          </div>

          <h2 className="font-mono text-2xl md:text-3xl font-bold text-text-primary mb-2">
            7 días para cortar el ciclo.
          </h2>
          <p className="font-sans text-text-muted text-sm leading-relaxed mb-8 max-w-md mx-auto">
            El protocolo de 7 días para recuperar el control: vicios, teléfono, caos.{' '}
            <span className="text-text-primary">Empieza hoy, sin pagar nada.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              'Protocolo día por día',
              'Diseño de entorno anti-vicios',
              'Plan de las primeras 48 horas',
              'Checklist diario imprimible',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-neon-primary text-xs">▸</span>
                <span className="font-mono text-xs text-text-muted">{item}</span>
              </div>
            ))}
          </div>

          {form}
        </div>
      </div>
    </section>
  )
}

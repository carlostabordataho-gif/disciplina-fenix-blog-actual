import { useState } from 'react'
import { Link } from 'react-router-dom'
import { saveLead, validateEmail } from '../../lib/leads'
import { funnel } from '../../data/funnel'

interface ResetCaptureProps {
  /** De dónde viene el lead: 'reset' | 'home' | 'community' */
  source: string
  /** Versión compacta (solo formulario, sin panel envolvente) */
  compact?: boolean
}

type Status = 'idle' | 'sending' | 'done' | 'error'

export default function ResetCapture({ source, compact = false }: ResetCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
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
      setStatus('done')
    } else {
      setErrorMsg(result.error ?? 'Error desconocido.')
      setStatus('error')
    }
  }

  const handleChange = (value: string) => {
    setEmail(value)
    if (status === 'error') {
      setStatus('idle')
      setErrorMsg('')
    }
  }

  if (status === 'done') {
    return (
      <div className="border border-neon-primary/30 bg-neon-primary/5 px-6 py-5 text-center">
        <p className="font-mono text-sm text-neon-primary font-bold mb-2">
          &gt; Acceso concedido.
        </p>
        <p className="font-sans text-xs text-text-muted mb-4">
          Tu email quedó registrado. Abre el protocolo ahora — el día 1 es hoy.
        </p>
        <a
          href={funnel.resetPdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block"
        >
          ABRIR PROTOCOLO RESET
        </a>
        <p className="font-mono text-xs text-text-dim mt-3">
          También te lo enviamos por correo. Revisa spam si no llega.
        </p>
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

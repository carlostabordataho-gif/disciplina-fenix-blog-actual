import { Link } from 'react-router-dom'
import ResetCapture from '../components/funnel/ResetCapture'
import { funnel } from '../data/funnel'
import usePageMeta from '../lib/usePageMeta'

// Landing de captura: destino del link in bio de TikTok.
// Sin navbar, sin footer, sin salidas. Un objetivo: el email.
export default function Reset() {
  usePageMeta(
    'Protocolo RESET gratis — 7 días para cortar el ciclo | Disciplina Fénix',
    'El protocolo exacto de 7 días para romper con los vicios, el teléfono y el caos. Gratis. No motivación: ejecución.'
  )

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col">
      <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none" />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
        <div className="max-w-xl w-full text-center">
          {/* Marca */}
          <div className="mb-8">
            <span className="font-mono text-sm font-bold tracking-widest text-neon-primary uppercase">
              DISCIPLINA FÉNIX
            </span>
            <span className="font-mono text-xs text-text-muted ml-2 tracking-wider">
              // Carlos Taborda
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
            <span className="font-mono text-xs text-neon-primary tracking-widest uppercase">
              PROTOCOLO RESET — GRATIS
            </span>
          </div>

          <h1 className="font-mono text-3xl md:text-4xl font-bold leading-tight mb-4">
            7 días para cortar el ciclo y{' '}
            <span className="text-neon-primary">recuperar el control.</span>
          </h1>

          <p className="font-sans text-text-muted text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
            El protocolo exacto para romper con los vicios, el teléfono y el caos.
            El mismo sistema con el que salí del pozo.{' '}
            <span className="text-text-primary font-medium">No motivación. Ejecución.</span>
          </p>

          <div className="flex flex-col items-start gap-2 mb-8 max-w-sm mx-auto">
            {[
              'El plan de las primeras 48 horas',
              'Diseño de entorno: que el vicio cueste más que la disciplina',
              'Checklist diario: se cumple o no se cumple',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-left">
                <span className="text-neon-primary text-xs mt-0.5">▸</span>
                <span className="font-mono text-xs text-text-muted">{item}</span>
              </div>
            ))}
          </div>

          <div
            className="terminal-panel border border-neon-primary/20 p-6"
            style={{ boxShadow: '0 0 40px rgba(0,255,65,0.05)' }}
          >
            <ResetCapture source="reset" compact showContrato />
          </div>

          {/* Única salida secundaria: la cohorte */}
          <div className="mt-8">
            <Link
              to="/protocolo"
              className="font-mono text-xs text-text-dim hover:text-neon-primary transition-colors"
            >
              ¿Listo para la versión premium? Instalación Supervisada · conexiones:{' '}
              {funnel.cohortSpotsTaken}/{funnel.cohortSpotsTotal} asignadas →
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center relative">
        <span className="font-mono text-xs text-text-dim">
          DISCIPLINA FÉNIX · El día 1 es hoy o no es nunca.
        </span>
      </footer>
    </div>
  )
}

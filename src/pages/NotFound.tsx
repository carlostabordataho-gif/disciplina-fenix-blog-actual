import { Link } from 'react-router-dom'
import ResetCapture from '../components/funnel/ResetCapture'
import usePageMeta from '../lib/usePageMeta'

// 404 en clave de sistema: la ruta falló, el funnel no.
// En vez de un callejón sin salida, ofrece el RESET gratis y las rutas vivas.
export default function NotFound() {
  usePageMeta(
    'ERROR 404 — Ruta no encontrada | TABORDA SYSTEM',
    'Esa ruta no existe en el sistema. Pero el Protocolo RESET gratis de 7 días sí: empieza hoy.'
  )

  return (
    <div className="min-h-screen pt-16 bg-bg-base flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div
          className="terminal-panel border border-accent-warn/30 p-8 md:p-10"
          style={{ boxShadow: '0 0 30px rgba(255,176,0,0.05)' }}
        >
          {/* Log del fallo */}
          <div className="font-mono text-xs leading-relaxed mb-8">
            <p className="text-accent-warn font-bold">&gt; ERROR 404 :: RUTA NO ENCONTRADA</p>
            <p className="text-text-muted">&gt; escaneando sistema................. <span className="text-neon-primary">OK</span></p>
            <p className="text-text-muted">&gt; el sistema sigue online. La ruta que escribiste, no.</p>
          </div>

          <h1 className="font-mono text-2xl md:text-3xl font-bold text-text-primary mb-3">
            Esta página no existe.{' '}
            <span className="text-neon-primary">Tu día 1 sí.</span>
          </h1>
          <p className="font-sans text-sm text-text-muted leading-relaxed mb-8 max-w-md">
            Ya que estás aquí: el Protocolo RESET de 7 días para cortar el ciclo es gratis
            y se entrega al instante.
          </p>

          <ResetCapture source="404" compact />

          <div className="border-t border-bg-border mt-8 pt-6 flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: 'Inicio', to: '/' },
              { label: 'Protocolo Fénix', to: '/protocolo' },
              { label: 'Blog', to: '/blog' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-mono text-xs text-text-muted hover:text-neon-primary transition-colors uppercase tracking-widest"
              >
                <span className="text-text-dim mr-2">&gt;</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

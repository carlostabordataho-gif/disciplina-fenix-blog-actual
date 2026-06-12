import { Link } from 'react-router-dom'
import ResetCapture from '../funnel/ResetCapture'

export default function Footer() {
  return (
    <footer className="border-t border-bg-border bg-bg-base relative overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="font-mono text-neon-primary text-sm font-bold tracking-widest uppercase flicker mb-2">
              DISCIPLINA FÉNIX
            </div>
            <div className="font-mono text-xs text-text-muted tracking-wider uppercase mb-6">
              Carlos Taborda
            </div>
            <p className="text-text-muted text-sm font-sans leading-relaxed mb-6">
              Un sistema de reconstrucción personal construido públicamente desde cero.
            </p>
            <div className="glow-line w-24 mb-6" />
            <a
              href="https://tiktok.com/@carlostaho"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-text-muted hover:text-neon-primary transition-colors uppercase tracking-widest"
            >
              [ TikTok → @carlostaho ]
            </a>
          </div>

          {/* Nav */}
          <div>
            <div className="hud-label mb-6">Navegación</div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Inicio', to: '/' },
                { label: 'Cohorte Fénix', to: '/protocolo' },
                { label: 'El Sistema', to: '/sistema' },
                { label: 'Blog', to: '/blog' },
                { label: 'Comunidad', to: '/comunidad' },
                { label: 'Road to 2030', to: '/road-to-2030' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-mono text-xs text-text-muted hover:text-neon-primary transition-colors uppercase tracking-widest"
                >
                  <span className="text-text-dim mr-2">//</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Captura: protocolo RESET gratis (mismo pipeline que /reset) */}
          <div>
            <div className="hud-label mb-2">Protocolo RESET — Gratis</div>
            <p className="font-mono text-xs text-text-muted mb-4 leading-relaxed">
              7 días para cortar el ciclo. Acceso inmediato.
            </p>
            <ResetCapture source="footer" compact />
          </div>
        </div>

        <div className="glow-line my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-text-dim tracking-widest uppercase">
            "Ejecución sobre motivación."
          </div>
          <div className="font-mono text-xs text-text-dim flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} Disciplina Fénix — Carlos Taborda</span>
            <Link to="/legal" className="hover:text-neon-primary transition-colors uppercase tracking-wider">
              Privacidad · Términos · Garantía
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Sistema', to: '/sistema' },
  { label: 'Blog', to: '/blog' },
  { label: 'Comunidad', to: '/comunidad' },
  { label: 'Road to 2030', to: '/road-to-2030' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-base/95 border-b border-bg-border backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none group">
            <span className="font-mono text-sm font-bold text-neon-primary tracking-widest uppercase flicker">
              DISCIPLINA FÉNIX
            </span>
            <span className="font-mono text-xs text-text-muted tracking-wider uppercase mt-0.5">
              Carlos Taborda
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `font-mono text-xs tracking-widest uppercase transition-all duration-200 ${
                    isActive
                      ? 'text-neon-primary'
                      : 'text-text-muted hover:text-text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/sistema" className="btn-primary text-xs py-2 px-4">
              Entrar al Sistema
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden font-mono text-xs text-text-muted hover:text-neon-primary transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? '[ CERRAR ]' : '[ MENU ]'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-bg-base/98 border-b border-bg-border"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `font-mono text-xs tracking-widest uppercase py-2 transition-colors ${
                      isActive ? 'text-neon-primary' : 'text-text-muted'
                    }`
                  }
                >
                  <span className="text-text-dim mr-2">&gt;</span>
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/sistema"
                className="btn-primary text-xs py-2 px-4 text-center mt-2"
              >
                Entrar al Sistema
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

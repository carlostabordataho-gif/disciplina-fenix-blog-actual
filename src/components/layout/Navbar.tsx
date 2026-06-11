import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { synth } from '../../lib/synth'

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Cohorte', to: '/protocolo' },
  { label: 'Sistema', to: '/sistema' },
  { label: 'Blog', to: '/blog' },
  { label: 'Comunidad', to: '/comunidad' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sfxEnabled, setSfxEnabled] = useState(synth.isEnabled())
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const toggleSound = () => {
    const newVal = !sfxEnabled
    synth.setEnabled(newVal)
    setSfxEnabled(newVal)
    synth.playClick()
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-base/95 border-b border-bg-border backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => synth.playClick()}
            onMouseEnter={() => synth.playHover()}
            className="flex flex-col leading-none group"
          >
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
                onClick={() => synth.playClick()}
                onMouseEnter={() => synth.playHover()}
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

          {/* CTA & Sound Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleSound}
              onMouseEnter={() => synth.playHover()}
              className="font-mono text-[10px] tracking-widest text-text-muted hover:text-neon-primary border border-bg-border hover:border-neon-primary/20 px-2.5 py-1.5 rounded-sm transition-all select-none uppercase"
            >
              {sfxEnabled ? '[ 🔊 SONIDO: ON ]' : '[ 🔇 SONIDO: OFF ]'}
            </button>
            <Link
              to="/reset"
              onClick={() => synth.playClick()}
              onMouseEnter={() => synth.playHover()}
              className="btn-primary text-xs py-2 px-4"
            >
              [ RESET GRATIS ]
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => {
              synth.playClick()
              setMobileOpen(!mobileOpen)
            }}
            onMouseEnter={() => synth.playHover()}
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
                  onClick={() => synth.playClick()}
                  onMouseEnter={() => synth.playHover()}
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

              <div className="flex flex-col gap-3 border-t border-bg-border pt-4">
                <button
                  onClick={toggleSound}
                  className="font-mono text-xs text-text-muted border border-bg-border px-3 py-2 rounded-sm text-center"
                >
                  {sfxEnabled ? '[ 🔊 SONIDO: ACTIVO ]' : '[ 🔇 SONIDO: MUTED ]'}
                </button>
                <Link
                  to="/reset"
                  onClick={() => synth.playClick()}
                  onMouseEnter={() => synth.playHover()}
                  className="btn-primary text-xs py-2 px-4 text-center"
                >
                  [ RESET GRATIS ]
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

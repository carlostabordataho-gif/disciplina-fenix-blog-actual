import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const typewriterLines = [
  'Renace desde la disciplina.',
  'Construye el sistema.',
  'Elimina el ruido.',
]

function useTypewriter(lines: string[], speed = 60) {
  const [displayed, setDisplayed] = useState('')
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => {
        setPaused(false)
        setDeleting(true)
      }, 2000)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      const currentLine = lines[lineIndex]
      if (!deleting) {
        if (charIndex < currentLine.length) {
          setDisplayed(currentLine.slice(0, charIndex + 1))
          setCharIndex((c) => c + 1)
        } else {
          setPaused(true)
        }
      } else {
        if (charIndex > 0) {
          setDisplayed(currentLine.slice(0, charIndex - 1))
          setCharIndex((c) => c - 1)
        } else {
          setDeleting(false)
          setLineIndex((l) => (l + 1) % lines.length)
        }
      }
    }, deleting ? speed / 2 : speed)

    return () => clearTimeout(t)
  }, [charIndex, deleting, lineIndex, lines, paused, speed])

  return displayed
}

const fakeDashboardData = [
  { label: 'STREAK', value: '47d', status: 'OK' },
  { label: 'GYM', value: '89/90', status: 'OK' },
  { label: 'DEEP WORK', value: '5h 22m', status: 'OK' },
  { label: 'VICES', value: '0', status: 'CLEAN' },
  { label: 'SLEEP', value: '7h 45m', status: 'OK' },
  { label: 'CALORIES', value: '3,200', status: 'ON_TARGET' },
]

export default function HeroSection() {
  const typedText = useTypewriter(typewriterLines)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const now = new Date()
  const timeStr = now.toTimeString().slice(0, 8)
  const dateStr = now.toISOString().slice(0, 10)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Grid background */}
      <div
        className="absolute inset-0 grid-bg opacity-60"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 255, 65, 0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 255, 65, 0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner decorators */}
      <div className="absolute top-20 left-4 font-mono text-xs text-text-dim opacity-40 hidden lg:block">
        <div className="border-l border-t border-neon-primary/20 w-8 h-8 mb-1" />
        <div className="text-neon-primary/30">SYS::ONLINE</div>
      </div>
      <div className="absolute top-20 right-4 font-mono text-xs text-text-dim opacity-40 hidden lg:block text-right">
        <div className="border-r border-t border-neon-primary/20 w-8 h-8 mb-1 ml-auto" />
        <div className="text-neon-primary/30">v2.0.26</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Hero copy */}
          <div>
            {/* System boot label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-8"
            >
              <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
              <span className="font-mono text-xs text-neon-primary tracking-widest uppercase">
                SISTEMA ACTIVO — DÍA 134
              </span>
            </motion.div>

            {/* Typewriter headline */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-none mb-2"
            >
              <span className="cursor-blink">{typedText}</span>
            </motion.h1>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8 mt-4"
            >
              <span
                className="font-mono text-lg md:text-xl font-bold tracking-widest text-neon-primary flicker"
              >
                DISCIPLINA FÉNIX
              </span>
              <span className="font-mono text-sm text-text-muted ml-3 tracking-wider">
                // Carlos Taborda
              </span>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="font-sans text-text-muted text-base md:text-lg leading-relaxed mb-10 max-w-lg"
            >
              Un sistema de reconstrucción personal basado en ejecución, protocolos y seguimiento real.{' '}
              <span className="text-text-primary font-medium">No motivación. No excusas.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/sistema" className="btn-primary">
                Entrar al Sistema
              </Link>
              <Link to="/sistema" className="btn-secondary">
                Ver el método
              </Link>
            </motion.div>

            {/* Mini stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-bg-border"
            >
              {[
                { label: 'Días en racha', value: '47' },
                { label: 'Sesiones gym', value: '89' },
                { label: 'Horas código', value: '340/mes' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-mono text-xl font-bold text-neon-primary">{stat.value}</div>
                  <div className="font-mono text-xs text-text-dim uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Fake dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="terminal-panel border border-bg-border">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-bg-border bg-bg-panel">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-warn" />
                  <div className="w-2 h-2 rounded-full bg-neon-dim" />
                  <div className="w-2 h-2 rounded-full bg-neon-primary" />
                </div>
                <span className="font-mono text-xs text-text-muted">PERSONAL_OS :: daily_review</span>
                <span className="font-mono text-xs text-neon-primary/50">{timeStr}</span>
              </div>

              {/* Dashboard content */}
              <div className="p-4 font-mono text-xs">
                {/* System header */}
                <div className="text-neon-primary mb-4">
                  <span className="text-text-dim">&gt; </span>
                  personal_os --status --date {dateStr}
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {fakeDashboardData.map((item) => (
                    <div
                      key={item.label}
                      className="bg-bg-base border border-bg-border p-2.5 hover:border-neon-primary/20 transition-colors"
                    >
                      <div className="text-text-dim uppercase text-xs mb-1">{item.label}</div>
                      <div className="text-neon-primary text-sm font-bold">{item.value}</div>
                      <div className="text-neon-dim text-xs mt-1">[ {item.status} ]</div>
                    </div>
                  ))}
                </div>

                {/* Progress bars */}
                <div className="space-y-2 mb-4">
                  <div className="text-text-dim uppercase text-xs mb-2">PROTOCOLO DIARIO</div>
                  {[
                    { label: 'Gym', pct: 100 },
                    { label: 'Deep Work', pct: 80 },
                    { label: 'Lectura', pct: 60 },
                    { label: 'Sin vicios', pct: 100 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className="text-text-dim w-24 text-xs">{item.label}</span>
                      <div className="flex-1 h-0.5 bg-bg-border">
                        <div
                          className="h-full bg-neon-primary transition-all duration-1000"
                          style={{ width: `${item.pct}%`, boxShadow: '0 0 6px rgba(0,255,65,0.5)' }}
                        />
                      </div>
                      <span className="text-neon-primary text-xs w-8">{item.pct}%</span>
                    </div>
                  ))}
                </div>

                {/* Terminal output */}
                <div className="border-t border-bg-border pt-3 space-y-1">
                  <div>
                    <span className="text-neon-secondary">[✓]</span>
                    <span className="text-text-muted ml-2">Racha de disciplina: ACTIVA</span>
                  </div>
                  <div>
                    <span className="text-neon-secondary">[✓]</span>
                    <span className="text-text-muted ml-2">Protocolo diario: 4/4 completados</span>
                  </div>
                  <div>
                    <span className="text-accent-warn">[!]</span>
                    <span className="text-text-muted ml-2">Road to 2030: 134 días en progreso</span>
                  </div>
                  <div className="mt-2 text-neon-primary">
                    <span className="animate-blink">_</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-base to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="font-mono text-xs text-text-dim uppercase tracking-widest">scroll</span>
        <motion.div
          className="w-px h-8 bg-neon-primary/30"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}

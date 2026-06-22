import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { synth } from '../../lib/synth'
import { track } from '../../lib/track'
import DecryptText from '../ui/DecryptText'
import HeroTerminal from './HeroTerminal'

export default function HeroSection() {
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
                TABORDA_SYSTEM :: ONLINE — EJECUCIÓN DOCUMENTADA EN VIVO · v2.0.26
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-none mb-2"
            >
              <DecryptText text="Deja de consumir motivación." delay={150} />{' '}
              <DecryptText
                text="Instala un sistema operativo de disciplina."
                className="text-neon-primary"
                delay={650}
              />
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
                TABORDA SYSTEM
              </span>
              <span className="font-mono text-sm text-text-muted ml-3 tracking-wider">
                // Disciplina Fénix · Carlos Taborda
              </span>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="font-sans text-text-muted text-base md:text-lg leading-relaxed mb-10 max-w-lg"
            >
              Esto no es un blog de consejos: es un sistema operativo que instalas en tu vida.
              Protocolos ejecutables, métricas diarias y consecuencias reales cuando fallas.
              Para hombres cansados de prometerse lo mismo cada lunes.{' '}
              <span className="text-text-primary font-medium">La motivación se agota. El sistema se ejecuta.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/reset"
                onClick={() => { synth.playClick(); track('cta_click', { cta: 'hero_reset', to: '/reset' }) }}
                onMouseEnter={() => synth.playHover()}
                className="btn-primary"
              >
                INICIAR INSTALACIÓN — RESET GRATIS
              </Link>
              <Link
                to="/protocolo"
                onClick={() => { synth.playClick(); track('cta_click', { cta: 'hero_premium', to: '/protocolo' }) }}
                onMouseEnter={() => synth.playHover()}
                className="btn-secondary"
              >
                [ INICIAR INSTALACIÓN SUPERVISADA :: VERSIÓN PREMIUM ]
              </Link>
            </motion.div>

            {/* Mini stats row: hechos verificables, no métricas infladas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-bg-border"
            >
              {[
                { label: 'Sin nicotina', value: '420+ días' },
                { label: 'Entrenador certificado', value: 'Bodytech' },
                { label: 'Developer', value: 'Empleado en tech' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-mono text-xl font-bold text-neon-primary">{stat.value}</div>
                  <div className="font-mono text-xs text-text-dim uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: consola interactiva real (el visitante escribe comandos) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="hidden lg:block"
          >
            <HeroTerminal />
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

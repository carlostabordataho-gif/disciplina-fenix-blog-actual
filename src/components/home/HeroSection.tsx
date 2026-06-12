import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { synth } from '../../lib/synth'
import { cohortSpotsLeft, funnel } from '../../data/funnel'

export default function HeroSection() {
  const [, setTick] = useState(0)

  // Interactive OS Dashboard State (demo etiquetada como simulación)
  const [gymDone, setGymDone] = useState(true)
  const [deepWorkDone, setDeepWorkDone] = useState(true)
  const [lecturaDone, setLecturaDone] = useState(true)
  const [sinViciosDone, setSinViciosDone] = useState(true)

  const [logs, setLogs] = useState<string[]>([
    'Racha de disciplina: ACTIVA',
    'Protocolo diario: 4/4 completados',
    'Modo demo: interactúa con el protocolo',
  ])

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const now = new Date()
  const timeStr = now.toTimeString().slice(0, 8)
  const dateStr = now.toISOString().slice(0, 10)

  const totalCompleted = [gymDone, deepWorkDone, lecturaDone, sinViciosDone].filter(Boolean).length

  const demoDashboardData = [
    { label: 'STREAK', value: totalCompleted === 4 ? '21d' : '20d', status: totalCompleted === 4 ? 'MAX' : 'OK' },
    { label: 'GYM', value: gymDone ? '21/21' : '20/21', status: gymDone ? 'OK' : 'PENDING' },
    { label: 'DEEP WORK', value: deepWorkDone ? '2h 30m' : '0h 00m', status: deepWorkDone ? 'OK' : 'PENDING' },
    { label: 'VICES', value: sinViciosDone ? '0' : '1', status: sinViciosDone ? 'CLEAN' : 'WARNING' },
    { label: 'SLEEP', value: '7h 45m', status: 'OK' },
    { label: 'CHECK-IN', value: '21/21', status: 'ON_TARGET' },
  ]

  const handleToggle = (habit: 'gym' | 'deepWork' | 'lectura' | 'sinVicios', current: boolean, setter: (v: boolean) => void) => {
    const nextState = !current
    setter(nextState)
    synth.playClick()

    const habitNames = {
      gym: 'Entrenamiento (Gym)',
      deepWork: 'Enfoque Profundo (Deep Work)',
      lectura: 'Lectura Diaria',
      sinVicios: 'Cero Vicios (Dopamina)',
    }

    const logMsg = nextState
      ? `[✓] ${habitNames[habit]} registrado.`
      : `[!] ${habitNames[habit]} cancelado.`

    // Compute future completed count
    const willBeCompleted = {
      gym: habit === 'gym' ? nextState : gymDone,
      deepWork: habit === 'deepWork' ? nextState : deepWorkDone,
      lectura: habit === 'lectura' ? nextState : lecturaDone,
      sinVicios: habit === 'sinVicios' ? nextState : sinViciosDone,
    }
    const nextTotal = Object.values(willBeCompleted).filter(Boolean).length

    let specialMsg = ''
    if (nextTotal === 4) {
      synth.playSuccess()
      specialMsg = '[✓] SISTEMA AL 100%: Racha consolidada (+1 día)'
    } else if (nextTotal === 3 && totalCompleted === 4) {
      specialMsg = '[!] Alerta: Protocolo degradado (incompleto)'
    }

    setLogs(prev => {
      const newLogs = [...prev, logMsg]
      if (specialMsg) newLogs.push(specialMsg)
      return newLogs.slice(-4) // Keep only 4 most recent logs
    })
  }

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
                TABORDA_SYSTEM :: ONLINE — INSTALACIÓN SUPERVISADA: {cohortSpotsLeft}/{funnel.cohortSpotsTotal} PLAZAS
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-none mb-2"
            >
              Deja de consumir motivación.{' '}
              <span className="text-neon-primary">Instala un sistema operativo de disciplina.</span>
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
                onClick={() => synth.playClick()}
                onMouseEnter={() => synth.playHover()}
                className="btn-primary"
              >
                INICIAR INSTALACIÓN — RESET GRATIS
              </Link>
              <Link
                to="/protocolo"
                onClick={() => synth.playClick()}
                onMouseEnter={() => synth.playHover()}
                className="btn-secondary"
              >
                INSTALACIÓN SUPERVISADA · {cohortSpotsLeft}/{funnel.cohortSpotsTotal} PLAZAS
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

          {/* Right: dashboard demo (simulación etiquetada) */}
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
                <span className="font-mono text-xs text-text-muted">TABORDA_SYSTEM :: SIMULACIÓN</span>
                <span className="font-mono text-xs text-neon-primary/50">{timeStr}</span>
              </div>

              {/* Dashboard content */}
              <div className="p-4 font-mono text-xs">
                {/* System header */}
                <div className="text-neon-primary mb-4">
                  <span className="text-text-dim">&gt; </span>
                  taborda_system --install --demo --date {dateStr}
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-2 mb-4 select-none">
                  {demoDashboardData.map((item) => (
                    <div
                      key={item.label}
                      className={`bg-bg-base border p-2.5 hover:border-neon-primary/20 transition-all duration-300 ${
                        item.status === 'WARNING' ? 'border-accent-warn/30 bg-accent-warn/5' : 'border-bg-border'
                      }`}
                    >
                      <div className="text-text-dim uppercase text-[10px] mb-1">{item.label}</div>
                      <div className={`text-sm font-bold transition-all duration-300 ${
                        item.status === 'WARNING' ? 'text-accent-warn animate-pulse' :
                        item.status === 'MAX' ? 'text-neon-primary neon-text' : 'text-neon-primary'
                      }`}>{item.value}</div>
                      <div className={`text-[10px] mt-1 ${
                        item.status === 'WARNING' ? 'text-accent-warn' : 'text-neon-dim'
                      }`}>[ {item.status} ]</div>
                    </div>
                  ))}
                </div>

                {/* Progress bars (checklist demo interactiva) */}
                <div className="space-y-2 mb-4 select-none">
                  <div className="text-text-dim uppercase text-xs mb-2">PROTOCOLO DIARIO (Haz click para interactuar)</div>
                  {[
                    { key: 'gym', label: 'Gym', done: gymDone, setter: setGymDone, pct: gymDone ? 100 : 0 },
                    { key: 'deepWork', label: 'Deep Work', done: deepWorkDone, setter: setDeepWorkDone, pct: deepWorkDone ? 100 : 0 },
                    { key: 'lectura', label: 'Lectura', done: lecturaDone, setter: setLecturaDone, pct: lecturaDone ? 100 : 0 },
                    { key: 'sinVicios', label: 'Sin vicios', done: sinViciosDone, setter: setSinViciosDone, pct: sinViciosDone ? 100 : 0 },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleToggle(item.key as any, item.done, item.setter)}
                      onMouseEnter={() => synth.playHover()}
                      className="w-full flex items-center gap-2 text-left group hover:bg-bg-panel/40 p-1.5 border border-transparent hover:border-bg-border rounded transition-all duration-200"
                    >
                      <span className="text-text-muted w-24 text-[11px] font-mono group-hover:text-neon-primary transition-colors flex items-center gap-1.5 shrink-0">
                        <span className={`inline-block w-2.5 h-2.5 border rounded-sm transition-all duration-300 ${
                          item.done ? 'bg-neon-primary border-neon-primary shadow-[0_0_6px_rgba(0,255,65,0.4)]' : 'border-text-dim'
                        }`} />
                        {item.label}
                      </span>
                      <div className="flex-1 h-1 bg-bg-border relative overflow-hidden rounded-sm">
                        <div
                          className="h-full bg-neon-primary transition-all duration-500 rounded-sm"
                          style={{ width: `${item.pct}%`, boxShadow: item.done ? '0 0 6px rgba(0,255,65,0.5)' : 'none' }}
                        />
                      </div>
                      <span className={`text-[11px] w-8 font-mono text-right transition-colors shrink-0 ${
                        item.done ? 'text-neon-primary' : 'text-text-dim'
                      }`}>
                        {item.pct}%
                      </span>
                    </button>
                  ))}
                </div>

                {/* Terminal output */}
                <div className="border-t border-bg-border pt-3 space-y-1 select-none">
                  {logs.map((log, idx) => {
                    const isError = log.includes('[!]');
                    const isSpecial = log.includes('100%');
                    return (
                      <div key={idx} className="transition-all duration-300">
                        <span className={isError ? 'text-accent-warn' : isSpecial ? 'text-neon-primary neon-text' : 'text-neon-secondary'}>
                          {isError ? '[!]' : '[✓]'}
                        </span>
                        <span className={`ml-2 ${isError ? 'text-text-muted font-bold' : 'text-text-muted'}`}>
                          {log.replace(/^[\[✓\!\]\s]*/, '')}
                        </span>
                      </div>
                    );
                  })}
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

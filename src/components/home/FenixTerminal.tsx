import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { synth } from '../../lib/synth'

interface LogEntry {
  text: string
  type: 'input' | 'system' | 'success' | 'warn' | 'dim' | 'ascii'
}

export default function FenixTerminal() {
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [inputVal, setInputVal] = useState('')
  const [entries, setEntries] = useState<LogEntry[]>([
    { text: '==================================================', type: 'system' },
    { text: '     INICIALIZANDO CONSOLA DE HÁBITOS FÉNIX v2.0   ', type: 'success' },
    { text: '==================================================', type: 'system' },
    { text: 'Acceso seguro establecido. Escribe "help" para ver', type: 'dim' },
    { text: 'los comandos disponibles en el núcleo del sistema.', type: 'dim' },
    { text: '', type: 'dim' },
  ])

  const terminalEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  const focusInput = () => {
    inputRef.current?.focus()
  }

  // Play keyboard sound on typing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
      synth.playTerminalType()
    }

    if (e.key === 'Enter') {
      const command = inputVal.trim()
      if (!command) return

      synth.playClick()
      executeCommand(command)
      setInputVal('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const nextIdx = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex
      setHistoryIndex(nextIdx)
      setInputVal(history[history.length - 1 - nextIdx])
      synth.playClick()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex <= 0) {
        setHistoryIndex(-1)
        setInputVal('')
      } else {
        const nextIdx = historyIndex - 1
        setHistoryIndex(nextIdx)
        setInputVal(history[history.length - 1 - nextIdx])
      }
      synth.playClick()
    }
  }

  const executeCommand = (cmd: string) => {
    const cleanCmd = cmd.toLowerCase().trim()
    const newEntries = [...entries, { text: `> ${cmd}`, type: 'input' as const }]
    setHistory(prev => [...prev, cmd])
    setHistoryIndex(-1)

    switch (cleanCmd) {
      case 'help':
        setEntries([
          ...newEntries,
          { text: 'COMANDOS DISPONIBLES EN ESTA TERMINAL:', type: 'system' },
          { text: '  streak     - Muestra tu racha activa en arte ASCII.', type: 'success' },
          { text: '  protocolo  - Despliega el stack de hábitos diarios.', type: 'success' },
          { text: '  vicios     - Muestra el registro de vicios erradicados.', type: 'success' },
          { text: '  mentor     - Muestra información táctica sobre la mentoría.', type: 'success' },
          { text: '  renacer    - Reinicia la consola y ejecuta autodiagnóstico.', type: 'warn' },
          { text: '  clear      - Limpia la pantalla de la consola.', type: 'dim' },
        ])
        break

      case 'streak':
        setEntries([
          ...newEntries,
          {
            text: `
███████ ████████ ██████  ███████  █████  ██   ██ 
██         ██    ██   ██ ██      ██   ██ ██  ██  
███████    ██    ██████  █████   ███████ █████   
     ██    ██    ██   ██ ██      ██   ██ ██  ██  
███████    ██    ██   ██ ███████ ██   ██ ██   ██ 
`,
            type: 'ascii'
          },
          { text: 'RACHA FÉNIX ACTIVA: [ 47 DÍAS ININTERRUMPIDOS ]', type: 'success' },
          { text: 'Estado general: EXECUTION_MODE_MAX', type: 'system' },
        ])
        break

      case 'protocolo':
        setEntries([
          ...newEntries,
          { text: 'STACK DIARIO DE ALTO RENDIMIENTO:', type: 'system' },
          { text: '  05:30 [CRÍTICO]   - Despertar, agua fría, sin teléfono.', type: 'success' },
          { text: '  06:00 [CRÍTICO]   - Deep Work Bloque 1 (2h 30m) - Enfoque Absoluto.', type: 'success' },
          { text: '  08:30 [STANDARD]  - Pausa activa, hidratación.', type: 'dim' },
          { text: '  08:45 [CRÍTICO]   - Deep Work Bloque 2 (2h 15m).', type: 'success' },
          { text: '  17:00 [CRÍTICO]   - Sesión de Gimnasio (Hipertrofia / Fuerza).', type: 'success' },
          { text: '  20:00 [STANDARD]  - Lectura y síntesis de conocimiento (Obsidian).', type: 'dim' },
          { text: '  22:00 [CRÍTICO]   - Cierre del sistema, planificación del día siguiente.', type: 'success' },
        ])
        break

      case 'vicios':
        setEntries([
          ...newEntries,
          { text: 'TABLA DE CONTROL DE VICIOS - DÍAS LIMPIO:', type: 'system' },
          { text: '  [✓] NICOTINA       - 420 días limpio [ESTADO: ELIMINADO]', type: 'success' },
          { text: '  [✓] PORNOGRAFÍA    - 134 días limpio [ESTADO: ELIMINADO]', type: 'success' },
          { text: '  [✓] COMIDA BASURA  -  67 días limpio [ESTADO: CONTROLADO]', type: 'success' },
          { text: '  [✓] REDES SOCIALES -  47 días limpio [ESTADO: ELIMINADO]', type: 'success' },
          { text: '--------------------------------------------------', type: 'dim' },
          { text: 'Diseño de entorno implementado al 100%. Cero fricción tolerable.', type: 'dim' },
        ])
        break

      case 'mentor':
        setEntries([
          ...newEntries,
          { text: '==================================================', type: 'warn' },
          { text: '   MENTORÍA DE ALTO RENDIMIENTO — CARLOS TAHO     ', type: 'success' },
          { text: '==================================================', type: 'warn' },
          { text: 'Propósito: Llevar tu cuerpo, mente y código al absoluto límite.', type: 'system' },
          { text: 'Método: Protocolo personalizado, traqueo táctico de hábitos,', type: 'system' },
          { text: 'desintoxicación dopaminérgica y sesiones 1-on-1 directas.', type: 'system' },
          { text: '', type: 'dim' },
          { text: '  [ REQUISITOS ]:', type: 'warn' },
          { text: '  - Voluntad inquebrantable para seguir directrices.', type: 'dim' },
          { text: '  - Cero excusas. Ejecución obligatoria sobre motivación.', type: 'dim' },
          { text: '', type: 'dim' },
          { text: 'Para postular a una de las vacantes limitadas, haz clic', type: 'success' },
          { text: 'en [ POSTULAR A MENTORÍA EXCLUSIVA ] en la sección anterior', type: 'success' },
          { text: 'o visita directamente tiktok.com/@carlostaho.', type: 'success' },
        ])
        break

      case 'renacer':
        synth.playBoot()
        setEntries([
          ...newEntries,
          { text: '>> REBOOT CONSOLA FÉNIX OS INICIADO...', type: 'warn' },
          { text: '  [i] Comprobando integridad del kernel... OK', type: 'dim' },
          { text: '  [i] Sincronizando base de datos Supabase... OK', type: 'dim' },
          { text: '  [i] Recalibrando receptores de dopamina... OK', type: 'dim' },
          { text: '  [✓] AUTODIAGNÓSTICO COMPLETO: SISTEMA FÉNIX RECONSTRUIDO.', type: 'success' },
          { text: 'No motivación. No excusas. Ejecuta.', type: 'system' },
        ])
        break

      case 'clear':
        setEntries([])
        break

      default:
        setEntries([
          ...newEntries,
          { text: `Error: Comando "${cmd}" no reconocido.`, type: 'warn' },
          { text: 'Escribe "help" para ver la lista de comandos válidos.', type: 'dim' },
        ])
    }
  }

  return (
    <div className="terminal-panel border border-bg-border w-full max-w-4xl mx-auto rounded-sm overflow-hidden select-none">
      {/* Bar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-bg-border bg-bg-panel">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-warn" />
          <div className="w-2.5 h-2.5 rounded-full bg-neon-dim" />
          <div className="w-2.5 h-2.5 rounded-full bg-neon-primary" />
        </div>
        <span className="font-mono text-xs text-text-muted">FENIX_OS :: interactive_shell.sh</span>
        <div className="w-16" />
      </div>

      {/* Terminal Body */}
      <div 
        onClick={focusInput}
        className="p-5 font-mono text-xs h-80 overflow-y-auto bg-black/60 relative cursor-text space-y-1.5 scrollbar-thin"
      >
        <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

        {entries.map((entry, idx) => {
          let colorClass = 'text-text-muted'
          if (entry.type === 'input') colorClass = 'text-neon-primary font-bold'
          else if (entry.type === 'system') colorClass = 'text-neon-secondary'
          else if (entry.type === 'success') colorClass = 'text-neon-primary neon-text'
          else if (entry.type === 'warn') colorClass = 'text-accent-warn'
          else if (entry.type === 'ascii') colorClass = 'text-neon-primary leading-none whitespace-pre font-bold text-[9px] md:text-xs overflow-x-auto pb-2'

          return (
            <div key={idx} className={colorClass}>
              {entry.text}
            </div>
          )
        })}

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input Line */}
      <div className="flex items-center gap-2 px-5 py-3.5 bg-bg-panel border-t border-bg-border">
        <span className="font-mono text-xs text-neon-primary font-bold shrink-0">$ fenix_os &gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="escribe help, streak, mentor..."
          className="w-full bg-transparent border-none outline-none font-mono text-xs text-neon-primary placeholder-neon-dim/40 focus:ring-0 focus:ring-offset-0 p-0"
        />
      </div>
    </div>
  )
}

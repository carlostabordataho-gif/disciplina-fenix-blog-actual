import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { synth } from '../../lib/synth'
import { track } from '../../lib/track'
import { funnel } from '../../data/funnel'

/**
 * HeroTerminal — consola INTERACTIVA real en el Hero (no una captura).
 *
 * Sustituye al panel pasivo anterior (dashboard / heatmap) por algo que el
 * visitante puede USAR: escribe comandos y el sistema responde. Coherente al
 * extremo con la narrativa "TABORDA SYSTEM" (un OS personal que, ahora,
 * literalmente se comporta como un OS) y orientado a conversión: comandos como
 * `iniciar`, `cohorte` o `sistema` navegan directo al funnel.
 *
 * Detalles:
 *  - Secuencia de arranque auto-tecleada; luego prompt interactivo enfocable.
 *  - Historial con flechas ↑/↓ (guiño power-user).
 *  - La "prueba social" (racha, días sin nicotina) vive dentro de `status`:
 *    un resultado de comando es mucho más creíble que un panel estático.
 *  - Respeta `prefers-reduced-motion` (sin tecleo: vuelca el arranque entero).
 */

type Tone = 'primary' | 'sec' | 'dim' | 'warn' | 'user'
type Line = { text: string; tone?: Tone }

const PROMPT = 'visitante@taborda:~$' // shell prompt

const TONE: Record<Tone, string> = {
  primary: 'text-neon-primary',
  sec: 'text-neon-secondary',
  dim: 'text-text-muted',
  warn: 'text-accent-warn',
  user: 'text-text-primary',
}

const BOOT: Line[] = [
  { text: 'TABORDA_SYSTEM v2.0.26 :: shell interactivo', tone: 'dim' },
  { text: 'Conexión segura establecida — sesión: visitante', tone: 'sec' },
  { text: 'Esto no es una imagen. Es una consola real.', tone: 'primary' },
  { text: "Escribe 'ayuda' (o toca un comando abajo) y pulsa Enter.", tone: 'dim' },
]

const HELP: Line[] = [
  { text: 'COMANDOS DISPONIBLES:', tone: 'primary' },
  { text: '  whoami       quién está detrás del sistema', tone: 'dim' },
  { text: '  status       métricas de disciplina, en vivo', tone: 'dim' },
  { text: '  manifiesto   la filosofía en 3 líneas', tone: 'dim' },
  { text: '  iniciar      arranca el Protocolo RESET (gratis)', tone: 'dim' },
  { text: '  cohorte      instalación supervisada (premium)', tone: 'dim' },
  { text: '  sistema      arquitectura del OS personal', tone: 'dim' },
  { text: '  limpiar      borra la consola', tone: 'dim' },
]

const CHIPS = ['ayuda', 'status', 'manifiesto', 'iniciar']

/** Resuelve un comando en líneas a imprimir + una acción opcional diferida. */
function resolve(
  raw: string,
  navigate: (to: string) => void
): { lines: Line[]; action?: () => void } {
  const cmd = raw.trim().toLowerCase()
  const echo: Line = { text: `${PROMPT} ${raw}`, tone: 'user' }
  const wrap = (lines: Line[], action?: () => void) => ({ lines: [echo, ...lines], action })
  const go = (to: string, msg: string, label: string) =>
    wrap([{ text: msg, tone: 'sec' }], () => {
      track('cta_click', { cta: `terminal_${label}`, to })
      navigate(to)
    })

  if (['ayuda', 'help', '?', 'comandos'].includes(cmd)) return wrap(HELP)

  if (['whoami', 'quien', 'quién'].includes(cmd))
    return wrap([
      { text: 'Carlos Taborda — developer empleado en tech.', tone: 'sec' },
      { text: 'Construyo disciplina en público, sin filtros.', tone: 'dim' },
      { text: 'Entrenador certificado (Bodytech) · 420+ días sin nicotina.', tone: 'dim' },
    ])

  if (['status', 'disciplina', 'stats'].includes(cmd))
    return wrap([
      { text: 'RACHA ACTUAL ....... 47 días', tone: 'primary' },
      { text: 'RÉCORD ............. 134 días', tone: 'sec' },
      { text: 'SIN NICOTINA ....... 420 días', tone: 'sec' },
      { text: 'EJECUTADOS ......... 279/364 · los huecos se reportan, no se ocultan', tone: 'dim' },
    ])

  if (['manifiesto', 'filosofia', 'filosofía'].includes(cmd))
    return wrap([
      { text: '1. La motivación se agota. El sistema se ejecuta.', tone: 'primary' },
      { text: '2. No subes al nivel de tus metas: caes al de tus sistemas.', tone: 'primary' },
      { text: '3. Aparecer siempre pesa más que la sesión perfecta.', tone: 'primary' },
    ])

  if (['iniciar', 'reset', 'start', 'empezar'].includes(cmd))
    return go('/reset', 'Montando Protocolo RESET... redirigiendo ▸', 'reset')
  if (['cohorte', 'protocolo', 'premium'].includes(cmd))
    return go('/protocolo', 'Abriendo instalación supervisada ▸', 'cohorte')
  if (['sistema', 'os', 'arquitectura'].includes(cmd))
    return go('/sistema', 'Cargando arquitectura del sistema ▸', 'sistema')
  if (['comunidad', 'community'].includes(cmd))
    return go('/comunidad', 'Entrando a la comunidad táctica ▸', 'comunidad')
  if (['blog', 'articulos', 'artículos'].includes(cmd))
    return go('/blog', 'Abriendo el blog ▸', 'blog')

  if (['tiktok', 'redes'].includes(cmd))
    return wrap([{ text: 'Abriendo TikTok @carlostaho ▸', tone: 'sec' }], () => {
      window.open(funnel.tiktokUrl, '_blank', 'noopener')
    })

  if (cmd === 'sudo' || cmd.startsWith('sudo '))
    return wrap([{ text: 'permiso denegado: la disciplina no se hackea, se ejecuta.', tone: 'warn' }])

  return wrap([{ text: `comando no reconocido: "${raw}". escribe 'ayuda'.`, tone: 'warn' }])
}

export default function HeroTerminal() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIndex, setHIndex] = useState(-1)
  const [booted, setBooted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Secuencia de arranque (línea a línea) → luego habilita el prompt.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setLines(BOOT)
      setBooted(true)
      return
    }
    // Revela el arranque línea a línea con slice() => `lines` es siempre un
    // prefijo válido de BOOT (nunca un índice fuera de rango / undefined) e
    // idempotente ante el doble-montaje de StrictMode o intervalos zombi del HMR.
    let n = 1
    setLines(BOOT.slice(0, n))
    const id = window.setInterval(() => {
      n++
      if (n >= BOOT.length) {
        setLines(BOOT)
        setBooted(true)
        window.clearInterval(id)
        return
      }
      setLines(BOOT.slice(0, n))
    }, 430)
    return () => window.clearInterval(id)
  }, [])

  // Enfoca el input al terminar el arranque (sin desplazar la página).
  useEffect(() => {
    if (booted) inputRef.current?.focus({ preventScroll: true })
  }, [booted])

  // Auto-scroll al fondo cuando entran líneas nuevas.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])

  const submit = (raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return
    synth.playClick()
    setHistory((prev) => [...prev, raw])
    setHIndex(-1)
    setInput('')

    if (['limpiar', 'clear', 'cls'].includes(cmd.toLowerCase())) {
      setLines([])
      return
    }

    const { lines: out, action } = resolve(raw, navigate)
    setLines((prev) => [...prev, ...out])
    if (action) window.setTimeout(action, 650)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const ni = hIndex < 0 ? history.length - 1 : Math.max(0, hIndex - 1)
      setHIndex(ni)
      setInput(history[ni])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hIndex < 0) return
      const ni = hIndex + 1
      if (ni >= history.length) {
        setHIndex(-1)
        setInput('')
      } else {
        setHIndex(ni)
        setInput(history[ni])
      }
    }
  }

  return (
    <div
      className="terminal-panel border border-bg-border"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-bg-border bg-bg-panel">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-warn" />
          <div className="w-2 h-2 rounded-full bg-neon-dim" />
          <div className="w-2 h-2 rounded-full bg-neon-primary" />
        </div>
        <span className="font-mono text-xs text-text-muted">taborda_system :: shell</span>
        <span className="font-mono text-xs text-neon-primary/70 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-primary animate-pulse" />
          EN VIVO
        </span>
      </div>

      {/* Salida + prompt */}
      <div
        ref={scrollRef}
        className="p-4 font-mono text-xs h-[348px] overflow-y-auto leading-relaxed"
      >
        {lines.filter(Boolean).map((l, i) => (
          <div key={i} className={`${TONE[l.tone ?? 'dim']} whitespace-pre-wrap break-words`}>
            {l.text}
          </div>
        ))}

        {booted && (
          <div className="flex items-start gap-2 mt-1">
            <span className="text-neon-primary shrink-0">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Consola interactiva: escribe un comando"
              className="flex-1 bg-transparent outline-none text-text-primary min-w-0"
              style={{ caretColor: '#00FF41' }}
            />
          </div>
        )}
      </div>

      {/* Comandos rápidos (descubribilidad + funciona con tap) */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-bg-border flex-wrap">
        <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider">probar:</span>
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => {
              inputRef.current?.focus({ preventScroll: true })
              submit(c)
            }}
            onMouseEnter={() => synth.playHover()}
            className="font-mono text-[11px] px-2 py-0.5 border border-bg-border text-text-muted hover:border-neon-primary/40 hover:text-neon-primary transition-colors rounded-sm"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}

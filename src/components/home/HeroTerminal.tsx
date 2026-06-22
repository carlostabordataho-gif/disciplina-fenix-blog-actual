import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { synth } from '../../lib/synth'
import { track } from '../../lib/track'
import { funnel } from '../../data/funnel'

/**
 * HeroTerminal — consola INTERACTIVA real en el Hero (no una captura).
 *
 * Además de los comandos del sistema, hospeda el RITUAL DIARIO: con `check-in`
 * marcas tu ejecución del día y la consola guarda tu RACHA en localStorage.
 * Eso convierte el blog en un mini-tracker gratis y le da a la gente una razón
 * concreta para volver CADA día (no romper la racha) — y un puente natural al
 * producto ("21 días → instala el sistema completo").
 *
 * Detalles:
 *  - Saludo personalizado al volver (según tu racha guardada).
 *  - Historial con flechas ↑/↓; chips para descubribilidad y uso táctil.
 *  - localStorage solo se toca en efectos/handlers (nunca en render) => el
 *    prerender de build no se rompe. Respeta `prefers-reduced-motion`.
 */

type Tone = 'primary' | 'sec' | 'dim' | 'warn' | 'user'
type Line = { text: string; tone?: Tone }

const PROMPT = 'visitante@taborda:~$'

const TONE: Record<Tone, string> = {
  primary: 'text-neon-primary',
  sec: 'text-neon-secondary',
  dim: 'text-text-muted',
  warn: 'text-accent-warn',
  user: 'text-text-primary',
}

// ── Racha diaria (localStorage) ──────────────────────────────────────────
const KEY_STREAK = 'tsx_streak'
const KEY_LAST = 'tsx_last_checkin'

/** "1 día" / "N días" — pluralización correcta. */
const dias = (n: number) => `${n} día${n === 1 ? '' : 's'}`

const dayKey = (d: Date) => d.toISOString().slice(0, 10)
const todayKey = () => dayKey(new Date())
const yesterdayKey = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return dayKey(d)
}

function readStreak(): { streak: number; last: string } {
  try {
    return {
      streak: parseInt(localStorage.getItem(KEY_STREAK) || '0', 10) || 0,
      last: localStorage.getItem(KEY_LAST) || '',
    }
  } catch {
    return { streak: 0, last: '' }
  }
}

function writeStreak(streak: number, last: string) {
  try {
    localStorage.setItem(KEY_STREAK, String(streak))
    localStorage.setItem(KEY_LAST, last)
  } catch {
    /* almacenamiento no disponible: el ritual degrada a no-persistente */
  }
}

const HELP: Line[] = [
  { text: 'COMANDOS DISPONIBLES:', tone: 'primary' },
  { text: '  check-in     marca tu ejecución de hoy (suma a tu racha)', tone: 'dim' },
  { text: '  racha        consulta tu racha actual', tone: 'dim' },
  { text: '  whoami       quién está detrás del sistema', tone: 'dim' },
  { text: '  status       métricas de disciplina, en vivo', tone: 'dim' },
  { text: '  manifiesto   la filosofía en 3 líneas', tone: 'dim' },
  { text: '  precio       la Instalación Supervisada (acceso inmediato)', tone: 'dim' },
  { text: '  reset        arranca el Protocolo RESET (gratis)', tone: 'dim' },
  { text: '  sistema · comunidad · blog · limpiar', tone: 'dim' },
]

const CHIPS = ['check-in', 'ayuda', 'status', 'precio']

/** Resuelve los comandos SIN estado (los de racha se manejan aparte). */
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

  if (['precio', 'cohorte', 'protocolo', 'premium'].includes(cmd))
    return wrap(
      [
        { text: `Instalación Supervisada · 21 días · acceso inmediato`, tone: 'sec' },
        { text: `Precio fundador: $${funnel.priceUsd} USD (sube a $${funnel.priceUsdRegular}). Abriendo ▸`, tone: 'primary' },
      ],
      () => {
        track('cta_click', { cta: 'terminal_precio', to: '/protocolo' })
        navigate('/protocolo')
      }
    )

  if (['reset', 'iniciar', 'start', 'empezar'].includes(cmd))
    return go('/reset', 'Montando Protocolo RESET... redirigiendo ▸', 'reset')
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
  const [streak, setStreak] = useState(0)
  const [checkedToday, setCheckedToday] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Arranque: lee la racha guardada, saluda en consecuencia y revela el boot.
  useEffect(() => {
    const { streak: savedStreak, last } = readStreak()
    const checked = last === todayKey()
    // La racha "viva" solo se mantiene si marcaste hoy o ayer; si no, está rota.
    const live = checked || last === yesterdayKey() ? savedStreak : 0
    setStreak(live)
    setCheckedToday(checked)

    const greet: Line = checked
      ? { text: `Bienvenido de vuelta. Hoy ya ejecutaste ✓ — racha: ${dias(live)} 🔥`, tone: 'sec' }
      : live > 0
        ? { text: `Bienvenido de vuelta. Racha: ${dias(live)} 🔥 — escribe 'check-in' para no romperla.`, tone: 'primary' }
        : { text: "Escribe 'ayuda', o marca tu día con 'check-in'.", tone: 'dim' }

    const boot: Line[] = [
      { text: 'TABORDA_SYSTEM v2.0.26 :: shell interactivo', tone: 'dim' },
      { text: 'Conexión segura establecida — sesión: visitante', tone: 'sec' },
      { text: 'Esto no es una imagen. Es una consola real.', tone: 'primary' },
      greet,
    ]

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setLines(boot)
      setBooted(true)
      return
    }

    let n = 1
    setLines(boot.slice(0, n))
    const id = window.setInterval(() => {
      n++
      if (n >= boot.length) {
        setLines(boot)
        setBooted(true)
        window.clearInterval(id)
        return
      }
      setLines(boot.slice(0, n))
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

  const echoOf = (raw: string): Line => ({ text: `${PROMPT} ${raw}`, tone: 'user' })

  /** check-in del día: sube la racha (o la reinicia si la rompiste). */
  const doCheckIn = (raw: string) => {
    const { streak: savedStreak, last } = readStreak()
    const today = todayKey()

    if (last === today) {
      setLines((prev) => [
        ...prev,
        echoOf(raw),
        { text: `Ya ejecutaste hoy. Racha: ${dias(savedStreak)} 🔥 — vuelve mañana para sumar.`, tone: 'sec' },
      ])
      setStreak(savedStreak)
      setCheckedToday(true)
      return
    }

    const continues = last === yesterdayKey()
    const next = continues ? savedStreak + 1 : 1
    writeStreak(next, today)
    setStreak(next)
    setCheckedToday(true)
    synth.playSuccess()
    track('cta_click', { cta: 'terminal_checkin', to: String(next) })

    const out: Line[] = [
      echoOf(raw),
      { text: '[✓] Ejecución de hoy registrada.', tone: 'primary' },
      { text: `RACHA: ${next} día${next === 1 ? '' : 's'} 🔥  — vuelve mañana para no romperla.`, tone: 'primary' },
    ]
    if (!continues && savedStreak > 0)
      out.splice(1, 0, { text: `(rompiste una racha de ${savedStreak}; empezamos de nuevo, sin drama)`, tone: 'dim' })

    const milestone =
      next === 3 ? 'Día 3: ya no es casualidad, es un patrón. Sigue.'
      : next === 7 ? '7 días seguidos. Una semana entera ejecutando — esto ya es identidad.'
      : next === 21 ? 'Día 21: acabas de instalar el sistema. ¿Listo para supervisarlo de verdad? escribe "precio".'
      : ''
    if (milestone) out.push({ text: milestone, tone: 'sec' })

    setLines((prev) => [...prev, ...out])
  }

  const submit = (raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return
    synth.playClick()
    setHistory((prev) => [...prev, raw])
    setHIndex(-1)
    setInput('')

    const low = cmd.toLowerCase()

    if (['limpiar', 'clear', 'cls'].includes(low)) {
      setLines([])
      return
    }
    if (['check-in', 'checkin', 'check'].includes(low)) {
      doCheckIn(raw)
      return
    }
    if (['racha', 'streak'].includes(low)) {
      setLines((prev) => [
        ...prev,
        echoOf(raw),
        streak > 0
          ? { text: `Racha actual: ${dias(streak)} 🔥${checkedToday ? ' (hoy ya marcado ✓)' : " — escribe 'check-in'"}`, tone: 'primary' }
          : { text: "Aún sin racha. Enciéndela hoy: escribe 'check-in'.", tone: 'dim' },
      ])
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
          {streak > 0 ? (
            <span className="tabular-nums">racha {streak} 🔥</span>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-neon-primary animate-pulse" />
              EN VIVO
            </>
          )}
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

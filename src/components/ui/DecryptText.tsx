import { useEffect, useRef, useState } from 'react'

/**
 * DecryptText — revela un texto como si el sistema lo estuviera descifrando:
 * la línea entra como ruido de glifos y se resuelve carácter por carácter de
 * izquierda a derecha. Coherente con la narrativa "TABORDA_SYSTEM :: ONLINE".
 *
 * Decisiones de diseño:
 *  - La fuente del titular es MONOESPACIADA (JetBrains Mono): cada glifo ocupa
 *    el mismo ancho, así que el conteo de caracteres es constante durante toda
 *    la animación => CERO salto de layout (CLS), incluso con texto multilínea.
 *  - El avance se mide por TIEMPO TRANSCURRIDO (no por nº de frames) y se
 *    conduce con setInterval. Frente a requestAnimationFrame esto da dos
 *    garantías importantes: (1) sigue corriendo aunque la pestaña no tenga
 *    foco —rAF se pausa cuando la página está oculta y dejaría el titular como
 *    ruido ilegible—, y (2) si la pestaña estuvo en segundo plano y vuelve, el
 *    siguiente tick ve el tiempo ya agotado y salta directo al texto final.
 *  - Respeta `prefers-reduced-motion`: muestra el texto final de inmediato.
 *  - Accesible: el contenedor expone el texto real vía `aria-label`; los glifos
 *    animados van en un hijo `aria-hidden` para no marear a un lector de pantalla.
 */

const GLYPHS = '!<>-_\\/[]{}=+*^?#ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

type Props = {
  text: string
  className?: string
  /** Duración total del descifrado, en ms (último carácter en fijarse). */
  duration?: number
  /** Retardo en ms antes de arrancar (para escalonar varias líneas). */
  delay?: number
}

export default function DecryptText({
  text,
  className = '',
  duration = 950,
  delay = 0,
}: Props) {
  const chars = Array.from(text)
  // Primer pintado: ya en ruido (no un flash vacío) para que el efecto se sienta inmediato.
  const [output, setOutput] = useState(() =>
    chars.map((c) => (c === ' ' ? ' ' : randomGlyph())).join('')
  )
  const [done, setDone] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setOutput(text)
      setDone(true)
      return
    }

    const lockable = chars.filter((c) => c !== ' ').length
    // Momento (ms desde el inicio) en que cada carácter se fija, escalonado
    // izquierda → derecha con un pelín de jitter para que no sea mecánico.
    let idx = -1
    const lockAt = chars.map((c) => {
      if (c === ' ') return 0
      idx++
      const base = lockable > 1 ? (idx / (lockable - 1)) * duration : duration
      return base + (Math.random() - 0.5) * 90
    })

    const buffer = chars.map((c) => (c === ' ' ? ' ' : randomGlyph()))
    let start: number | null = null

    const settle = () => {
      setOutput(text)
      setDone(true)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    const tick = () => {
      const now = performance.now()
      if (start === null) start = now
      const elapsed = now - start

      let remaining = 0
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === ' ') continue
        if (elapsed >= lockAt[i]) buffer[i] = chars[i]
        else {
          remaining++
          buffer[i] = randomGlyph()
        }
      }
      setOutput(buffer.join(''))
      if (remaining === 0) settle()
    }

    const startId = window.setTimeout(() => {
      // ~30 fps: fluido cuando es visible, barato siempre.
      intervalRef.current = window.setInterval(tick, 33)
      tick()
    }, delay)

    return () => {
      window.clearTimeout(startId)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // Solo re-ejecuta si cambia el texto a descifrar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <span
      className={`${className} ${done ? 'decrypt-done' : 'decrypt-active'}`}
      aria-label={text}
    >
      <span aria-hidden="true">{output}</span>
    </span>
  )
}

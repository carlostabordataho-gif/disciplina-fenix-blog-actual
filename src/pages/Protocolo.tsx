import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import TerminalPanel from '../components/ui/TerminalPanel'
import { cohortSpotsLeft, contactUrl, funnel } from '../data/funnel'
import usePageMeta from '../lib/usePageMeta'

const incluye = [
  {
    title: 'El Protocolo Fénix día por día',
    desc: 'Las 21 misiones exactas: no negociables, diseño de entorno, bloques de enfoque. Sin ambigüedad.',
  },
  {
    title: 'Llamada 1:1 de arranque (15 min)',
    desc: 'Calibramos tu protocolo a TU vida real: tu horario, tu vicio declarado, tu punto de partida.',
  },
  {
    title: 'Check-in diario obligatorio',
    desc: 'Cada noche reportas en el grupo. Yo reviso cada check-in. Fallar en privado es gratis; aquí tiene testigos.',
  },
  {
    title: '3 llamadas grupales (domingos)',
    desc: 'Semana 1: ajuste. Semana 2: la crisis (donde todos abandonan). Semana 3: consolidación y tu sistema propio.',
  },
  {
    title: 'Sistema de puntos y rangos',
    desc: '100 puntos diarios. Leaderboard semanal. Rango certificado al final: FÉNIX, OPERATIVO o SUPERVIVIENTE.',
  },
]

const noEs = [
  'No es un curso. Los cursos son información y la información gratis está en mi TikTok.',
  'No es una comunidad para charlar. Es un grupo de ejecución con reglas de expulsión.',
  'No es para curiosos. Si buscas frases bonitas, mi contenido es gratis.',
]

const faq = [
  {
    q: '¿Esto es un curso?',
    a: 'No. Esto es ejecución supervisada: protocolo exacto + alguien revisando cada noche si cumpliste. La diferencia entre saber qué hacer y hacerlo.',
  },
  {
    q: '¿Y si trabajo o estudio todo el día?',
    a: 'El protocolo se calibra contigo en la llamada 1:1 del día 0. No necesitas 5 horas libres: necesitas cumplir lo pactado.',
  },
  {
    q: '¿Necesito gym?',
    a: 'No. Hay versión de entrenamiento en casa. Lo no negociable es moverte 30 minutos, no el lugar.',
  },
  {
    q: '¿Qué pasa si recaigo en mi vicio?',
    a: 'Sigues dentro — si lo reportas. Tenemos un protocolo de 24 horas para las caídas. Lo único que te saca es esconderlo o desaparecer.',
  },
  {
    q: '¿Por qué tan barato?',
    a: 'Porque es la primera cohorte y estás comprando antes de que existan testimonios. Ese descuento es por el riesgo que asumes. No volverá a este precio.',
  },
  {
    q: '¿Cómo pago? ¿Es seguro?',
    a: 'El pago se procesa por Hotmart, la plataforma de pagos digitales más grande de Latinoamérica: tarjeta, PSE o Nequi, en pesos colombianos. Yo nunca veo ni guardo tus datos de pago. Recibes confirmación y factura al instante.',
  },
  {
    q: '¿Qué pasa apenas pago?',
    a: 'Recibes un email de confirmación con el acceso al grupo privado y el link para agendar tu llamada 1:1 de arranque. Te escribo personalmente en menos de 24 horas. Tu plaza queda contada públicamente en el contador de la cohorte.',
  },
]

export default function Protocolo() {
  usePageMeta(
    'Cohorte Fénix — 21 días de ejecución supervisada | Disciplina Fénix',
    'Protocolo de 21 días con check-in diario revisado, llamada 1:1 y llamadas grupales. 10 plazas. Precio fundador $35 USD / $140.000 COP.'
  )

  return (
    <div className="min-h-screen pt-16 bg-bg-base">
      {/* Header / Hero de venta */}
      <div className="border-b border-bg-border bg-bg-panel relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
            <span className="font-mono text-xs text-neon-primary tracking-widest uppercase">
              COHORTE FUNDADORA · {cohortSpotsLeft}/{funnel.cohortSpotsTotal} PLAZAS DISPONIBLES
            </span>
          </div>

          <h1 className="font-mono text-3xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
            21 días para dejar de prometerte{' '}
            <span className="text-neon-primary">cosas que no cumples.</span>
          </h1>

          <p className="font-sans text-text-muted text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            El Protocolo Fénix no es un curso. Es un sistema de ejecución supervisada:
            protocolo exacto día por día, check-in diario obligatorio, y yo revisando que lo
            cumplas. <span className="text-text-primary font-medium">No motivación. Consecuencia.</span>
          </p>

          <a href={funnel.checkoutUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
            RECLAMAR MI PLAZA — ${funnel.priceUsd} USD
          </a>
          <p className="font-mono text-xs text-text-dim mt-3">
            ${funnel.priceCop} COP · Precio fundador · Único pago · Inicio: {funnel.cohortStartDate}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Historia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <TerminalPanel title="EXPEDIENTE :: CARLOS TABORDA">
            <div className="p-6">
              <p className="font-sans text-sm text-text-muted leading-relaxed mb-4">
                Yo estuve en el pozo: flaco, sin autoestima, atrapado en dopamina barata. Con
                este sistema me reconstruí:
              </p>
              <div className="space-y-2 mb-4">
                {[
                  '420+ días sin nicotina. Cold turkey, protocolo de entorno.',
                  'De no levantar la barra a entrenador en Bodytech, el gimnasio más exigente de Colombia.',
                  'Conseguí trabajo como developer estudiando con el mismo sistema de bloques de enfoque.',
                  'Todo documentado en público, día por día, en @carlostaho.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-neon-primary text-xs mt-1">·</span>
                    <span className="font-mono text-xs text-text-primary">{item}</span>
                  </div>
                ))}
              </div>
              <p className="font-sans text-sm text-text-muted leading-relaxed">
                No te vendo teoría de gurú. Te vendo el protocolo exacto que ejecuté — y la
                vigilancia para que tú sí lo cumplas.
              </p>
            </div>
          </TerminalPanel>
        </motion.div>

        {/* Qué incluye */}
        <div>
          <div className="section-label mb-6">QUÉ INCLUYE</div>
          <div className="space-y-3">
            {incluye.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="terminal-panel border border-bg-border p-5 hover:border-neon-primary/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-2xl font-bold text-neon-primary/30">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-text-primary mb-1">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Qué NO es */}
        <div>
          <div className="section-label mb-6">QUÉ NO ES</div>
          <div className="terminal-panel border border-accent-warn/20 p-6 space-y-3">
            {noEs.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-accent-warn text-xs mt-0.5">✕</span>
                <span className="font-sans text-sm text-text-muted">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Para quién */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="terminal-panel border border-neon-primary/20 p-6">
            <div className="font-mono text-xs text-neon-primary mb-3 uppercase tracking-widest">
              ✓ Es para ti si
            </div>
            <p className="font-sans text-sm text-text-muted leading-relaxed">
              Estás saliendo de una ruptura, de un vicio, o del enésimo intento fallido de ser
              constante — y ya entendiste que solo no puedes.
            </p>
          </div>
          <div className="terminal-panel border border-bg-border p-6">
            <div className="font-mono text-xs text-accent-warn mb-3 uppercase tracking-widest">
              ✕ No es para ti si
            </div>
            <p className="font-sans text-sm text-text-muted leading-relaxed">
              Quieres "ver de qué se trata". Las plazas son 10 y cada una le quita el lugar a
              alguien dispuesto a ejecutar.
            </p>
          </div>
        </div>

        {/* Cómo funciona */}
        <div>
          <div className="section-label mb-6">CÓMO FUNCIONA</div>
          <TerminalPanel title="PROTOCOLO :: secuencia_de_ejecución">
            <div className="p-6 space-y-4">
              {[
                { t: 'DÍA 0', d: 'Llamada 1:1 conmigo (15 min). Declaras tu vicio principal, pactamos tu hora de despertar y firmas el pacto en el grupo.' },
                { t: 'DÍAS 1-21', d: 'Ejecutas el protocolo del día y reportas tu check-in cada noche antes de las 23:00. Yo reviso todos.' },
                { t: 'DOMINGOS', d: 'Llamada grupal de 60 minutos: leaderboard, doctrina y resolución de casos reales.' },
                { t: 'LA REGLA', d: '3 check-ins perdidos sin avisar: fuera, sin reembolso. Mentir en un check-in: fuera, inmediato. La regla es el producto.' },
              ].map((item) => (
                <div key={item.t} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                  <span className="font-mono text-xs font-bold text-neon-primary w-24 shrink-0">
                    {item.t}
                  </span>
                  <span className="font-sans text-sm text-text-muted leading-relaxed">{item.d}</span>
                </div>
              ))}
            </div>
          </TerminalPanel>
        </div>

        {/* Precio + garantía */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="terminal-panel border border-neon-primary/30 p-8 text-center"
          style={{ boxShadow: '0 0 30px rgba(0,255,65,0.06)' }}
        >
          <div className="section-label mb-4 block">PRECIO FUNDADOR</div>
          <div className="font-mono text-4xl font-bold text-neon-primary mb-1">
            ${funnel.priceUsd} USD
          </div>
          <div className="font-mono text-sm text-text-muted mb-6">
            ${funnel.priceCop} COP · único pago · la cohorte 2 costará el doble
          </div>
          <a
            href={funnel.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block mb-6"
          >
            RECLAMAR MI PLAZA ({cohortSpotsLeft} DISPONIBLES)
          </a>
          <p className="font-sans text-xs text-text-muted max-w-md mx-auto leading-relaxed">
            <span className="text-text-primary font-bold">Garantía Fénix:</span> completa los 21
            check-ins y si no sientes un cambio real, te devuelvo el 100%. Si abandonas, no hay
            reembolso. Los dos sabemos por qué.{' '}
            <Link to="/legal#garantia" className="underline hover:text-neon-primary transition-colors">
              Términos formales aquí
            </Link>
            .
          </p>
        </motion.div>

        {/* FAQ */}
        <div>
          <div className="section-label mb-6">PREGUNTAS DIRECTAS</div>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="terminal-panel border border-bg-border group">
                <summary className="p-4 font-mono text-sm font-bold text-text-primary cursor-pointer list-none flex items-center justify-between hover:text-neon-primary transition-colors">
                  {item.q}
                  <span className="text-neon-primary text-xs ml-4 group-open:rotate-90 transition-transform">
                    &gt;
                  </span>
                </summary>
                <p className="px-4 pb-4 font-sans text-sm text-text-muted leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="text-center py-8">
          <h2 className="font-mono text-xl md:text-2xl font-bold text-text-primary mb-6">
            El lunes perfecto no existe. <span className="text-neon-primary">El sistema sí.</span>
          </h2>
          <a
            href={funnel.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            RECLAMAR MI PLAZA — ${funnel.priceUsd} USD
          </a>
          <p className="font-mono text-xs text-text-dim mt-4">
            Día 1 es hoy o no es nunca.
          </p>
          <p className="font-mono text-xs text-text-muted mt-8">
            ¿Una duda concreta antes de decidir?{' '}
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-primary underline hover:no-underline"
            >
              Escríbeme directo
            </a>{' '}
            y te respondo yo. Prefiero un "no" informado que un comprador confundido.
          </p>
        </div>
      </div>
    </div>
  )
}

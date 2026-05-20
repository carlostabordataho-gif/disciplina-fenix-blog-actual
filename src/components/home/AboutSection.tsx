import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'

const timelineEvents = [
  {
    year: '2020',
    label: 'PUNTO CERO',
    title: 'La caída',
    desc: 'Adicción, sin dirección. Consumo de dopamina sin control. Sin sistemas. Sin identidad clara. La persona más alejada posible de lo que quería ser.',
    color: 'warn',
  },
  {
    year: '2021',
    label: 'REINICIO',
    title: 'La decisión',
    desc: 'No hubo una revelación. Hubo un hartazgo. Empecé a leer sobre sistemas de hábitos. Descubrí el gym como primer protocolo disciplinado.',
    color: 'muted',
  },
  {
    year: '2022',
    label: 'SISTEMAS',
    title: 'Los primeros protocolos',
    desc: 'Gym consistente. 90 días sin vicios. Primeros hábitos de lectura. Descubrí la programación como herramienta de construcción de realidad.',
    color: 'muted',
  },
  {
    year: '2023',
    label: 'CODIGO',
    title: 'El desarrollador emerge',
    desc: 'Aprendizaje acelerado de programación. Primeros proyectos reales. La disciplina del gym aplicada al código. Deep work como filosofía de vida.',
    color: 'green',
  },
  {
    year: '2024',
    label: 'ARQUITECTURA',
    title: 'Disciplina Fénix nace',
    desc: 'Documenté el sistema que usé para reconstruirme. Lo llamé Disciplina Fénix. El primer protocolo completo. La primera comunidad.',
    color: 'green',
  },
  {
    year: '2025–2030',
    label: 'EJECUCION',
    title: 'Build in Public',
    desc: 'Documentando públicamente cada día. Gym. Código. Sistemas. Mentalidad. El objetivo: demostrar que la transformación sistemática es reproducible.',
    color: 'primary',
  },
]

export default function AboutSection() {
  return (
    <section className="py-24 bg-bg-panel relative overflow-hidden">
      <div className="absolute inset-0 border-y border-bg-border pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="FUNDADOR"
          title={<>Carlos Taborda.<br /><span className="text-neon-primary">El proceso.</span></>}
          subtitle="No vine de una familia rica. No tuve un mentor. Me reconstruí desde cero con sistemas, protocolo y obsesión por la ejecución."
        />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-bg-border" />
            <div className="space-y-8">
              {timelineEvents.map((event, i) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4 relative pl-12"
                >
                  {/* Dot */}
                  <div
                    className={`absolute left-4 top-2 w-3 h-3 border-2 -translate-x-1/2 ${
                      event.color === 'primary'
                        ? 'border-neon-primary bg-neon-primary'
                        : event.color === 'green'
                        ? 'border-neon-primary bg-bg-base'
                        : event.color === 'warn'
                        ? 'border-accent-warn bg-bg-base'
                        : 'border-text-dim bg-bg-base'
                    }`}
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`font-mono text-xs font-bold ${
                          event.color === 'primary' || event.color === 'green'
                            ? 'text-neon-primary'
                            : event.color === 'warn'
                            ? 'text-accent-warn'
                            : 'text-text-muted'
                        }`}
                      >
                        {event.year}
                      </span>
                      <span className="tag">{event.label}</span>
                    </div>
                    <h3 className="font-mono text-sm font-bold text-text-primary mb-1">{event.title}</h3>
                    <p className="font-sans text-xs text-text-muted leading-relaxed">{event.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Identity card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="terminal-panel border border-bg-border p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-bg-border">
                <div>
                  <div className="font-mono text-sm font-bold text-text-primary">Carlos Taborda</div>
                  <div className="font-mono text-xs text-neon-primary mt-0.5">Fundador — Disciplina Fénix</div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'ROL', value: 'Developer + Discipline Strategist' },
                  { label: 'MISIÓN', value: 'Documentar la reconstrucción personal pública' },
                  { label: 'FILOSOFÍA', value: 'Sistemas > Motivación' },
                  { label: 'MÉTODO', value: 'Protocolos + Accountability + Ejecución' },
                  { label: 'ESTADO', value: 'Building in Public — DÍA 134' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <span className="font-mono text-xs text-text-dim w-24 uppercase shrink-0">{item.label}</span>
                    <span className="font-mono text-xs text-text-primary">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="glow-line my-6" />

              <div className="font-mono text-xs text-text-muted leading-relaxed">
                <span className="text-neon-primary">&gt; </span>
                "La motivación es un estado emocional temporal. Los sistemas son permanentes. Construí uno. Ahora lo documento."
              </div>
            </div>

            {/* Principles */}
            <div className="mt-6 space-y-2">
              {[
                'La disciplina no es motivación. Es ingeniería conductual.',
                'El fracaso documentado vale más que el éxito silencioso.',
                'Construir en público es la accountability más poderosa.',
                'Los sistemas sobreviven cuando la voluntad falla.',
              ].map((principle, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-neon-primary font-mono text-xs mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-sans text-xs text-text-muted leading-relaxed">{principle}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SectionHeader from '../ui/SectionHeader'
import TerminalPanel from '../ui/TerminalPanel'

const protocols = [
  {
    id: 'PROT-01',
    title: 'Anti-Dopamina',
    desc: 'Eliminación sistémica de recompensas instantáneas. Diseño de entorno, sustitución de hábitos y recalibración dopaminérgica progresiva.',
    metrics: ['47d sin scroll pasivo', 'Redes: 0 min/día', 'Recompensas: solo naturales'],
    status: 'ACTIVE',
  },
  {
    id: 'PROT-02',
    title: 'Deep Work Blocks',
    desc: 'Bloques de trabajo profundo de 5h sin interrupciones. Ritual de entrada, entorno controlado y revisión post-bloque.',
    metrics: ['5h bloque mañana', 'Teléfono: habitación separada', 'Flow avg: 78 min'],
    status: 'ACTIVE',
  },
  {
    id: 'PROT-03',
    title: 'Physical Protocol',
    desc: 'Sistema de entrenamiento basado en consistencia sobre intensidad. 6 días/semana. Registro de progreso. Nutrición estructurada.',
    metrics: ['6 días/semana', '89 sesiones completadas', 'Progresión lineal activa'],
    status: 'ACTIVE',
  },
  {
    id: 'PROT-04',
    title: 'Sleep Architecture',
    desc: 'Optimización del sueño como pilar de rendimiento. Hora fija de despertar, ritual nocturno y entorno controlado.',
    metrics: ['06:00 despertar fijo', '7h 30m promedio', 'Sin pantallas 1h antes'],
    status: 'ACTIVE',
  },
  {
    id: 'PROT-05',
    title: 'Weekly Review System',
    desc: 'Revisión semanal de métricas, ajuste de sistemas y planificación táctica. El sistema que mantiene el sistema.',
    metrics: ['Domingo 19:00', 'Métricas + próxima semana', '100% ejecución en 2026'],
    status: 'ACTIVE',
  },
  {
    id: 'PROT-06',
    title: 'Knowledge Acquisition',
    desc: 'Sistema de lectura y aprendizaje estructurado. 52 libros/año. Notas en Obsidian. Síntesis semanal.',
    metrics: ['12 libros en 2026', '25 min lectura/día', 'Notas síntesis'],
    status: 'ACTIVE',
  },
]

export default function SystemSection() {
  return (
    <section className="py-24 bg-bg-base relative overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          label="EL SISTEMA"
          title={<>Disciplina Fénix.<br /><span className="text-neon-primary">El método.</span></>}
          subtitle="No es un curso de motivación. Es una arquitectura de conducta. Protocolos reales ejecutados día a día."
        />

        {/* Philosophy block */}
        <TerminalPanel title="SISTEMA :: filosofia_central" className="mb-10" animate>
          <div className="p-6 grid md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Sistemas > Motivación',
                desc: 'La motivación es inestable. Los sistemas son permanentes. Diseña comportamientos, no estados emocionales.',
              },
              {
                num: '02',
                title: 'Identidad > Objetivos',
                desc: 'No "quiero ir al gym". Soy una persona disciplinada y las personas disciplinadas van al gym. La identidad primero.',
              },
              {
                num: '03',
                title: 'Ejecución > Planificación',
                desc: 'El plan perfecto que no se ejecuta vale cero. El plan imperfecto que se ejecuta todos los días cambia todo.',
              },
            ].map((item) => (
              <div key={item.num} className="flex flex-col gap-2">
                <span className="font-mono text-3xl font-bold text-neon-primary/20">{item.num}</span>
                <h3 className="font-mono text-sm font-bold text-text-primary">{item.title}</h3>
                <p className="font-sans text-xs text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </TerminalPanel>

        {/* Protocol cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {protocols.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="terminal-panel border border-bg-border p-4 hover:border-neon-primary/30 transition-colors duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-text-dim">{p.id}</span>
                <span className="tag-green">{p.status}</span>
              </div>
              <h3 className="font-mono text-sm font-bold text-text-primary mb-2 group-hover:text-neon-primary transition-colors">
                {p.title}
              </h3>
              <p className="font-sans text-xs text-text-muted leading-relaxed mb-3">{p.desc}</p>
              <div className="border-t border-bg-border pt-3 space-y-1">
                {p.metrics.map((m) => (
                  <div key={m} className="flex items-center gap-2">
                    <span className="text-neon-primary text-xs">▸</span>
                    <span className="font-mono text-xs text-text-dim">{m}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-start">
          <Link to="/sistema" className="btn-primary">
            Ver el sistema completo
          </Link>
        </div>
      </div>
    </section>
  )
}

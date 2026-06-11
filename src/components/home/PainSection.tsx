import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'

const pains = [
  {
    id: 'P1',
    title: 'El ciclo de dopamina',
    desc: 'Te acuestas tarde viendo contenido que no recuerdas a la mañana siguiente. Sabes que te está costando la vida que querías, y vuelves igual.',
  },
  {
    id: 'P2',
    title: 'El fondo del pozo',
    desc: 'Una ruptura, una recaída, otro año perdido. Ese vacío te está empujando directo a tus peores hábitos — y lo sabes.',
  },
  {
    id: 'P3',
    title: 'El lunes eterno',
    desc: 'Pagaste un gym al que vas dos veces al mes. Cada domingo planeas la semana perfecta y cada martes ya la abandonaste.',
  },
]

export default function PainSection() {
  return (
    <section className="py-24 bg-bg-base relative overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          label="DIAGNÓSTICO"
          title={
            <>
              Sabes exactamente qué deberías hacer.{' '}
              <span className="text-accent-warn">Llevas meses sin hacerlo.</span>
            </>
          }
        />

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {pains.map((pain, i) => (
            <motion.div
              key={pain.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="terminal-panel border border-bg-border p-6 hover:border-accent-warn/30 transition-colors"
            >
              <div className="font-mono text-xs text-accent-warn mb-3">[ {pain.id} ]</div>
              <h3 className="font-mono text-sm font-bold text-text-primary mb-2">{pain.title}</h3>
              <p className="font-sans text-xs text-text-muted leading-relaxed">{pain.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="terminal-panel border border-bg-border p-6 md:p-8 text-center"
        >
          <p className="font-sans text-sm md:text-base text-text-muted leading-relaxed max-w-2xl mx-auto">
            <span className="text-text-primary font-bold">El problema no es información.</span>{' '}
            Tienes acceso a los mismos videos, libros y rutinas que todos. El problema es que
            nadie está mirando. Cuando fallas en privado, fallar es gratis.{' '}
            <span className="text-neon-primary font-bold">Aquí, fallar tiene testigos.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

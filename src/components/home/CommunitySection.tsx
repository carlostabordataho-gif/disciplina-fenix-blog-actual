import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SectionHeader from '../ui/SectionHeader'

const communityPrinciples = [
  {
    num: '01',
    title: 'Ejecución primero',
    desc: 'No hablamos de motivación. Compartimos ejecución. Logs reales. Resultados reales.',
  },
  {
    num: '02',
    title: 'Accountability real',
    desc: 'Tu racha pública. Tus metas visibles. La comunidad como sistema de presión positiva.',
  },
  {
    num: '03',
    title: 'Cero excusas',
    desc: 'Nadie aquí celebra el victimismo. Si fallaste, documéntalo y ejecuta mañana.',
  },
  {
    num: '04',
    title: 'Hermandad de proceso',
    desc: 'No competimos entre nosotros. Competimos con quienes éramos ayer.',
  },
]

const mockMembers = [
  { id: 'USR_001', streak: 67, today: ['GYM', 'CODIGO', 'LECTURA'], status: 'COMPLETO' },
  { id: 'USR_047', streak: 23, today: ['GYM', 'LECTURA'], status: 'EN_PROGRESO' },
  { id: 'USR_112', streak: 134, today: ['GYM', 'CODIGO', 'LECTURA', 'SIN_VICIOS'], status: 'COMPLETO' },
  { id: 'USR_089', streak: 8, today: ['CODIGO'], status: 'EN_PROGRESO' },
]

export default function CommunitySection() {
  return (
    <section className="py-24 bg-bg-panel relative overflow-hidden">
      <div className="absolute inset-0 border-y border-bg-border pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="COMUNIDAD"
          title={<>No un grupo de motivación.<br /><span className="text-neon-primary">Un sistema de ejecución.</span></>}
          subtitle="La comunidad Disciplina Fénix es un entorno de accountability. Cada miembro ejecuta, documenta y se somete al estándar colectivo."
        />

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Principles */}
          <div className="space-y-4">
            {communityPrinciples.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-4 p-4 terminal-panel border border-bg-border hover:border-neon-primary/20 transition-colors"
              >
                <span className="font-mono text-2xl font-bold text-neon-primary/20 shrink-0">{p.num}</span>
                <div>
                  <h3 className="font-mono text-sm font-bold text-text-primary mb-1">{p.title}</h3>
                  <p className="font-sans text-xs text-text-muted leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mock member feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="terminal-panel border border-bg-border">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-bg-border">
                <span className="font-mono text-xs text-text-muted">COMUNIDAD :: actividad_hoy</span>
                <span className="tag-green">LIVE</span>
              </div>
              <div className="p-4 space-y-3">
                {mockMembers.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-2.5 bg-bg-base border border-bg-border hover:border-neon-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border border-neon-dim bg-neon-primary/5 flex items-center justify-center">
                        <span className="font-mono text-xs text-neon-primary">
                          {m.id.slice(-2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-mono text-xs text-text-primary">{m.id}</div>
                        <div className="font-mono text-xs text-neon-primary/60">🔥 {m.streak}d racha</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {m.today.slice(0, 3).map((t) => (
                          <span key={t} className="font-mono text-xs px-1 py-0.5 bg-neon-dim/20 border border-neon-dim text-neon-secondary text-xs">
                            ✓
                          </span>
                        ))}
                      </div>
                      <span className={`font-mono text-xs px-2 py-0.5 border ${
                        m.status === 'COMPLETO'
                          ? 'border-neon-dim text-neon-secondary bg-neon-dim/10'
                          : 'border-text-dim text-text-dim'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  </motion.div>
                ))}

                <div className="pt-2 border-t border-bg-border">
                  <div className="font-mono text-xs text-text-dim text-center">
                    + 47 miembros activos hoy
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Link to="/comunidad" className="btn-primary flex-1 text-center">
                Unirme al ecosistema
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

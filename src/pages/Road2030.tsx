import { motion } from 'framer-motion'
import TerminalPanel from '../components/ui/TerminalPanel'
import SectionHeader from '../components/ui/SectionHeader'
import ProgressBar from '../components/ui/ProgressBar'
import { buildLogs } from '../data/metrics'

const bigGoals = [
  {
    year: '2026',
    title: 'La base sólida',
    goals: [
      { label: 'Físico: 83kg al 13% BF', progress: 42, current: '73kg / ~16% BF' },
      { label: 'Ingresos: 1.000€/mes online', progress: 34, current: '340€/mes' },
      { label: 'Audiencia: 20K TikTok', progress: 21, current: '4.2K' },
      { label: 'SaaS MVP lanzado', progress: 35, current: 'En desarrollo' },
      { label: '365 días de racha', progress: 37, current: '134 días' },
    ],
    status: 'IN PROGRESS',
  },
  {
    year: '2027',
    title: 'La aceleración',
    goals: [
      { label: 'Físico: 87kg elite', progress: 0, current: 'No iniciado' },
      { label: 'Ingresos: 5.000€/mes online', progress: 7, current: 'Base establecida' },
      { label: 'Audiencia: 100K TikTok', progress: 4, current: '4.2K' },
      { label: 'Comunidad de pago activa', progress: 5, current: 'Waitlist' },
      { label: 'Primer producto digital lanzado', progress: 10, current: 'Planificación' },
    ],
    status: 'PLANNED',
  },
  {
    year: '2028',
    title: 'La consolidación',
    goals: [
      { label: 'Libertad financiera base: 10K€/mes', progress: 0, current: 'Objetivo' },
      { label: 'Equipo: primeras 2 contrataciones', progress: 0, current: 'Objetivo' },
      { label: 'Audiencia multi-plataforma: 500K', progress: 0, current: 'Objetivo' },
      { label: 'Ecosistema DF: 3 productos activos', progress: 0, current: 'Objetivo' },
    ],
    status: 'PLANNED',
  },
]

const currentWeekMetrics = [
  { day: 'LUN', gym: true, code: true, reading: true, noVices: true, sleep: 7.5 },
  { day: 'MAR', gym: true, code: true, reading: false, noVices: true, sleep: 8 },
  { day: 'MIE', gym: false, code: true, reading: true, noVices: true, sleep: 7 },
  { day: 'JUE', gym: true, code: true, reading: true, noVices: true, sleep: 7.5 },
  { day: 'VIE', gym: true, code: true, reading: false, noVices: true, sleep: 8 },
  { day: 'SAB', gym: true, code: false, reading: true, noVices: true, sleep: 8.5 },
  { day: 'DOM', gym: false, code: true, reading: true, noVices: true, sleep: 9 },
]

const readingList2026 = [
  { title: 'Atomic Habits', author: 'James Clear', status: 'LEIDO', rating: 5 },
  { title: 'Deep Work', author: 'Cal Newport', status: 'LEIDO', rating: 5 },
  { title: 'The Power of Now', author: 'Eckhart Tolle', status: 'LEIDO', rating: 4 },
  { title: 'Can\'t Hurt Me', author: 'David Goggins', status: 'LEIDO', rating: 5 },
  { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', status: 'LEIDO', rating: 5 },
  { title: 'Clean Code', author: 'Robert C. Martin', status: 'LEYENDO', rating: null },
  { title: 'Dopamine Nation', author: 'Anna Lembke', status: 'PENDIENTE', rating: null },
  { title: 'The War of Art', author: 'Steven Pressfield', status: 'PENDIENTE', rating: null },
  { title: 'Never Finished', author: 'David Goggins', status: 'PENDIENTE', rating: null },
  { title: 'Zero to One', author: 'Peter Thiel', status: 'PENDIENTE', rating: null },
  { title: 'Building a Second Brain', author: 'Tiago Forte', status: 'PENDIENTE', rating: null },
  { title: 'The 4-Hour Workweek', author: 'Tim Ferriss', status: 'PENDIENTE', rating: null },
]

export default function Road2030() {
  return (
    <div className="min-h-screen pt-16 bg-bg-base">
      {/* Header */}
      <div className="border-b border-bg-border bg-bg-panel relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-accent-warn rounded-full animate-pulse" />
            <span className="section-label" style={{ color: '#FF5E00' }}>ROAD_TO_2030 :: mision_documentada</span>
          </div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold text-text-primary mb-4">
            El camino a <span style={{ color: '#FF5E00', textShadow: '0 0 20px rgba(255,94,0,0.4)' }}>2030.</span>
          </h1>
          <p className="font-sans text-text-muted text-sm max-w-xl leading-relaxed mb-6">
            Construyendo públicamente desde 2025. Documentando el proceso real de transformación física, financiera, técnica y de mentalidad.
          </p>
          {/* Current day counter */}
          <div className="flex items-center gap-6">
            <div>
              <div className="font-mono text-4xl font-bold text-neon-primary" style={{ textShadow: '0 0 20px rgba(0,255,65,0.4)' }}>
                DÍA 134
              </div>
              <div className="font-mono text-xs text-text-muted mt-1 uppercase tracking-widest">
                de 1826 días hasta 2030
              </div>
            </div>
            <div className="flex-1 max-w-xs">
              <ProgressBar value={7} showPercent />
              <div className="font-mono text-xs text-text-dim mt-1">Progreso total del road</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Weekly tracker */}
        <SectionHeader
          label="SEMANA ACTUAL"
          title={<>Tracker de la <span className="text-neon-primary">semana.</span></>}
        />

        <TerminalPanel title="SEMANA_ACTUAL :: protocolo_diario" className="mb-16" animate>
          <div className="p-4 overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-bg-border">
                  <th className="text-left text-text-dim pb-3 pr-4">DÍA</th>
                  <th className="text-center text-text-dim pb-3 px-3">GYM</th>
                  <th className="text-center text-text-dim pb-3 px-3">CÓDIGO</th>
                  <th className="text-center text-text-dim pb-3 px-3">LECTURA</th>
                  <th className="text-center text-text-dim pb-3 px-3">SIN VICIOS</th>
                  <th className="text-right text-text-dim pb-3 pl-4">SUEÑO</th>
                </tr>
              </thead>
              <tbody>
                {currentWeekMetrics.map((day, i) => {
                  const score = [day.gym, day.code, day.reading, day.noVices].filter(Boolean).length
                  return (
                    <motion.tr
                      key={day.day}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="border-b border-bg-border hover:bg-bg-panel/50 transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <span className={`font-bold ${score === 4 ? 'text-neon-primary' : 'text-text-primary'}`}>
                          {day.day}
                        </span>
                      </td>
                      {[day.gym, day.code, day.reading, day.noVices].map((val, j) => (
                        <td key={j} className="text-center px-3 py-3">
                          <span className={val ? 'text-neon-primary' : 'text-text-dim'}>
                            {val ? '✓' : '✗'}
                          </span>
                        </td>
                      ))}
                      <td className="text-right pl-4 py-3">
                        <span className={`${day.sleep >= 7.5 ? 'text-neon-primary' : 'text-accent-warn'}`}>
                          {day.sleep}h
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TerminalPanel>

        {/* Year goals */}
        <SectionHeader
          label="OBJETIVOS"
          title={<>Metas por <span className="text-neon-primary">año.</span></>}
          subtitle="Cada meta tiene métrica real. Cada métrica tiene progreso documentado."
        />

        <div className="space-y-6 mb-16">
          {bigGoals.map((year, i) => (
            <motion.div
              key={year.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <TerminalPanel
                title={`${year.year} :: ${year.title.toUpperCase()}`}
                glowColor={year.status === 'IN PROGRESS' ? 'green' : 'green'}
              >
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`font-mono text-xs px-2 py-0.5 border ${
                      year.status === 'IN PROGRESS'
                        ? 'border-neon-primary/40 text-neon-primary bg-neon-primary/5'
                        : 'border-text-dim text-text-dim'
                    }`}>
                      {year.status}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {year.goals.map((goal) => (
                      <div key={goal.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs text-text-primary">{goal.label}</span>
                          <span className="font-mono text-xs text-text-dim">{goal.current}</span>
                        </div>
                        <ProgressBar value={goal.progress} showPercent />
                      </div>
                    ))}
                  </div>
                </div>
              </TerminalPanel>
            </motion.div>
          ))}
        </div>

        {/* Recent build logs */}
        <SectionHeader
          label="BUILD LOG"
          title={<>Entradas <span className="text-neon-primary">recientes.</span></>}
        />

        <div className="space-y-3 mb-16">
          {buildLogs.map((log, i) => (
            <motion.div
              key={log.date}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="terminal-panel border border-bg-border p-4 hover:border-neon-primary/20 transition-colors"
            >
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <span className="font-mono text-sm font-bold text-neon-primary">{log.day}</span>
                <span className="font-mono text-xs text-text-dim">{log.date}</span>
                <div className="flex gap-1.5">
                  {log.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
              <h3 className="font-mono text-sm font-bold text-text-primary mb-1">{log.title}</h3>
              <p className="font-sans text-xs text-text-muted leading-relaxed">{log.body}</p>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-bg-border">
                {[
                  { key: 'gym', label: 'GYM' },
                  { key: 'code', label: 'CODE' },
                  { key: 'reading', label: 'READ' },
                  { key: 'noVices', label: 'CLEAN' },
                ].map(({ key, label }) => (
                  <span
                    key={key}
                    className={`font-mono text-xs px-2 py-0.5 border ${
                      log.metrics[key as keyof typeof log.metrics]
                        ? 'border-neon-dim text-neon-secondary'
                        : 'border-text-dim text-text-dim'
                    }`}
                  >
                    {log.metrics[key as keyof typeof log.metrics] ? '✓' : '✗'} {label}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reading list */}
        <SectionHeader
          label="CONOCIMIENTO"
          title={<>Lista de lectura <span className="text-neon-primary">2026.</span></>}
          subtitle="52 libros en el año. Cada libro procesado y sintetizado."
        />

        <TerminalPanel title="LIBROS_2026 :: 12_de_52" animate className="mb-16">
          <div className="p-4">
            <div className="mb-4">
              <ProgressBar value={23} label="PROGRESO ANUAL (12/52)" />
            </div>
            <div className="space-y-2">
              {readingList2026.map((book, i) => (
                <motion.div
                  key={book.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-2 hover:bg-bg-base transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-text-dim w-4">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="font-mono text-xs text-text-primary">{book.title}</div>
                      <div className="font-mono text-xs text-text-dim">{book.author}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {book.rating && (
                      <span className="font-mono text-xs text-neon-primary">{'★'.repeat(book.rating)}</span>
                    )}
                    <span className={`font-mono text-xs px-2 py-0.5 border ${
                      book.status === 'LEIDO' ? 'border-neon-dim text-neon-secondary' :
                      book.status === 'LEYENDO' ? 'border-accent-warn/40 text-accent-warn' :
                      'border-text-dim text-text-dim'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TerminalPanel>
      </div>
    </div>
  )
}

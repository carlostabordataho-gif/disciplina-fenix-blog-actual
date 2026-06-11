import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import TerminalPanel from '../components/ui/TerminalPanel'
import SectionHeader from '../components/ui/SectionHeader'
import { saveLead } from '../lib/leads'
import { cohortSpotsLeft, funnel } from '../data/funnel'

const rules = [
  {
    num: '01',
    title: 'Ejecución primero',
    desc: 'Hablar sin hacer no tiene espacio aquí. Cada interacción debe estar anclada en acción real.',
    level: 'MANDATORIO',
  },
  {
    num: '02',
    title: 'Documentación real',
    desc: 'Comparte el proceso, no la fachada. Los días malos son tan valiosos como los buenos.',
    level: 'MANDATORIO',
  },
  {
    num: '03',
    title: 'Sin victimismo',
    desc: 'Nadie aquí celebra las excusas. Si fallaste, identifica el fallo, ajusta y ejecuta.',
    level: 'MANDATORIO',
  },
  {
    num: '04',
    title: 'Accountability honesta',
    desc: 'Tu racha es tuya. No la infles. La comunidad te sostiene en la honestidad.',
    level: 'MANDATORIO',
  },
  {
    num: '05',
    title: 'Cero ego',
    desc: 'El progreso personal no es un arma de superioridad. Aquí todos estamos construyendo.',
    level: 'CULTURAL',
  },
  {
    num: '06',
    title: 'Mejora colectiva',
    desc: 'Cuando uno de nosotros mejora, el estándar colectivo sube. Eso beneficia a todos.',
    level: 'CULTURAL',
  },
]

// Retos del Escuadrón: se activan con la comunidad. Sin números inventados —
// la prueba social de esta etapa es la cohorte fundadora con plazas reales.
const challenges = [
  {
    id: 'CHG-001',
    name: 'Sin vicios — 7 días',
    difficulty: 'ENTRADA',
    reward: 'Empieza hoy con el Protocolo RESET gratis',
    cta: 'reset' as const,
  },
  {
    id: 'CHG-002',
    name: 'Protocolo Fénix — 21 días supervisados',
    difficulty: 'ALTO',
    reward: `Cohorte Fundadora · check-in diario · ${cohortSpotsLeft}/${funnel.cohortSpotsTotal} plazas`,
    cta: 'protocolo' as const,
  },
  {
    id: 'CHG-003',
    name: 'Retos mensuales del Escuadrón',
    difficulty: 'MEDIO',
    reward: 'Disponibles para quienes completan la cohorte',
    cta: 'protocolo' as const,
  },
]

const tiers = [
  {
    name: 'RECLUTA',
    level: '00',
    desc: 'Acceso gratuito. El protocolo RESET de 7 días y el contenido público.',
    features: ['Protocolo RESET (7 días)', 'Blog completo', 'Newsletter'],
    price: 'Gratis',
    ctaLabel: 'Empezar con RESET',
    ctaTo: '/reset',
    disabled: false,
  },
  {
    name: 'COHORTE FÉNIX',
    level: '01',
    desc: 'El protocolo de 21 días supervisado. Check-in diario, llamadas grupales y reglas de expulsión.',
    features: ['Protocolo día por día', 'Llamada 1:1 de arranque', 'Check-in diario revisado', '3 llamadas grupales', 'Sistema de puntos y rangos'],
    price: `$${funnel.priceUsd} USD`,
    ctaLabel: 'Ver la cohorte',
    ctaTo: '/protocolo',
    disabled: false,
  },
  {
    name: 'ESCUADRÓN',
    level: '02',
    desc: 'Membresía para quienes completan la cohorte: retos mensuales, comunidad y la racha viva.',
    features: ['Comunidad permanente', 'Reto mensual con puntos', 'Llamada grupal mensual', 'Prioridad en cohortes'],
    price: 'Vía cohorte',
    ctaLabel: 'Acceso vía cohorte',
    ctaTo: '/protocolo',
    disabled: false,
  },
]

export default function Community() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="min-h-screen pt-16 bg-bg-base">
      {/* Header */}
      <div className="border-b border-bg-border bg-bg-panel relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
            <span className="section-label">COMUNIDAD :: ecosistema_fenix</span>
          </div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Una hermandad de <span className="text-neon-primary">ejecución.</span>
          </h1>
          <p className="font-sans text-text-muted text-sm max-w-xl leading-relaxed">
            No un grupo de motivación. Un ecosistema donde la disciplina es el estándar colectivo y el proceso real es la moneda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Rules */}
        <SectionHeader
          label="CULTURA"
          title={<>El código de <span className="text-neon-primary">conducta.</span></>}
          subtitle="No hay motivación superficial aquí. El estándar es alto y eso es exactamente el punto."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="terminal-panel border border-bg-border p-5 hover:border-neon-primary/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-2xl font-bold text-neon-primary/20">{rule.num}</span>
                <span className={`font-mono text-xs px-2 py-0.5 border ${
                  rule.level === 'MANDATORIO'
                    ? 'border-accent-warn/40 text-accent-warn'
                    : 'border-text-dim text-text-dim'
                }`}>
                  {rule.level}
                </span>
              </div>
              <h3 className="font-mono text-sm font-bold text-text-primary mb-2">{rule.title}</h3>
              <p className="font-sans text-xs text-text-muted leading-relaxed">{rule.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Challenges */}
        <SectionHeader
          label="RETOS ACTIVOS"
          title={<>Desafíos de <span className="text-neon-primary">ejecución.</span></>}
        />

        <TerminalPanel title="CHALLENGES :: activos" className="mb-16" animate>
          <div className="p-4 space-y-3">
            {challenges.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-3 bg-bg-base border border-bg-border hover:border-neon-primary/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-text-dim mt-0.5">{c.id}</span>
                  <div>
                    <div className="font-mono text-sm font-bold text-text-primary">{c.name}</div>
                    <div className="font-mono text-xs text-text-dim mt-0.5">{c.reward}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs px-2 py-0.5 border ${
                    c.difficulty === 'ALTO' ? 'border-accent-warn/40 text-accent-warn' :
                    c.difficulty === 'MEDIO' ? 'border-neon-primary/40 text-neon-primary' :
                    'border-text-dim text-text-muted'
                  }`}>
                    {c.difficulty}
                  </span>
                  <Link to={c.cta === 'reset' ? '/reset' : '/protocolo'} className="btn-primary text-xs py-1 px-3">
                    {c.cta === 'reset' ? 'Empezar gratis' : 'Ver cohorte'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </TerminalPanel>

        {/* Tiers */}
        <SectionHeader
          label="ACCESO"
          title={<>Niveles de <span className="text-neon-primary">membresía.</span></>}
        />

        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`terminal-panel border p-6 flex flex-col ${
                tier.name === 'COHORTE FÉNIX'
                  ? 'border-neon-primary/30'
                  : 'border-bg-border'
              }`}
              style={tier.name === 'COHORTE FÉNIX' ? { boxShadow: '0 0 20px rgba(0,255,65,0.05)' } : {}}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-mono text-xs text-text-dim mb-0.5">LVL {tier.level}</div>
                  <div className="font-mono text-lg font-bold text-neon-primary">{tier.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-text-primary">{tier.price}</div>
                </div>
              </div>
              <p className="font-sans text-xs text-text-muted leading-relaxed mb-4">{tier.desc}</p>
              <div className="flex-1 space-y-2 mb-6">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="text-neon-primary text-xs">✓</span>
                    <span className="font-mono text-xs text-text-muted">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                to={tier.ctaTo}
                className={tier.name === 'COHORTE FÉNIX' ? 'btn-primary text-xs text-center' : 'btn-secondary text-xs text-center'}
              >
                {tier.ctaLabel}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="terminal-panel border border-neon-primary/20 p-8"
          style={{ boxShadow: '0 0 30px rgba(0,255,65,0.04)' }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="section-label mb-3">NOTIFICACIONES</div>
              <h2 className="font-mono text-xl font-bold text-text-primary mb-2">
                Sé el primero en saber.
              </h2>
              <p className="font-sans text-text-muted text-sm leading-relaxed">
                Cuando lancemos la comunidad privada, los de la lista serán los primeros. Y habrá acceso en condiciones especiales.
              </p>
            </div>
            {joined ? (
              <div className="border border-neon-primary/30 bg-neon-primary/5 p-4">
                <p className="font-mono text-sm text-neon-primary">&gt; Registrado. Te avisamos.</p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const result = await saveLead(email, 'community')
                  if (result.ok) setJoined(true)
                  else setError(result.error ?? 'No se pudo registrar.')
                }}
                className="flex flex-col gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="bg-bg-base border border-bg-border text-text-primary font-mono text-sm px-4 py-3 focus:outline-none focus:border-neon-primary/50 placeholder-text-dim"
                />
                <button type="submit" className="btn-primary">
                  Avisar cuando abra
                </button>
                {error && (
                  <p className="font-mono text-xs text-accent-warn">{error}</p>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

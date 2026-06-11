import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cohortSpotsLeft, funnel } from '../../data/funnel'

export default function OfferBanner() {
  return (
    <section className="py-16 bg-bg-base relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="terminal-panel border border-neon-primary/30 p-8 md:p-10"
          style={{ boxShadow: '0 0 30px rgba(0,255,65,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
            <span className="font-mono text-xs text-neon-primary tracking-widest uppercase">
              COHORTE FUNDADORA · {cohortSpotsLeft}/{funnel.cohortSpotsTotal} PLAZAS
            </span>
          </div>

          <h2 className="font-mono text-2xl md:text-3xl font-bold text-text-primary mb-4">
            21 días para dejar de prometerte{' '}
            <span className="text-neon-primary">cosas que no cumples.</span>
          </h2>

          <p className="font-sans text-sm text-text-muted leading-relaxed mb-6 max-w-2xl">
            Protocolo día por día · Check-in nocturno obligatorio · Llamada 1:1 de arranque · 3
            llamadas grupales · Máximo {funnel.cohortSpotsTotal} operadores.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/protocolo" className="btn-primary">
              VER EL PROTOCOLO COMPLETO →
            </Link>
            <div className="font-mono text-sm">
              <span className="text-neon-primary font-bold">${funnel.priceUsd} USD</span>
              <span className="text-text-dim"> / ${funnel.priceCop} COP · precio fundador</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

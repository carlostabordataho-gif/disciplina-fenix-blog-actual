import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SectionHeader from '../ui/SectionHeader'
import { funnel } from '../../data/funnel'

export default function SystemStepsSection() {
  const steps = [
    {
      num: '01',
      name: 'RESET',
      price: 'GRATIS',
      desc: 'El protocolo de 7 días para cortar el ciclo: vicios, teléfono, caos. Empieza hoy, sin pagar nada.',
      to: '/reset',
      cta: 'Descargar RESET',
      highlight: false,
    },
    {
      num: '02',
      name: 'COHORTE FÉNIX',
      price: `$${funnel.priceUsd} USD · conexiones: ${funnel.cohortSpotsTaken}/${funnel.cohortSpotsTotal} asignadas`,
      desc: 'El protocolo completo de 21 días con check-in diario obligatorio, llamadas semanales y reglas de expulsión. No es un curso que ves: es un sistema que reporta.',
      to: '/protocolo',
      cta: 'Ver la cohorte',
      highlight: true,
    },
    {
      num: '03',
      name: 'ESCUADRÓN',
      price: 'Solo desde la cohorte',
      desc: 'Para los que completan los 21 días: retos mensuales, comunidad de operadores y la racha viva.',
      to: '/protocolo',
      cta: 'Acceso vía cohorte',
      highlight: false,
    },
  ]

  return (
    <section className="py-24 bg-bg-panel relative overflow-hidden">
      <div className="absolute inset-0 border-y border-bg-border pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          label="EL SISTEMA"
          title={
            <>
              Tres niveles. <span className="text-neon-primary">Cero atajos.</span>
            </>
          }
          align="center"
        />

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`terminal-panel border p-6 flex flex-col ${
                step.highlight ? 'border-neon-primary/40' : 'border-bg-border'
              }`}
              style={step.highlight ? { boxShadow: '0 0 25px rgba(0,255,65,0.07)' } : {}}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-3xl font-bold text-neon-primary/25">
                  {step.num}
                </span>
                {step.highlight && (
                  <span className="font-mono text-[10px] px-2 py-0.5 border border-neon-primary/40 text-neon-primary uppercase tracking-widest">
                    Abierta
                  </span>
                )}
              </div>
              <h3 className="font-mono text-lg font-bold text-text-primary mb-1">{step.name}</h3>
              <div className="font-mono text-xs text-neon-primary mb-4">{step.price}</div>
              <p className="font-sans text-xs text-text-muted leading-relaxed flex-1 mb-6">
                {step.desc}
              </p>
              <Link
                to={step.to}
                className={step.highlight ? 'btn-primary text-center text-xs' : 'btn-secondary text-center text-xs'}
              >
                {step.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

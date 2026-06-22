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
      badge: 'Empieza gratis',
      highlight: false,
    },
    {
      num: '02',
      name: 'PROTOCOLO FÉNIX',
      price: `$${funnel.priceUsd} USD · pago único · acceso inmediato`,
      desc: 'La Instalación Supervisada de 21 días: protocolo día por día, check-in diario revisado y llamada 1:1 de arranque. No es un curso que ves: es un sistema que te reporta. Entras cuando quieras y arrancas el mismo día.',
      to: '/protocolo',
      cta: 'Empezar ahora',
      badge: 'Más elegido',
      highlight: true,
    },
    {
      num: '03',
      name: 'COMUNIDAD',
      price: 'Membresía · retos mensuales',
      desc: 'El escuadrón permanente para los que ya ejecutan: retos mensuales con puntos, accountability en grupo y la racha viva entre operadores.',
      to: '/comunidad',
      cta: 'Ver la comunidad',
      badge: '',
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
                {step.badge && (
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 border uppercase tracking-widest ${
                      step.highlight
                        ? 'border-neon-primary/40 text-neon-primary'
                        : 'border-bg-border text-text-dim'
                    }`}
                  >
                    {step.badge}
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

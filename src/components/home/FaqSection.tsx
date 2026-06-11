import { Link } from 'react-router-dom'
import SectionHeader from '../ui/SectionHeader'

const faq = [
  {
    q: '¿Esto es un curso?',
    a: 'No. Los cursos son información y la información gratis está en mi TikTok. Esto es ejecución supervisada: protocolo exacto + alguien revisando cada noche si cumpliste.',
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
    a: 'Sigues dentro — si lo reportas. Hay un protocolo de 24 horas para las caídas. Lo único que te saca es esconderlo o desaparecer.',
  },
  {
    q: '¿Por qué tan barato?',
    a: 'Porque es la primera cohorte y estás comprando antes de que existan testimonios. Ese descuento es por el riesgo que asumes. No volverá a este precio.',
  },
]

export default function FaqSection() {
  return (
    <section className="py-24 bg-bg-base relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="PREGUNTAS DIRECTAS" title={<>Sin letra pequeña.</>} />

        <div className="space-y-3 mb-16">
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

        {/* CTA final */}
        <div className="text-center">
          <h2 className="font-mono text-xl md:text-2xl font-bold text-text-primary mb-6">
            El lunes perfecto no existe. <span className="text-neon-primary">El sistema sí.</span>
          </h2>
          <Link to="/reset" className="btn-primary inline-block">
            EMPEZAR CON EL RESET GRATIS
          </Link>
          <p className="font-mono text-xs text-text-dim mt-4">Día 1 es hoy o no es nunca.</p>
        </div>
      </div>
    </section>
  )
}

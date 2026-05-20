import { useState } from 'react'
import { motion } from 'framer-motion'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section className="py-24 bg-bg-panel relative overflow-hidden">
      <div className="absolute inset-0 border-y border-bg-border pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 right-0">
        <div className="glow-line" />
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <div className="glow-line" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="terminal-panel border border-neon-primary/20 p-8 md:p-12"
            style={{ boxShadow: '0 0 40px rgba(0,255,65,0.05)' }}
          >
            {/* Header */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
                <span className="section-label">NEWSLETTER</span>
                <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
              </div>
            </div>

            <h2 className="font-mono text-2xl md:text-3xl font-bold text-text-primary mb-2">
              Una iteración semanal.
            </h2>
            <p className="font-sans text-text-muted text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Protocolos reales. Sistemas reales. Ejecución documentada.{' '}
              <span className="text-text-primary">Sin relleno. Sin inspiración barata.</span>
            </p>

            {/* What you get */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                'Log semanal de ejecución',
                'Protocolo nuevo o revisado',
                'Recurso táctico',
                'Métricas del fundador',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-neon-primary text-xs">▸</span>
                  <span className="font-mono text-xs text-text-muted">{item}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-neon-primary/30 bg-neon-primary/5 px-6 py-4"
              >
                <p className="font-mono text-sm text-neon-primary">
                  &gt; Acceso concedido.
                </p>
                <p className="font-mono text-xs text-neon-secondary mt-1">
                  Bienvenido al sistema. Revisa tu email.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="flex-1 bg-bg-base border border-bg-border text-text-primary font-mono text-sm px-4 py-3 focus:outline-none focus:border-neon-primary/50 placeholder-text-dim transition-colors"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Unirme
                </button>
              </form>
            )}

            <p className="font-mono text-xs text-text-dim mt-4">
              Sin spam. Sin venta disfrazada. Solo ejecución documentada.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

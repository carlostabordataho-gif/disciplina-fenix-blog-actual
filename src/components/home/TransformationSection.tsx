import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'

const timelineEvents = [
  {
    year: 'EL ORIGEN',
    label: 'PUNTO CERO',
    title: 'Flaco y sin Autoestima',
    desc: 'Atrapado en adicciones modernas, dopamina barata y cero control mental. Odiaba lo que veía en el espejo. Sin rumbo ni identidad clara.',
    color: 'warn',
  },
  {
    year: 'EL ANCLA',
    label: 'DISCIPLINA FÍSICA',
    title: 'El Gimnasio como Salvación',
    desc: 'Harto de la mediocridad, usé los hierros para forjar el carácter que la mente no tenía. Entendí que si dominas tu cuerpo, dominas tu realidad.',
    color: 'muted',
  },
  {
    year: 'AUTORIDAD',
    label: 'EXPERTO BODYTECH',
    title: 'Entrenador de Alto Sello',
    desc: 'Llevé mi cuerpo al límite y escalé hasta certificarme y trabajar en el gimnasio más exigente de Colombia. Aprendí a transformar la vida de otros de forma real.',
    color: 'green',
  },
  {
    year: 'EL PRESENTE',
    label: 'SISTEMAS + CÓDIGO',
    title: 'Nace Disciplina Fénix',
    desc: 'Combiné la ingeniería del software con la disciplina inquebrantable del fitness. Creé Zenith OS: el software definitivo para traquear hábitos y aniquilar vicios.',
    color: 'primary',
  },
]

export default function TransformationSection() {
  return (
    <section className="py-24 bg-bg-panel relative overflow-hidden">
      <div className="absolute inset-0 border-y border-bg-border pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          label="MENTORÍA & ASESORAMIENTO"
          title={<>De la inseguridad al <span className="text-neon-primary">dominio total.</span></>}
          subtitle="No te vendo humo ni teorías de libros. Te vendo el sistema exacto con el que salí del pozo, forjé mi físico en Bodytech y tomé el control de mi vida."
        />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Cronología */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-bg-border" />
            <div className="space-y-8">
              {timelineEvents.map((event, i) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4 relative pl-12"
                >
                  <div
                    className={`absolute left-4 top-2 w-3 h-3 border-2 -translate-x-1/2 ${
                      event.color === 'primary'
                        ? 'border-neon-primary bg-neon-primary'
                        : event.color === 'green'
                        ? 'border-neon-primary bg-bg-base'
                        : event.color === 'warn'
                        ? 'border-accent-warn bg-bg-base'
                        : 'border-text-dim bg-bg-base'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`font-mono text-xs font-bold ${
                        event.color === 'primary' || event.color === 'green' ? 'text-neon-primary' : event.color === 'warn' ? 'text-accent-warn' : 'text-text-muted'
                      }`}>
                        {event.year}
                      </span>
                      <span className="tag">{event.label}</span>
                    </div>
                    <h3 className="font-mono text-sm font-bold text-text-primary mb-1">{event.title}</h3>
                    <p className="font-sans text-xs text-text-muted leading-relaxed">{event.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tarjeta de Conversión */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="terminal-panel border border-bg-border p-6 bg-bg-base/50">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-bg-border">
                <div>
                  <div className="font-mono text-sm font-bold text-text-primary">CARLOS TAHO</div>
                  <div className="font-mono text-xs text-neon-primary mt-0.5">High-Performance Mentor & Software Dev</div>
                </div>
              </div>

              {/* CONTENEDOR DE LA IMAGEN EN ALTA DEFINICIÓN EMPAQUETADA */}
              <div className="border border-neon-primary/30 bg-black/40 w-full overflow-hidden mb-6 rounded-sm">
             <img 
  src="/transformacion-fenix.jpg.png"
  alt="Carlos Taho - Transformación Fénix"
  className="w-full h-auto object-cover rounded-sm"
/>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-bg-panel p-3 border border-bg-border">
                  <div className="font-mono text-xs text-text-primary">ASESORÍA 1-ON-1 DE ALTO RENDIMIENTO</div>
                  <span className="tag-green">DISPONIBLE</span>
                </div>
                <p className="font-sans text-xs text-text-muted leading-relaxed">
                  Te daré las herramientas exactas para hackear tu mente a través del entorno físico, optimizar tus hábitos con software táctico y construir un físico respetable.
                </p>
              </div>

              <div className="glow-line my-6" />

              {/* Enlace corregido a tu usuario real de TikTok */}
              <a 
                href="https://www.tiktok.com/@carlostaho" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-center font-mono text-xs text-black bg-neon-primary font-bold py-3 hover:bg-neon-secondary transition-all uppercase tracking-widest"
              >
                [ POSTULAR A MENTORÍA EXCLUSIVA ]
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
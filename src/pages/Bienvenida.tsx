import { motion } from 'framer-motion'
import TerminalPanel from '../components/ui/TerminalPanel'
import { funnel, whatsappUrl } from '../data/funnel'
import usePageMeta from '../lib/usePageMeta'

// Página de Bienvenida = sistema operativo mínimo del Día 0.
// Destino al que envías a cada persona que YA pagó.
// Responde 4 preguntas: qué hago, dónde entro, cuándo, cómo reporto.

const pasos = [
  {
    n: '01',
    t: 'Entra al grupo privado de la cohorte',
    d: 'Es el centro de operaciones. Ahí reportas cada noche y ahí pasan las llamadas. Si no recibiste el enlace, escríbeme y te lo reenvío al instante.',
    cta: { label: 'PEDIR ENLACE DEL GRUPO', ctx: 'bienvenida-grupo' },
  },
  {
    n: '02',
    t: 'Agenda tu llamada 1:1 de arranque (Día 0)',
    d: '15 minutos conmigo para calibrar el protocolo a TU vida: tu horario, tu vicio declarado y tu hora de despertar. Sin esta llamada no empiezas bien.',
    cta: { label: 'AGENDAR MI LLAMADA 1:1', ctx: 'bienvenida-llamada' },
  },
  {
    n: '03',
    t: 'Prepara tu primer check-in',
    d: 'Cada noche, antes de las 23:00, reportas en el grupo: ✅ lo que cumpliste, ❌ lo que no. Sin adornos. Yo reviso todos. Esta noche es tu primer reporte.',
    cta: null,
  },
  {
    n: '04',
    t: 'Lee el Protocolo RESET mientras arrancamos',
    d: 'Son las primeras 48 horas de diseño de entorno. Ve adelantando: cuando empiece la cohorte ya tendrás el terreno preparado.',
    cta: { label: 'ABRIR PROTOCOLO RESET', href: funnel.resetPdfUrl },
  },
]

export default function Bienvenida() {
  usePageMeta(
    'Bienvenido a la Cohorte Fénix — Tu Día 0 | Disciplina Fénix',
    'Tu plaza está confirmada. Estos son los pasos exactos para arrancar: grupo, llamada 1:1 y tu primer check-in.'
  )

  return (
    <div className="min-h-screen pt-16 bg-bg-base">
      {/* Cabecera de confirmación */}
      <div className="border-b border-bg-border bg-bg-panel relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
            <span className="font-mono text-xs text-neon-primary tracking-widest uppercase">
              PLAZA CONFIRMADA · ACCESO CONCEDIDO
            </span>
          </div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-4">
            Estás dentro. <span className="text-neon-primary">Esto es el Día 0.</span>
          </h1>
          <p className="font-sans text-text-muted text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            No es una compra: es un compromiso con testigos. Haz estos 4 pasos hoy mismo —
            sin saltarte ninguno. <span className="text-text-primary font-medium">Arrancamos {funnel.cohortStartDate}.</span>
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Pasos */}
        <div className="space-y-4">
          {pasos.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="terminal-panel border border-bg-border p-6 hover:border-neon-primary/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-2xl font-bold text-neon-primary/30 shrink-0">
                  {p.n}
                </span>
                <div className="flex-1">
                  <h3 className="font-mono text-sm font-bold text-text-primary mb-2">{p.t}</h3>
                  <p className="font-sans text-xs text-text-muted leading-relaxed mb-4">{p.d}</p>
                  {p.cta && (
                    <a
                      href={'href' in p.cta && p.cta.href ? p.cta.href : whatsappUrl(`Hola Carlos, ya pagué la Cohorte Fénix. ${p.cta.label === 'AGENDAR MI LLAMADA 1:1' ? 'Quiero agendar mi llamada 1:1 de arranque.' : 'Necesito el enlace del grupo privado.'}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary inline-block text-xs"
                    >
                      {p.cta.label}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cómo se reporta: el ritual diario */}
        <TerminalPanel title="RITUAL :: check_in_nocturno">
          <div className="p-6 space-y-3 font-mono text-xs">
            <p className="text-text-muted leading-relaxed mb-3">
              Copia y pega esta plantilla en el grupo cada noche antes de las 23:00:
            </p>
            <div className="bg-bg-base border border-bg-border p-4 text-text-primary leading-relaxed whitespace-pre-line">
{`CHECK-IN · Día [N]
✅ Despertar a la hora pactada
✅ Movimiento 30 min
✅ Bloque de enfoque
✅ Cero vicio declarado
Estado: [1 línea honesta de cómo te fue]`}
            </div>
            <p className="text-text-dim leading-relaxed pt-2">
              Regla: 3 check-ins perdidos sin avisar = fuera. Mentir = fuera inmediato.
              Caer y reportarlo = sigues dentro. La honestidad es el único requisito no negociable.
            </p>
          </div>
        </TerminalPanel>

        {/* Salvavidas */}
        <div className="terminal-panel border border-neon-primary/20 p-6 text-center">
          <p className="font-sans text-sm text-text-muted leading-relaxed mb-4">
            ¿Algo no te llegó o tienes una duda para arrancar? No te quedes trabado.
          </p>
          <a
            href={whatsappUrl('Hola Carlos, ya pagué la Cohorte Fénix y necesito ayuda para arrancar mi Día 0:')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            ESCRIBIRME AHORA
          </a>
        </div>
      </div>
    </div>
  )
}

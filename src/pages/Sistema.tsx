import { motion } from 'framer-motion'
import TerminalPanel from '../components/ui/TerminalPanel'
import SectionHeader from '../components/ui/SectionHeader'

const layers = [
  {
    id: 'L1',
    name: 'CARLOS TABORDA',
    desc: 'La persona. La historia. La transformación documentada públicamente.',
    components: ['Historia personal', 'Timeline de evolución', 'Build in Public', 'Accountability pública'],
    color: 'warn',
  },
  {
    id: 'L2',
    name: 'DISCIPLINA FÉNIX',
    desc: 'La filosofía. Los protocolos. La comunidad. La identidad colectiva.',
    components: ['Filosofía del sistema', 'Protocolos ejecutables', 'Comunidad de accountability', 'Retos y desafíos'],
    color: 'green',
  },
  {
    id: 'L3',
    name: 'PERSONAL OS',
    desc: 'La plataforma. El tracker. La infraestructura de hábitos y métricas.',
    components: ['Habit tracker', 'Streak system', 'Métricas personales', 'Dashboard diario'],
    color: 'primary',
  },
]

const habitStacks = [
  {
    time: '05:30',
    label: 'DESPERTAR',
    items: ['Agua fría', 'Sin teléfono', 'Propósito del día'],
    priority: 'CRÍTICO',
  },
  {
    time: '06:00',
    label: 'DEEP WORK',
    items: ['Bloque 1: 2h 30m', 'Editor + documentación', 'Sin notificaciones'],
    priority: 'CRÍTICO',
  },
  {
    time: '08:30',
    label: 'PAUSA ACTIVA',
    items: ['15 min caminar', 'Sin pantallas', 'Hidratación'],
    priority: 'IMPORTANTE',
  },
  {
    time: '08:45',
    label: 'DEEP WORK 2',
    items: ['Bloque 2: 2h 15m', 'Revisión + commit', 'Documentación'],
    priority: 'CRÍTICO',
  },
  {
    time: '11:00',
    label: 'REVISION',
    items: ['Qué logré', 'Qué queda', 'Ajuste del plan'],
    priority: 'IMPORTANTE',
  },
  {
    time: '17:00',
    label: 'GYM',
    items: ['Sesión 60-75 min', 'Progresión registrada', 'Post: nutrición'],
    priority: 'CRÍTICO',
  },
  {
    time: '20:00',
    label: 'CONOCIMIENTO',
    items: ['Lectura 25 min', 'Notas en Obsidian', 'Síntesis breve'],
    priority: 'IMPORTANTE',
  },
  {
    time: '22:00',
    label: 'CIERRE',
    items: ['Review del día', 'Prep mañana', 'Sin pantallas'],
    priority: 'IMPORTANTE',
  },
]

const antiVicios = [
  { vicio: 'Redes sociales', estado: 'ELIMINADO', dias: 47, protocol: 'Apps borradas, solo desktop con fricción alta' },
  { vicio: 'Pornografía', estado: 'ELIMINADO', dias: 134, protocol: 'Cold turkey + environment design + sustitución' },
  { vicio: 'Comida procesada', estado: 'CONTROLADO', dias: 67, protocol: '80/20 — protocolo nutricional estructurado' },
  { vicio: 'Nicotina', estado: 'ELIMINADO', dias: 420, protocol: 'Frío absoluto + 72h de recalibración inicial' },
]

export default function Sistema() {
  const urlSistemaReal = "https://carlostahosystem.lovable.app/";

  return (
    <div className="min-h-screen pt-16 bg-bg-base">
      {/* Header */}
      <div className="border-b border-bg-border bg-bg-panel relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
            <span className="section-label">SISTEMA :: arquitectura_disciplina</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="font-mono text-3xl md:text-4xl font-bold text-text-primary mb-4">
                El <span className="text-neon-primary">sistema operativo personal.</span>
              </h1>
              <p className="font-sans text-text-muted text-sm max-w-xl leading-relaxed">
                Disciplina Fénix no es un método de productividad. Es una arquitectura de conducta construida sobre identidad, protocolos y ejecución real.
              </p>
            </div>
            {/* Botón de acceso rápido en el Header */}
            <div>
              <a 
                href={urlSistemaReal}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary inline-block text-center font-mono text-xs tracking-widest uppercase py-3 px-6 shadow-[0_0_15px_rgba(0,255,65,0.2)]"
              >
                [ INGRESAR AL OPERATIVO ]
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Ecosystem Layers */}
        <SectionHeader
          label="ESTRUCTURA"
          title={<>Las 3 capas del <span className="text-neon-primary">ecosistema.</span></>}
        />

        <div className="space-y-4 mb-16">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <TerminalPanel
                title={`${layer.id} :: ${layer.name}`}
                glowColor={layer.color === 'warn' ? 'warn' : 'green'}
              >
                <div className="p-5 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <p className="font-sans text-sm text-text-muted leading-relaxed mb-4">{layer.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {layer.components.map((c) => (
                        <span key={c} className="tag">{c}</span>
                      ))}
                    </div>
                    {/* Botón táctico dentro de la capa L3 que es la del software */}
                    {layer.id === 'L3' && (
                      <a 
                        href={urlSistemaReal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-neon-primary hover:underline block mt-2"
                      >
                        &gt; EJECUTAR INFRAESTRUCTURA_
                      </a>
                    )}
                  </div>
                  <div className="md:w-24 flex items-center justify-center">
                    <span className={`font-mono text-4xl font-bold ${
                      layer.color === 'warn' ? 'text-accent-warn/20' :
                      layer.color === 'primary' ? 'text-neon-primary' : 'text-neon-primary/20'
                    }`}>
                      {layer.id}
                    </span>
                  </div>
                </div>
              </TerminalPanel>
            </motion.div>
          ))}
        </div>

        {/* Daily Protocol */}
        <SectionHeader
          label="PROTOCOLO DIARIO"
          title={<>El día <span className="text-neon-primary">estructurado.</span></>}
          subtitle="No hay días libres del sistema. Solo días de sesión completa y días de sesión reducida."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
          {habitStacks.map((block, i) => (
            <motion.div
              key={block.time}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="terminal-panel border border-bg-border p-4 hover:border-neon-primary/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-neon-primary">{block.time}</span>
                <span className={`font-mono text-xs px-1.5 py-0.5 border ${
                  block.priority === 'CRÍTICO'
                    ? 'border-accent-warn/40 text-accent-warn bg-accent-warn/5'
                    : 'border-text-dim text-text-dim'
                }`}>
                  {block.priority}
                </span>
              </div>
              <div className="font-mono text-xs font-bold text-text-primary mb-2">{block.label}</div>
              <div className="space-y-1">
                {block.items.map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <span className="text-neon-primary text-xs">·</span>
                    <span className="font-mono text-xs text-text-dim">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Anti-Vices */}
        <SectionHeader
          label="CONTROL DE VICIOS"
          title={<>Los <span className="text-accent-warn">enemigos</span> del sistema.</>}
          subtitle="Los vicios no se controlan con fuerza de voluntad. Se eliminan con diseño de entorno y sustitución sistémica."
        />

        <TerminalPanel title="ANTI_VICIOS :: estado_actual" animate className="mb-16">
          <div className="p-4">
            <div className="space-y-4">
              {antiVicios.map((v, i) => (
                <motion.div
                  key={v.vicio}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-bg-base border border-bg-border hover:border-neon-primary/10 transition-colors"
                >
                  <div>
                    <div className="font-mono text-xs text-text-muted mb-0.5">VICIO</div>
                    <div className="font-mono text-sm font-bold text-text-primary">{v.vicio}</div>
                  </div>
                  <div>
                    <div className="font-mono text-xs text-text-muted mb-0.5">ESTADO</div>
                    <span className={`font-mono text-xs font-bold ${
                      v.estado === 'ELIMINADO' ? 'text-neon-primary' : 'text-accent-warn'
                    }`}>
                      {v.estado}
                    </span>
                  </div>
                  <div>
                    <div className="font-mono text-xs text-text-muted mb-0.5">DÍAS LIMPIO</div>
                    <div className="font-mono text-sm font-bold text-neon-primary">{v.dias}d</div>
                  </div>
                  <div>
                    <div className="font-mono text-xs text-text-muted mb-0.5">PROTOCOLO</div>
                    <div className="font-sans text-xs text-text-muted leading-relaxed">{v.protocol}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TerminalPanel>

        {/* CTA FINAL DE REDIRECCIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="terminal-panel border border-neon-primary/20 p-8 text-center"
          style={{ boxShadow: '0 0 30px rgba(0,255,65,0.04)' }}
        >
          <div className="section-label mb-4 block">ACCESO AL SISTEMA OPERATIVO</div>
          <h2 className="font-mono text-xl font-bold text-text-primary mb-3">
            ¿Listo para inicializar la consola de hábitos?
          </h2>
          <p className="font-sans text-text-muted text-sm mb-6 max-w-md mx-auto">
            Accede de forma segura a tu base de datos de rendimiento. Registra no negociables, interactúa en la comunidad y compite contra las rachas de otros operadores.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Cambiados de <Link> a <a> externos limpios apuntando a tu Lovable */}
            <a 
              href={urlSistemaReal}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Iniciar Sesión / Registrarme
            </a>
            <a 
              href={urlSistemaReal}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Entrar a la Comunidad Táctica
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
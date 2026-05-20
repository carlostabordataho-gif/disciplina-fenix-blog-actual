import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TerminalPanelProps {
  title?: string
  children: ReactNode
  className?: string
  glowColor?: 'green' | 'warn'
  animate?: boolean
}

export default function TerminalPanel({
  title,
  children,
  className = '',
  glowColor = 'green',
  animate = false,
}: TerminalPanelProps) {
  const borderColor = glowColor === 'warn' ? 'border-accent-warn/30' : 'border-bg-border'
  const headerColor = glowColor === 'warn' ? 'bg-accent-warn/10 border-accent-warn/30' : 'bg-bg-panel border-bg-border'
  const dotColor = glowColor === 'warn' ? 'bg-accent-warn' : 'bg-neon-primary'

  const panel = (
    <div className={`terminal-panel ${borderColor} border ${className}`}>
      {title && (
        <div className={`flex items-center gap-2 px-4 py-2 border-b ${headerColor}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">{title}</span>
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {panel}
      </motion.div>
    )
  }

  return panel
}

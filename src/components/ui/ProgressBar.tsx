import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  label?: string
  showPercent?: boolean
  color?: 'green' | 'warn'
}

export default function ProgressBar({ value, label, showPercent = true, color = 'green' }: ProgressBarProps) {
  const barColor = color === 'warn' ? 'bg-accent-warn' : 'bg-neon-primary'
  const glowColor = color === 'warn'
    ? 'shadow-[0_0_8px_rgba(255,94,0,0.6)]'
    : 'shadow-[0_0_8px_rgba(0,255,65,0.6)]'

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="font-mono text-xs text-text-muted uppercase">{label}</span>}
          {showPercent && (
            <span className="font-mono text-xs text-neon-primary">{value}%</span>
          )}
        </div>
      )}
      <div className="h-1 bg-bg-border w-full overflow-hidden">
        <motion.div
          className={`h-full ${barColor} ${glowColor}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}

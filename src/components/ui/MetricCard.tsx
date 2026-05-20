import { motion } from 'framer-motion'

interface MetricCardProps {
  label: string
  value: string
  unit?: string
  index?: number
}

export default function MetricCard({ label, value, unit, index = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="terminal-panel border border-bg-border p-4 hover:border-neon-primary/30 transition-colors duration-300 group"
    >
      <div className="hud-label mb-2 group-hover:text-neon-primary/70 transition-colors">{label}</div>
      <div className="metric-value">{value}</div>
      {unit && <div className="font-mono text-xs text-text-dim mt-1 uppercase">{unit}</div>}
    </motion.div>
  )
}

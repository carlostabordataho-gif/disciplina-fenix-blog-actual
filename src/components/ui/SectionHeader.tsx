import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionHeaderProps {
  label: string
  title: ReactNode
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeader({ label, title, subtitle, align = 'left' }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'items-start'

  return (
    <motion.div
      className={`flex flex-col ${alignClass} gap-3 mb-12`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <span className="section-label">&gt; {label}</span>
      <h2 className="font-mono text-2xl md:text-3xl font-bold text-text-primary leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="font-sans text-text-muted text-sm leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
      <div className="glow-line w-16" />
    </motion.div>
  )
}

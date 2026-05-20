import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SectionHeader from '../ui/SectionHeader'
import { blogPosts } from '../../data/blogPosts'

export default function ContentHubSection() {
  const latest = blogPosts.slice(0, 3)

  return (
    <section className="py-24 bg-bg-base relative overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          label="CONTENIDO"
          title={<>El <span className="text-neon-primary">hub de ejecución.</span></>}
          subtitle="Artículos técnicos. Protocolos documentados. Build logs reales. No contenido de relleno."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {latest.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="terminal-panel border border-bg-border p-5 hover:border-neon-primary/30 transition-colors duration-300 group flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="tag-green">{post.category}</span>
                <span className="font-mono text-xs text-text-dim">{post.readTime}m read</span>
              </div>
              <h3 className="font-mono text-sm font-bold text-text-primary mb-2 leading-snug group-hover:text-neon-primary transition-colors flex-1">
                {post.title}
              </h3>
              <p className="font-sans text-xs text-text-muted leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-text-dim">{post.date}</span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="font-mono text-xs text-neon-primary hover:text-neon-secondary transition-colors"
                >
                  Leer →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* TikTok CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="terminal-panel border border-bg-border p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="hud-label mb-1">TIKTOK :: proceso_documentado</div>
              <p className="font-sans text-sm text-text-muted">
                El proceso documentado en video. Gym, código, sistemas, mentalidad. Sin filtros.
              </p>
            </div>
            <a
              href="https://tiktok.com/@carlostaho"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary shrink-0 flex items-center gap-2"
            >
              <span>@carlostaho</span>
            </a>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <Link to="/blog" className="btn-primary">
            Ver todo el contenido
          </Link>
        </div>
      </div>
    </section>
  )
}

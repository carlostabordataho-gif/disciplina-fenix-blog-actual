import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts, categories } from '../data/blogPosts'

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? blogPosts.filter((p) => p.category === activeCategory)
    : blogPosts

  const featured = blogPosts[0]
  const rest = filtered.filter((p) => p.slug !== featured.slug || activeCategory)

  return (
    <div className="min-h-screen pt-16 bg-bg-base">
      {/* Header */}
      <div className="border-b border-bg-border bg-bg-panel relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-neon-primary rounded-full animate-pulse" />
            <span className="section-label">BLOG :: base_de_conocimiento</span>
          </div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Ejecución <span className="text-neon-primary">documentada.</span>
          </h1>
          <p className="font-sans text-text-muted text-sm max-w-xl leading-relaxed">
            No contenido genérico. Protocolos reales, sistemas probados y el proceso de reconstrucción documentado.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`font-mono text-xs px-3 py-1.5 border uppercase tracking-wider transition-colors ${
              !activeCategory
                ? 'border-neon-primary text-neon-primary bg-neon-primary/5'
                : 'border-text-dim text-text-muted hover:border-text-muted'
            }`}
          >
            Todo
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-xs px-3 py-1.5 border uppercase tracking-wider transition-colors ${
                activeCategory === cat
                  ? 'border-neon-primary text-neon-primary bg-neon-primary/5'
                  : 'border-text-dim text-text-muted hover:border-text-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post (only when no filter) */}
        {!activeCategory && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="terminal-panel border border-neon-primary/20 p-6 md:p-8 mb-8 group hover:border-neon-primary/40 transition-colors"
            style={{ boxShadow: '0 0 30px rgba(0,255,65,0.04)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="tag-warn">DESTACADO</span>
              <span className="tag-green">{featured.category}</span>
              <span className="font-mono text-xs text-text-dim">{featured.readTime}m read</span>
            </div>
            <h2 className="font-mono text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-neon-primary transition-colors">
              {featured.title}
            </h2>
            <p className="font-sans text-text-muted text-sm leading-relaxed mb-5 max-w-2xl">
              {featured.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {featured.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <Link
                to={`/blog/${featured.slug}`}
                className="font-mono text-sm text-neon-primary hover:text-neon-secondary transition-colors"
              >
                Leer artículo →
              </Link>
            </div>
          </motion.article>
        )}

        {/* Posts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeCategory ? filtered : rest).map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="terminal-panel border border-bg-border p-5 hover:border-neon-primary/30 transition-colors duration-300 group flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="tag-green">{post.category}</span>
                <span className="font-mono text-xs text-text-dim">{post.readTime}m</span>
              </div>
              <h3 className="font-mono text-sm font-bold text-text-primary mb-2 leading-snug group-hover:text-neon-primary transition-colors flex-1">
                {post.title}
              </h3>
              <p className="font-sans text-xs text-text-muted leading-relaxed mb-4">{post.excerpt}</p>
              <div className="border-t border-bg-border pt-3 flex items-center justify-between">
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
      </div>
    </div>
  )
}

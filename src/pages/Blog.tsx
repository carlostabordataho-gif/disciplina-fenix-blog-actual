import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '../data/blogPosts'
import usePageMeta from '../lib/usePageMeta'

export default function Blog() {
  usePageMeta(
    'Blog — Disciplina, hábitos, IA y deep work | TABORDA SYSTEM',
    'Protocolos reales, no consejos. Dopamina, gym, deep work, IA y el proceso de reconstrucción personal documentado por Carlos Taborda.'
  )

  // ?q= viene del cuadro de búsqueda de sitelinks de Google (SearchAction) y
  // de URLs de búsqueda compartidas. Inicializa el buscador y se mantiene en sync.
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    const next = query.trim()
    const current = searchParams.get('q') ?? ''
    if (next === current) return
    const params = new URLSearchParams(searchParams)
    if (next) params.set('q', next)
    else params.delete('q')
    setSearchParams(params, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Categorías DERIVADAS de los posts: nunca mostramos un filtro vacío.
  const categoriesWithCount = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of blogPosts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return blogPosts.filter((p) => {
      const matchesCategory = !activeCategory || p.category === activeCategory
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  const isFiltering = Boolean(activeCategory) || query.trim().length > 0
  const featured = blogPosts[0]
  // Sin filtros, el destacado va arriba aparte; el resto, en la grilla.
  const grid = isFiltering ? filtered : filtered.filter((p) => p.slug !== featured.slug)

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
        {/* Buscador */}
        <div className="mb-6 relative max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-neon-primary pointer-events-none">&gt;</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="buscar protocolo, tema o tag…"
            aria-label="Buscar en el blog"
            className="w-full bg-bg-base border border-bg-border text-text-primary font-mono text-sm pl-8 pr-4 py-3 focus:outline-none focus:border-neon-primary/50 placeholder-text-dim transition-colors"
          />
        </div>

        {/* Categories filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`font-mono text-xs px-3 py-1.5 border uppercase tracking-wider transition-colors ${
              !activeCategory
                ? 'border-neon-primary text-neon-primary bg-neon-primary/5'
                : 'border-text-dim text-text-muted hover:border-text-muted'
            }`}
          >
            Todo <span className="text-text-dim">({blogPosts.length})</span>
          </button>
          {categoriesWithCount.map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-xs px-3 py-1.5 border uppercase tracking-wider transition-colors ${
                activeCategory === cat
                  ? 'border-neon-primary text-neon-primary bg-neon-primary/5'
                  : 'border-text-dim text-text-muted hover:border-text-muted'
              }`}
            >
              {cat} <span className="text-text-dim">({count})</span>
            </button>
          ))}
        </div>

        {/* Contador de resultados */}
        <div className="font-mono text-xs text-text-dim mb-8">
          {filtered.length === 0
            ? '> 0 resultados. Prueba otro término.'
            : `> ${filtered.length} artículo${filtered.length === 1 ? '' : 's'}${
                isFiltering ? (filtered.length === 1 ? ' encontrado' : ' encontrados') : ''
              }`}
        </div>

        {/* Featured post (only when no filter) */}
        {!isFiltering && (
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
          {grid.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.07, 0.5) }}
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

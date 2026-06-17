import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '../data/blogPosts'
import { funnel } from '../data/funnel'
import usePageMeta from '../lib/usePageMeta'
import { track } from '../lib/track'
import ResetCapture from '../components/funnel/ResetCapture'

function renderContent(content: string) {
  const lines = content.trim().split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="font-mono text-lg font-bold text-text-primary mt-8 mb-3 border-l-2 border-neon-primary pl-3">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={key++} className="font-mono text-sm font-bold text-neon-primary mt-4 mb-1">
          {line.slice(2, -2)}
        </p>
      )
    } else if (line.startsWith('- ')) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 mb-1">
          <span className="text-neon-primary mt-1 shrink-0">▸</span>
          <span className="font-sans text-sm text-text-muted leading-relaxed">{line.slice(2)}</span>
        </div>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />)
    } else {
      elements.push(
        <p key={key++} className="font-sans text-sm text-text-muted leading-relaxed">
          {line}
        </p>
      )
    }
  }

  return elements
}

const SITE = funnel.siteUrl.replace(/\/$/, '')

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)
  const [copied, setCopied] = useState(false)

  const url = `${SITE}/blog/${slug}`

  // Datos estructurados Article: Google entiende autor, fecha y tema.
  // useMemo evita reinyectar el <script> en cada render.
  const jsonLd = useMemo(
    () =>
      post
        ? {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            url,
            mainEntityOfPage: url,
            articleSection: post.category,
            keywords: post.tags.join(', '),
            inLanguage: 'es',
            author: {
              '@type': 'Person',
              name: 'Carlos Taborda',
              url: SITE,
            },
            publisher: {
              '@type': 'Organization',
              name: 'TABORDA SYSTEM',
              url: SITE,
            },
          }
        : null,
    [post, url]
  )

  usePageMeta(
    post ? `${post.title} — TABORDA SYSTEM` : 'Artículo no encontrado — TABORDA SYSTEM',
    post?.excerpt,
    post ? { type: 'article', canonical: `/blog/${post.slug}`, jsonLd } : { noindex: true }
  )

  if (!post) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-neon-primary text-sm mb-4">&gt; 404 :: post_not_found</div>
          <Link to="/blog" className="btn-secondary text-sm">← Volver al blog</Link>
        </div>
      </div>
    )
  }

  const related = blogPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2)

  const shareText = `${post.title} — por Carlos Taborda`
  const shares = [
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ]

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      track('blog_share', { method: 'copy', slug: post.slug })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard bloqueado: el usuario aún tiene los botones de redes */
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-bg-base">
      {/* Header */}
      <div className="border-b border-bg-border bg-bg-panel relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <Link to="/blog" className="font-mono text-xs text-text-muted hover:text-neon-primary transition-colors mb-6 block">
            ← Volver al blog
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="tag-green">{post.category}</span>
            <span className="font-mono text-xs text-text-dim">{post.date}</span>
            <span className="font-mono text-xs text-text-dim">{post.readTime} min read</span>
          </div>
          <h1 className="font-mono text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-4">
            {post.title}
          </h1>
          <p className="font-sans text-text-muted text-sm leading-relaxed max-w-2xl mb-5">{post.excerpt}</p>
          {/* Byline: señal de autoría (E-E-A-T) y marca personal */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-neon-primary/40 bg-neon-primary/10 flex items-center justify-center font-mono text-xs text-neon-primary font-bold shrink-0">
              CT
            </div>
            <div className="font-mono text-xs leading-tight">
              <div className="text-text-primary">Carlos Taborda</div>
              <div className="text-text-dim">Fundador · TABORDA SYSTEM</div>
            </div>
          </div>
          <div className="glow-line w-32 mt-6" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="terminal-panel border border-bg-border p-6 md:p-8 mb-8"
        >
          <div className="space-y-2">
            {renderContent(post.content)}
          </div>
        </motion.div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        {/* Compartir */}
        <div className="flex flex-wrap items-center gap-3 mb-10 border-y border-bg-border py-4">
          <span className="hud-label">Compartir</span>
          {shares.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('blog_share', { method: s.label.toLowerCase(), slug: post.slug })}
              className="font-mono text-xs px-3 py-1.5 border border-bg-border text-text-muted hover:border-neon-primary/40 hover:text-neon-primary transition-colors uppercase tracking-wider"
            >
              {s.label}
            </a>
          ))}
          <button
            onClick={copyLink}
            className="font-mono text-xs px-3 py-1.5 border border-bg-border text-text-muted hover:border-neon-primary/40 hover:text-neon-primary transition-colors uppercase tracking-wider"
          >
            {copied ? '✓ Copiado' : 'Copiar link'}
          </button>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mb-12">
            <div className="hud-label mb-4">Artículos relacionados</div>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="terminal-panel border border-bg-border p-4 hover:border-neon-primary/30 transition-colors group"
                >
                  <div className="tag-green mb-2 inline-block">{r.category}</div>
                  <h3 className="font-mono text-sm font-bold text-text-primary group-hover:text-neon-primary transition-colors">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA de captura: el lector terminó el artículo → ofrécele el RESET */}
        <div className="terminal-panel border border-neon-primary/20 p-6 md:p-8 text-center" style={{ boxShadow: '0 0 30px rgba(0,255,65,0.04)' }}>
          <div className="section-label mb-3 block">¿Listo para ejecutar?</div>
          <h2 className="font-mono text-xl md:text-2xl font-bold text-text-primary mb-2">
            Deja de leer sobre disciplina. Instálala.
          </h2>
          <p className="font-sans text-text-muted text-sm leading-relaxed mb-6 max-w-md mx-auto">
            El Protocolo RESET de 7 días, gratis. El mismo sistema que documento aquí, listo para ejecutar hoy.
          </p>
          <ResetCapture source={`blog:${post.slug}`} compact />
        </div>
      </div>
    </div>
  )
}

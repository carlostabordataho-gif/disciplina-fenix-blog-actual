import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '../data/blogPosts'

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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)

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
          <p className="font-sans text-text-muted text-sm leading-relaxed max-w-2xl">{post.excerpt}</p>
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
        <div className="flex flex-wrap gap-2 mb-10">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
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
      </div>
    </div>
  )
}

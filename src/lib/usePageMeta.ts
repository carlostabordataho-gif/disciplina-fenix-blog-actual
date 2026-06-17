import { useEffect } from 'react'
import { funnel } from '../data/funnel'

/**
 * SEO por ruta en una SPA: título, description, canonical, Open Graph,
 * Twitter Card y datos estructurados (JSON-LD) por página.
 *
 * Por qué importa: el index.html fija canonical y og:url al home. Sin esto,
 * TODA ruta (incluidos los artículos del blog) le decía a Google y a las
 * redes que su URL canónica era la portada → contenido duplicado y previews
 * equivocados al compartir. Aquí cada ruta declara su propia identidad.
 *
 * (Sin SSR, esto cubre crawlers que ejecutan JS y los links compartidos tras
 * la hidratación; suficiente para un sitio cuyo tráfico arranca en TikTok.)
 */
interface PageMetaOptions {
  /** Rutas privadas (p.ej. /bienvenida) que no deben indexarse. */
  noindex?: boolean
  /** URL canónica absoluta. Por defecto: siteUrl + ruta actual. */
  canonical?: string
  /** Imagen para OG/Twitter (absoluta o ruta /…). Por defecto: og-cover. */
  image?: string
  /** Tipo de Open Graph. 'article' para posts del blog. */
  type?: 'website' | 'article'
  /** Objeto JSON-LD a inyectar (Article, FAQPage, etc.). */
  jsonLd?: Record<string, unknown> | null
}

const SITE = funnel.siteUrl.replace(/\/$/, '')

/** Convierte una ruta relativa en URL absoluta del sitio. */
function absolute(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http')) return pathOrUrl
  return `${SITE}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

/** Crea o actualiza una meta tag por nombre/propiedad. */
function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export default function usePageMeta(
  title: string,
  description?: string,
  opts: PageMetaOptions = {}
) {
  const { noindex = false, canonical, image, type = 'website', jsonLd } = opts

  useEffect(() => {
    const path =
      typeof window !== 'undefined' ? window.location.pathname : '/'
    const canonicalUrl = canonical ? absolute(canonical) : `${SITE}${path}`
    const imageUrl = absolute(image ?? '/og-cover.png')

    // ── Título y description ──────────────────────────────────────────
    document.title = title
    if (description) {
      upsertMeta('name', 'description', description)
    }

    // ── Canonical ─────────────────────────────────────────────────────
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonicalUrl

    // ── Open Graph + Twitter (preview correcto al compartir) ──────────
    upsertMeta('property', 'og:title', title)
    if (description) upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonicalUrl)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('name', 'twitter:title', title)
    if (description) upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)

    // ── Datos estructurados por página (JSON-LD) ──────────────────────
    let ldScript: HTMLScriptElement | null = null
    if (jsonLd) {
      ldScript = document.createElement('script')
      ldScript.type = 'application/ld+json'
      ldScript.setAttribute('data-page-jsonld', 'true')
      ldScript.text = JSON.stringify(jsonLd)
      document.head.appendChild(ldScript)
    }

    // ── noindex para rutas privadas ───────────────────────────────────
    let robots: HTMLMetaElement | null = null
    if (noindex) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      robots.content = 'noindex, nofollow'
      document.head.appendChild(robots)
    }

    // Limpieza al navegar: el meta es global en una SPA. Quitamos lo que
    // es específico de ESTA ruta para no contaminar la siguiente.
    return () => {
      if (ldScript) ldScript.remove()
      if (robots) robots.remove()
    }
  }, [title, description, noindex, canonical, image, type, jsonLd])
}

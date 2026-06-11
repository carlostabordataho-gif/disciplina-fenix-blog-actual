import { useEffect } from 'react'

/**
 * SEO por ruta en una SPA: título y meta description por página.
 * (Sin SSR esto cubre Google/links compartidos tras hidratación; suficiente
 * para un sitio cuyo tráfico real viene de TikTok, no de búsqueda.)
 */
export default function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.name = 'description'
        document.head.appendChild(tag)
      }
      tag.content = description
    }
  }, [title, description])
}

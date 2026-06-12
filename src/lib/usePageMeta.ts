import { useEffect } from 'react'

/**
 * SEO por ruta en una SPA: título y meta description por página.
 * (Sin SSR esto cubre Google/links compartidos tras hidratación; suficiente
 * para un sitio cuyo tráfico real viene de TikTok, no de búsqueda.)
 */
export default function usePageMeta(
  title: string,
  description?: string,
  opts?: { noindex?: boolean }
) {
  const noindex = opts?.noindex === true
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
    // noindex para rutas privadas (p.ej. /bienvenida, la página post-compra).
    // En una SPA el meta es global: se retira al navegar a otra ruta para
    // no des-indexar el resto del sitio.
    if (noindex) {
      let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
      if (!robots) {
        robots = document.createElement('meta')
        robots.name = 'robots'
        document.head.appendChild(robots)
      }
      robots.content = 'noindex, nofollow'
      return () => {
        robots?.remove()
      }
    }
  }, [title, description, noindex])
}

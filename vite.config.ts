import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { blogPosts } from './src/data/blogPosts'

// El eBook (public/reset-protocolo.html) es un archivo estático: Vite lo copia
// tal cual y NO le inyecta env vars. Este plugin lo post-procesa:
// si VITE_COHORTE_CHECKOUT_URL trae un link válido (Hotmart), el CTA final
// '[ INICIAR INSTALACIÓN SUPERVISADA :: 21 DÍAS ]' pasa de la página
// /protocolo directo al checkout, con nota de pago seguro.
// - build: reescribe dist/reset-protocolo.html (lo que despliega Vercel).
// - dev:   sirve el HTML ya inyectado, para que local == producción.
// Los strings de abajo deben coincidir con los del HTML (están comentados allí).
const EBOOK_FILE = 'reset-protocolo.html'
const EBOOK_FALLBACK_HREF = 'https://tabordasystem.com/protocolo?src=reset-ebook'
const EBOOK_FALLBACK_NOTE = 'Instalación Supervisada · acceso inmediato · único pago'
const EBOOK_PREMIUM_NOTE = 'Pago seguro vía Hotmart · confirmación inmediata'

const isValidCheckout = (url: string | undefined): url is string =>
  !!url && url.startsWith('http') && !url.includes('REEMPLAZAR') && !url.includes('TU-LINK')

function injectCheckoutIntoEbook(checkoutUrl: string | undefined): Plugin {
  const inject = (html: string, url: string) =>
    html.split(EBOOK_FALLBACK_HREF).join(url).replace(EBOOK_FALLBACK_NOTE, EBOOK_PREMIUM_NOTE)

  return {
    name: 'taborda:inject-checkout-ebook',
    // Dev: intercepta /reset-protocolo.html y lo sirve con el checkout inyectado.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!isValidCheckout(checkoutUrl)) return next()
        if ((req.url || '').split('?')[0] !== `/${EBOOK_FILE}`) return next()
        const file = path.resolve(process.cwd(), 'public', EBOOK_FILE)
        if (!fs.existsSync(file)) return next()
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(inject(fs.readFileSync(file, 'utf8'), checkoutUrl))
      })
    },
    // Build: reescribe el archivo ya copiado a dist/.
    closeBundle() {
      if (!isValidCheckout(checkoutUrl)) {
        console.log(`[taborda] eBook: sin checkout (VITE_COHORTE_CHECKOUT_URL vacía) — CTA apunta a /protocolo`)
        return
      }
      const file = path.resolve(process.cwd(), 'dist', EBOOK_FILE)
      if (!fs.existsSync(file)) {
        console.warn(`[taborda] eBook: no se encontró dist/${EBOOK_FILE}, no se inyectó el checkout`)
        return
      }
      const html = fs.readFileSync(file, 'utf8')
      if (!html.includes(EBOOK_FALLBACK_HREF)) {
        console.warn(`[taborda] eBook: marcador del CTA no encontrado en ${EBOOK_FILE} — revisar strings del plugin`)
        return
      }
      fs.writeFileSync(file, inject(html, checkoutUrl))
      console.log(`[taborda] eBook: CTA inyectado → ${checkoutUrl}`)
    },
  }
}

// ─────────────────────────────────────────────────────────────────────
// PRERENDER SEO POR RUTA
// La app es una SPA: los crawlers sociales (Facebook, WhatsApp, LinkedIn, X)
// NO ejecutan JS, así que nunca ven los meta que inyecta usePageMeta en runtime.
// Este plugin, tras el build, clona dist/index.html y reemplaza el bloque entre
// <!--SEO:START--> y <!--SEO:END--> con meta + Open Graph + JSON-LD correctos por
// ruta, escribiendo un HTML estático por página (dist/<ruta>/index.html). Vercel
// sirve el archivo del filesystem antes que el rewrite catch-all, así que cada URL
// entrega su propio SEO. Además genera dist/rss.xml para sindicación.
// ─────────────────────────────────────────────────────────────────────
const SITE = 'https://tabordasystem.com'
const OG_IMAGE = `${SITE}/og-cover.png`

const escAttr = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const escXml = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

// JSON-LD seguro dentro de <script>: neutraliza el cierre </script>.
const ld = (obj: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Carlos Taborda',
  url: SITE,
  image: `${SITE}/transformacion-fenix.jpg`,
  description:
    'Carlos Taborda, fundador de TABORDA SYSTEM. Ayuda a personas atrapadas en la procrastinación, las adicciones y la falta de propósito a reconstruirse desde cero con disciplina, hábitos, mentalidad y ejecución supervisada.',
  sameAs: ['https://www.tiktok.com/@carlostaho'],
  jobTitle: 'Fundador de TABORDA SYSTEM (Disciplina Fénix)',
  worksFor: { '@type': 'Organization', name: 'TABORDA SYSTEM' },
  knowsAbout: [
    'disciplina',
    'hábitos',
    'procrastinación',
    'dejar adicciones',
    'accountability',
    'productividad',
    'desarrollo personal',
    'deep work',
  ],
}

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TABORDA SYSTEM',
  alternateName: 'Disciplina Fénix',
  url: SITE,
  logo: `${SITE}/favicon.svg`,
  image: `${SITE}/og-cover.png`,
  description:
    'Sistema operativo de disciplina: protocolos ejecutables, métricas diarias y ejecución supervisada para reconstruirte desde cero.',
  founder: { '@type': 'Person', name: 'Carlos Taborda' },
  sameAs: ['https://www.tiktok.com/@carlostaho'],
}

// WebSite + SearchAction: habilita el cuadro de búsqueda de sitelinks en Google.
const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TABORDA SYSTEM',
  url: SITE,
  inLanguage: 'es',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/blog?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

// FAQPage: espejo de src/components/home/FaqSection.tsx (rich result de FAQ).
const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    ['¿Esto es un curso?', 'No. Los cursos son información y la información gratis está en mi TikTok. Esto es ejecución supervisada: protocolo exacto + alguien revisando cada noche si cumpliste.'],
    ['¿Y si trabajo o estudio todo el día?', 'El protocolo se calibra contigo en la llamada 1:1 del día 0. No necesitas 5 horas libres: necesitas cumplir lo pactado.'],
    ['¿Necesito gym?', 'No. Hay versión de entrenamiento en casa. Lo no negociable es moverte 30 minutos, no el lugar.'],
    ['¿Qué pasa si recaigo en mi vicio?', 'Sigues dentro — si lo reportas. Hay un protocolo de 24 horas para las caídas. Lo único que te saca es esconderlo o desaparecer.'],
    ['¿Por qué tan barato?', 'Es precio fundador: entras antes de que existan decenas de testimonios. Ese descuento premia el riesgo que asumes hoy, y sube a medida que entran más operadores. El que llega primero, paga menos.'],
  ].map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const breadcrumbLd = (items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE}${it.path}`,
  })),
})

const blogPostingLd = (post: (typeof blogPosts)[number]) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt,
  datePublished: post.date,
  dateModified: post.date,
  url: `${SITE}/blog/${post.slug}`,
  mainEntityOfPage: `${SITE}/blog/${post.slug}`,
  articleSection: post.category,
  keywords: post.tags.join(', '),
  inLanguage: 'es',
  author: { '@type': 'Person', name: 'Carlos Taborda', url: SITE },
  publisher: { '@type': 'Organization', name: 'TABORDA SYSTEM', url: SITE },
})

interface SeoRoute {
  path: string
  title: string
  description: string
  type: 'website' | 'article'
  jsonLd: unknown[]
}

const staticRoutes: SeoRoute[] = [
  {
    path: '/',
    title: 'TABORDA SYSTEM — El Sistema Operativo de Disciplina | Carlos Taborda',
    description:
      'TABORDA SYSTEM es el sistema operativo de disciplina que instalas en tu vida: protocolos ejecutables, métricas diarias y consecuencias reales. La motivación se agota. El sistema se ejecuta. Construido públicamente por Carlos Taborda.',
    type: 'website',
    jsonLd: [personLd, organizationLd, websiteLd, faqLd],
  },
  {
    path: '/blog',
    title: 'Blog — Disciplina, hábitos, IA y deep work | TABORDA SYSTEM',
    description:
      'Protocolos reales, no consejos. Dopamina, gym, deep work, IA y el proceso de reconstrucción personal documentado por Carlos Taborda.',
    type: 'website',
    jsonLd: [breadcrumbLd([{ name: 'Inicio', path: '/' }, { name: 'Blog', path: '/blog' }])],
  },
  {
    path: '/protocolo',
    title: 'Protocolo Fénix — 21 días de ejecución supervisada | Disciplina Fénix',
    description:
      'Instalación Supervisada de 21 días con check-in diario revisado, llamada 1:1 y llamadas grupales. Acceso inmediato: empiezas el día que entras. Precio fundador $35 USD / $140.000 COP.',
    type: 'website',
    jsonLd: [breadcrumbLd([{ name: 'Inicio', path: '/' }, { name: 'Protocolo Fénix', path: '/protocolo' }])],
  },
  {
    path: '/sistema',
    title: 'El Sistema — Arquitectura de conducta y disciplina extrema | TABORDA SYSTEM',
    description:
      'La arquitectura de conducta detrás de la disciplina extrema: identidad, protocolos y ejecución real. Las 3 capas del ecosistema y el acceso al sistema operativo personal.',
    type: 'website',
    jsonLd: [breadcrumbLd([{ name: 'Inicio', path: '/' }, { name: 'El Sistema', path: '/sistema' }])],
  },
  {
    path: '/comunidad',
    title: 'Comunidad Táctica — Accountability y disciplina en grupo | TABORDA SYSTEM',
    description:
      'El escuadrón de operadores: accountability honesta, ejecución documentada y rachas que se sostienen en grupo. Productividad extrema con reglas claras, sin victimismo ni ego.',
    type: 'website',
    jsonLd: [breadcrumbLd([{ name: 'Inicio', path: '/' }, { name: 'Comunidad', path: '/comunidad' }])],
  },
  {
    path: '/reset',
    title: 'Protocolo RESET gratis — 7 días para cortar el ciclo | Disciplina Fénix',
    description:
      'El protocolo exacto de 7 días para romper con los vicios, el teléfono y el caos. Gratis. No motivación: ejecución.',
    type: 'website',
    jsonLd: [breadcrumbLd([{ name: 'Inicio', path: '/' }, { name: 'Protocolo RESET', path: '/reset' }])],
  },
  {
    path: '/road-to-2030',
    title: 'Road to 2030 — La hoja de ruta pública | TABORDA SYSTEM',
    description:
      'La hoja de ruta pública de TABORDA SYSTEM: construcción en público del ecosistema de disciplina rumbo a 2030.',
    type: 'website',
    jsonLd: [breadcrumbLd([{ name: 'Inicio', path: '/' }, { name: 'Road to 2030', path: '/road-to-2030' }])],
  },
  {
    path: '/legal',
    title: 'Legal — Disciplina Fénix',
    description:
      'Política de privacidad, términos y condiciones, Garantía Fénix y avisos legales de Disciplina Fénix.',
    type: 'website',
    jsonLd: [],
  },
]

const postRoutes: SeoRoute[] = blogPosts.map((post) => ({
  path: `/blog/${post.slug}`,
  title: `${post.title} — TABORDA SYSTEM`,
  description: post.excerpt,
  type: 'article',
  jsonLd: [
    blogPostingLd(post),
    breadcrumbLd([
      { name: 'Inicio', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ],
}))

function renderSeoBlock(route: SeoRoute): string {
  const url = `${SITE}${route.path}`
  const tags = [
    `<title>${escAttr(route.title)}</title>`,
    `<meta name="description" content="${escAttr(route.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="theme-color" content="#0a0e0a" />`,
    `<meta property="og:title" content="${escAttr(route.title)}" />`,
    `<meta property="og:description" content="${escAttr(route.description)}" />`,
    `<meta property="og:type" content="${route.type}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="es_CO" />`,
    `<meta property="og:site_name" content="TABORDA SYSTEM" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escAttr(route.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    ...route.jsonLd.map(ld),
  ]
  return tags.map((t) => `    ${t}`).join('\n')
}

function buildRss(): string {
  const items = blogPosts
    .map((p) => {
      const link = `${SITE}/blog/${p.slug}`
      return `    <item>
      <title>${escXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <category>${escXml(p.category)}</category>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escXml(p.excerpt)}</description>
    </item>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TABORDA SYSTEM — Blog de Carlos Taborda</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Disciplina, hábitos, deep work, IA y reconstrucción personal documentada.</description>
    <language>es</language>
${items}
  </channel>
</rss>
`
}

function prerenderSeo(): Plugin {
  return {
    name: 'taborda:prerender-seo',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist')
      const indexPath = path.join(distDir, 'index.html')
      if (!fs.existsSync(indexPath)) {
        console.warn('[taborda] prerender: no se encontró dist/index.html — se omite')
        return
      }
      const template = fs.readFileSync(indexPath, 'utf8')
      const START = '<!--SEO:START-->'
      const END = '<!--SEO:END-->'
      const sIdx = template.indexOf(START)
      const eIdx = template.indexOf(END)
      if (sIdx === -1 || eIdx === -1) {
        console.warn('[taborda] prerender: marcadores SEO no encontrados en index.html — se omite')
        return
      }
      const before = template.slice(0, sIdx + START.length)
      const after = template.slice(eIdx)
      const pageHtml = (route: SeoRoute) => `${before}\n${renderSeoBlock(route)}\n    ${after}`

      const all = [...staticRoutes, ...postRoutes]
      for (const route of all) {
        const html = pageHtml(route)
        if (route.path === '/') {
          fs.writeFileSync(indexPath, html)
        } else {
          const dir = path.join(distDir, route.path)
          fs.mkdirSync(dir, { recursive: true })
          fs.writeFileSync(path.join(dir, 'index.html'), html)
        }
      }

      fs.writeFileSync(path.join(distDir, 'rss.xml'), buildRss())
      console.log(`[taborda] prerender: ${all.length} rutas con SEO estático + rss.xml generados`)
    },
  }
}

export default defineConfig(({ mode }) => {
  // loadEnv lee .env/.env.local; en Vercel las vars llegan por process.env.
  const env = loadEnv(mode, process.cwd(), '')
  const checkoutUrl = env.VITE_COHORTE_CHECKOUT_URL || process.env.VITE_COHORTE_CHECKOUT_URL
  return {
    plugins: [react(), injectCheckoutIntoEbook(checkoutUrl), prerenderSeo()],
  }
})

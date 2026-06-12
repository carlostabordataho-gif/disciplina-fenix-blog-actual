import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// El eBook (public/reset-protocolo.html) es un archivo estático: Vite lo copia
// tal cual y NO le inyecta env vars. Este plugin lo post-procesa:
// si VITE_COHORTE_CHECKOUT_URL trae un link válido (Hotmart), el CTA final
// '[ ACCEDER AL PROTOCOLO RESET :: SOLICITAR ACCESO V1.0 ]' pasa de la página
// /protocolo directo al checkout, con nota de pago seguro.
// - build: reescribe dist/reset-protocolo.html (lo que despliega Vercel).
// - dev:   sirve el HTML ya inyectado, para que local == producción.
// Los strings de abajo deben coincidir con los del HTML (están comentados allí).
const EBOOK_FILE = 'reset-protocolo.html'
const EBOOK_FALLBACK_HREF = 'https://tabordasystem.com/protocolo?src=reset-ebook'
const EBOOK_FALLBACK_NOTE = 'Cohorte Fundadora · 10 plazas · único pago'
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

export default defineConfig(({ mode }) => {
  // loadEnv lee .env/.env.local; en Vercel las vars llegan por process.env.
  const env = loadEnv(mode, process.cwd(), '')
  const checkoutUrl = env.VITE_COHORTE_CHECKOUT_URL || process.env.VITE_COHORTE_CHECKOUT_URL
  return {
    plugins: [react(), injectCheckoutIntoEbook(checkoutUrl)],
  }
})

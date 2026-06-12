// Configuración central del funnel.
// ÚNICO archivo que se edita a mano durante el experimento de validación.
//
// CHECKLIST DE OPERADOR (lo único que tocas entre ventas):
//   1. Cada venta confirmada => sube cohortSpotsTaken en 1 y redeploy.
//   2. Cuando tengas link de pago automático (Hotmart/Gumroad/Bold/Wompi):
//      ponlo en la env var VITE_COHORTE_CHECKOUT_URL (Vercel → Settings →
//      Environment Variables) y redeploy. TODOS los botones de compra del
//      sitio pasan solos a la pasarela; sin la variable, siguen en WhatsApp.
//      (Alternativa local: pegar el link en checkoutUrl + paymentMode 'checkout'.)
//   3. Para mover fechas: edita cohortStartDate / cohortCloseDate.

export const funnel = {
  // ── Dominio y automatización ───────────────────────────────────────
  // Dominio canónico de producción (se envía en el payload del webhook
  // y sirve para construir links absolutos).
  siteUrl: 'https://tabordasystem.com',

  // Webhook de n8n que recibe cada lead del formulario RESET.
  // Configuración completa del pipeline: docs/n8n-pipeline.md.
  // En producción se recomienda usar la env var VITE_LEAD_WEBHOOK_URL
  // (tiene prioridad sobre este valor). Mientras ambos estén vacíos,
  // el formulario solo guarda en Supabase.
  leadWebhookUrl: '',

  // ── Cohorte Fundadora ──────────────────────────────────────────────
  cohortSpotsTotal: 10,
  cohortSpotsTaken: 0, // ACTUALIZAR A MANO con cada venta confirmada
  cohortStartDate: 'Lunes 23 de junio', // día 0 (llamada 1:1)
  cohortCloseDate: 'Domingo 22 de junio', // cierre de inscripciones
  priceUsd: 35,
  priceCop: '140.000',

  // ── Cómo se cobra ──────────────────────────────────────────────────
  // 'whatsapp' => los CTA de compra abren WhatsApp con un mensaje listo;
  //               tú cierras la venta 1:1 y envías el link de pago
  //               (Bold / Wompi / Nequi). Cero fricción técnica, ideal
  //               para las primeras ventas y resolución de dudas en vivo.
  // 'checkout'  => los CTA van directo a checkoutUrl (pago automático).
  paymentMode: 'whatsapp' as 'whatsapp' | 'checkout',

  // Pega aquí el link real cuando crees el producto (Hotmart/Bold/Wompi)
  // y cambia paymentMode a 'checkout'. Mientras quede vacío o de ejemplo,
  // el sistema usa WhatsApp aunque paymentMode diga 'checkout'.
  checkoutUrl: '',

  // ── Contacto ───────────────────────────────────────────────────────
  // Número de WhatsApp en formato internacional sin signos (Colombia +57).
  whatsappNumber: '573102929956',

  tiktokUrl: 'https://www.tiktok.com/@carlostaho',

  // Entregable del RESET: versión web imprimible (sirve como PDF)
  resetPdfUrl: '/reset-protocolo.html',
}

// ── Helpers ───────────────────────────────────────────────────────────

// Pasarela de pago de la Instalación Supervisada (Cohorte).
// Prioridad: env var VITE_COHORTE_CHECKOUT_URL (Vercel) > checkoutUrl fijo.
// Si la env var trae un link válido, el checkout se activa SOLO, sin tocar
// paymentMode: cambiar la variable en el dashboard + redeploy es suficiente.
const envCheckoutUrl =
  (import.meta.env.VITE_COHORTE_CHECKOUT_URL as string | undefined) ?? ''

const isValidCheckout = (url: string) =>
  url.startsWith('http') && !url.includes('REEMPLAZAR')

const effectiveCheckoutUrl = isValidCheckout(envCheckoutUrl)
  ? envCheckoutUrl
  : funnel.checkoutUrl

const checkoutIsReady =
  isValidCheckout(envCheckoutUrl) ||
  (funnel.paymentMode === 'checkout' && isValidCheckout(funnel.checkoutUrl))

/** Construye un deep-link de WhatsApp con mensaje pre-escrito. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${funnel.whatsappNumber}?text=${encodeURIComponent(message)}`
}

/**
 * URL del botón de COMPRA.
 * - Si hay pasarela lista (VITE_COHORTE_CHECKOUT_URL, o paymentMode 'checkout'
 *   + checkoutUrl válido) => checkout automático.
 * - Si no => WhatsApp con un mensaje de intención de compra ya redactado
 *   (fallback de pruebas y de cierre 1:1).
 * @param context etiqueta corta de dónde salió el click (para saber qué CTA convierte).
 */
export function buyUrl(context = 'web'): string {
  if (checkoutIsReady) {
    return effectiveCheckoutUrl
  }
  const msg =
    `Hola Carlos, quiero mi plaza en la Cohorte Fénix (precio fundador $${funnel.priceUsd} USD / $${funnel.priceCop} COP). ` +
    `¿Cómo hago el pago para asegurar mi cupo? [${context}]`
  return whatsappUrl(msg)
}

/** ¿El botón de compra abre WhatsApp (true) o un checkout automático (false)? */
export const buyOpensWhatsApp = !checkoutIsReady

/** Canal de contacto para dudas pre-compra. */
export const contactUrl = whatsappUrl(
  'Hola Carlos, tengo una duda sobre la Cohorte Fénix antes de decidir:'
)

export const cohortSpotsLeft = Math.max(
  0,
  funnel.cohortSpotsTotal - funnel.cohortSpotsTaken
)

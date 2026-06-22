// Configuración central del funnel.
// ÚNICO archivo que se edita a mano durante el experimento de validación.
//
// CHECKLIST DE OPERADOR (lo único que tocas entre ventas):
//   1. Para subir el precio fundador: edita priceUsd / priceCop y redeploy.
//   2. Cuando tengas link de pago automático (Hotmart/Gumroad/Bold/Wompi):
//      ponlo en la env var VITE_COHORTE_CHECKOUT_URL (Vercel → Settings →
//      Environment Variables) y redeploy. TODOS los botones de compra del
//      sitio pasan solos a la pasarela; sin la variable, siguen en WhatsApp.
//      (Alternativa local: pegar el link en checkoutUrl + paymentMode 'checkout'.)
//   3. Oferta evergreen: sin fechas ni plazas. Acceso inmediato, siempre.

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

  // ── Oferta evergreen: Protocolo Fénix (Instalación Supervisada · 21 días) ──
  // Antes era una cohorte con plazas y fecha de cierre. Ahora es EVERGREEN:
  // acceso inmediato, cualquiera entra cuando quiera. La urgencia honesta es
  // el PRECIO FUNDADOR (sube con el tiempo), no el cupo ni una fecha.
  priceUsd: 35, // precio fundador actual
  priceUsdRegular: 59, // precio regular al que subirá
  priceCop: '140.000',
  priceCopRegular: '240.000',

  // ── Cómo se cobra ──────────────────────────────────────────────────
  // 'whatsapp' => los CTA de compra abren WhatsApp con un mensaje listo;
  //               tú cierras la venta 1:1 y envías el link de pago
  //               (Bold / Wompi / Nequi). Cero fricción técnica, ideal
  //               para las primeras ventas y resolución de dudas en vivo.
  // 'checkout'  => los CTA van directo a checkoutUrl (pago automático).
  paymentMode: 'checkout' as 'whatsapp' | 'checkout',

  // Página de Pago real del producto activo en Hotmart:
  // "TABORDA SYSTEM :: Instalación Supervisada (21 Días)" — ID 7925154.
  // URL base tomada de los HotLinks de divulgación. buyUrl() le añade
  // dinámicamente ?sck=<context> para la atribución de cada CTA.
  checkoutUrl: 'https://pay.hotmart.com/J106301629M',

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
    // `sck` es el parámetro de tracking nativo de Hotmart: cada venta queda
    // etiquetada con el CTA que la originó (visible en el reporte de ventas).
    const sep = effectiveCheckoutUrl.includes('?') ? '&' : '?'
    return `${effectiveCheckoutUrl}${sep}sck=${encodeURIComponent(context)}`
  }
  const msg =
    `Hola Carlos, quiero entrar al Protocolo Fénix (Instalación Supervisada, precio fundador $${funnel.priceUsd} USD / $${funnel.priceCop} COP). ` +
    `¿Cómo hago el pago? [${context}]`
  return whatsappUrl(msg)
}

/** ¿El botón de compra abre WhatsApp (true) o un checkout automático (false)? */
export const buyOpensWhatsApp = !checkoutIsReady

/**
 * Texto del CTA de compra. Con pasarela activa (Hotmart) muta a la versión
 * premium; en modo WhatsApp mantiene el precio a la vista para el cierre 1:1.
 */
export function buyCtaLabel(): string {
  return checkoutIsReady
    ? '[ INICIAR INSTALACIÓN SUPERVISADA :: VERSIÓN PREMIUM ]'
    : `[ INICIAR INSTALACIÓN SUPERVISADA — $${funnel.priceUsd} USD ]`
}

/** Etiqueta de confianza bajo el CTA de compra, acorde al modo de cobro. */
export const buyTrustLabel = checkoutIsReady
  ? 'Pago seguro · confirmación inmediata'
  : 'Te abre WhatsApp conmigo. Confirmas tu cupo y te paso el link de pago seguro.'

/** Canal de contacto para dudas pre-compra. */
export const contactUrl = whatsappUrl(
  'Hola Carlos, tengo una duda sobre el Protocolo Fénix antes de decidir:'
)

/** Urgencia honesta basada en PRECIO (no en cupo ni fecha). */
export const founderPriceNote = `Precio fundador · sube a $${funnel.priceUsdRegular} USD`

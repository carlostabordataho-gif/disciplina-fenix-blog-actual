// Configuración central del funnel.
// ÚNICO archivo que se edita a mano durante el experimento de validación.
//
// CHECKLIST DE OPERADOR (lo único que tocas entre ventas):
//   1. Cada venta confirmada => sube cohortSpotsTaken en 1 y redeploy.
//   2. Cuando tengas link de pago automático (Hotmart/Bold/Wompi):
//      pega el link en checkoutUrl y cambia paymentMode a 'checkout'.
//   3. Para mover fechas: edita cohortStartDate / cohortCloseDate.

export const funnel = {
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

const checkoutIsReady =
  funnel.checkoutUrl.startsWith('http') &&
  !funnel.checkoutUrl.includes('REEMPLAZAR')

/** Construye un deep-link de WhatsApp con mensaje pre-escrito. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${funnel.whatsappNumber}?text=${encodeURIComponent(message)}`
}

/**
 * URL del botón de COMPRA.
 * - Si el pago automático está listo (paymentMode 'checkout' + link válido) => checkout.
 * - Si no => WhatsApp con un mensaje de intención de compra ya redactado.
 * @param context etiqueta corta de dónde salió el click (para saber qué CTA convierte).
 */
export function buyUrl(context = 'web'): string {
  if (funnel.paymentMode === 'checkout' && checkoutIsReady) {
    return funnel.checkoutUrl
  }
  const msg =
    `Hola Carlos, quiero mi plaza en la Cohorte Fénix (precio fundador $${funnel.priceUsd} USD / $${funnel.priceCop} COP). ` +
    `¿Cómo hago el pago para asegurar mi cupo? [${context}]`
  return whatsappUrl(msg)
}

/** ¿El botón de compra abre WhatsApp (true) o un checkout automático (false)? */
export const buyOpensWhatsApp = !(funnel.paymentMode === 'checkout' && checkoutIsReady)

/** Canal de contacto para dudas pre-compra. */
export const contactUrl = whatsappUrl(
  'Hola Carlos, tengo una duda sobre la Cohorte Fénix antes de decidir:'
)

export const cohortSpotsLeft = Math.max(
  0,
  funnel.cohortSpotsTotal - funnel.cohortSpotsTaken
)

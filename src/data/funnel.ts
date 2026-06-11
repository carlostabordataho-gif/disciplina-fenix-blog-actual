// Configuración central del funnel.
// ÚNICO archivo que se edita a mano durante el experimento de validación:
// cada venta => incrementar cohortSpotsTaken y redeploy.

export const funnel = {
  // Cohorte Fundadora
  cohortSpotsTotal: 10,
  cohortSpotsTaken: 0, // ACTUALIZAR A MANO con cada venta confirmada
  cohortStartDate: 'Fecha por anunciar', // ej: 'Lunes 7 de julio'
  priceUsd: 35,
  priceCop: '140.000',

  // REEMPLAZAR con el link real del checkout de Hotmart al crear el producto
  checkoutUrl: 'https://pay.hotmart.com/REEMPLAZAR_CON_TU_LINK',

  // Entregable del RESET: versión web imprimible (sirve como PDF vía "Guardar PDF")
  resetPdfUrl: '/reset-protocolo.html',

  tiktokUrl: 'https://www.tiktok.com/@carlostaho',

  // REEMPLAZAR con tu número real (formato wa.me). Vacío => los CTAs de
  // contacto usan TikTok como canal de dudas pre-compra.
  whatsappUrl: '',
}

/** Canal de contacto para dudas pre-compra: WhatsApp si está configurado, si no TikTok. */
export const contactUrl = funnel.whatsappUrl || funnel.tiktokUrl

export const cohortSpotsLeft = Math.max(
  0,
  funnel.cohortSpotsTotal - funnel.cohortSpotsTaken
)

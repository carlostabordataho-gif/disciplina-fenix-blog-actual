# DEPLOY GUIDE — DISCIPLINA FÉNIX

Guía operativa. Orden exacto de ejecución. Tiempo total estimado: 4-6 horas.
Todo lo que está aquí requiere TUS cuentas; el código ya está listo.

---

## 1. SUPABASE (captura de leads) — 30 min

1. Crea cuenta/proyecto en https://supabase.com (plan gratis). Región: `South America (São Paulo)`.
2. Ve a **SQL Editor** → pega y ejecuta el contenido completo de `supabase/leads.sql` (una sola vez).
3. Ve a **Project Settings → API** y copia:
   - `Project URL` → será `VITE_SUPABASE_URL`
   - `anon public key` → será `VITE_SUPABASE_ANON_KEY`
4. Verificación: tras el deploy (paso 6), registra tu propio email en /reset y confirma que aparece en **Table Editor → leads**.

> Los leads SOLO se leen desde el dashboard de Supabase. El sitio nunca puede leerlos (RLS ya configurado en el SQL).

## 2. HOTMART (checkout) — 1-2 h

1. Crea cuenta de productor en https://hotmart.com.
2. Crea producto: **"Cohorte Fénix — 21 días"**, tipo *Servicio/Mentoría* (o *Curso online* si exige formato), precio **COP 140.000**, pago único.
3. Métodos de pago: activa tarjeta + PSE + Nequi (Hotmart los habilita para Colombia automáticamente).
4. **Página de gracias** (Configuración del producto → Página de agradecimiento): pon una URL o texto con:
   - Link de invitación al grupo de WhatsApp "COHORTE FÉNIX 01" (créalo antes).
   - Link de Calendly/Cal.com para agendar la llamada 1:1 (cuenta gratis en https://cal.com).
   - Instrucción: "Te escribo personalmente en menos de 24h."
5. Copia el **link de checkout** (formato `https://pay.hotmart.com/XXXXXXXX`).
6. Pégalo en `src/data/funnel.ts` → campo `checkoutUrl`. Commit + push.
7. **Decide la fecha de inicio de la cohorte** y ponla en `funnel.ts` → `cohortStartDate` (ej: `'Lunes 6 de julio'`).
8. Haz una compra de prueba (Hotmart tiene modo sandbox) y verifica el flujo completo.

> Con cada venta: edita `cohortSpotsTaken` en `funnel.ts` (+1), commit, push. Vercel redeploya solo.

## 3. DOMINIO + DNS — 30 min (si aún no está)

1. El dominio `tabordasystem.com` debe estar comprado (Namecheap/Cloudflare/GoDaddy).
2. En Vercel → proyecto → **Settings → Domains** → añade `tabordasystem.com` y `www.tabordasystem.com`.
3. En tu registrador, crea los registros que Vercel te indique:
   - `A` @ → `76.76.21.21`
   - `CNAME` www → `cname.vercel-dns.com`
4. Espera propagación (minutos a horas). Vercel emite SSL automático.

## 4. VERCEL (deploy + variables) — 20 min

1. Conecta el repo de GitHub al proyecto de Vercel (si no está).
2. **Settings → Environment Variables** (entorno Production + Preview):
   - `VITE_SUPABASE_URL` = (paso 1)
   - `VITE_SUPABASE_ANON_KEY` = (paso 1)
3. Redeploy (las env vars de Vite solo aplican en build).
4. El `vercel.json` del repo ya maneja las rutas SPA: verifica abriendo `tabordasystem.com/reset` en incógnito — debe cargar, no 404.

## 5. MAILERLITE (secuencia de emails) — 2-3 h

1. Cuenta gratis en https://mailerlite.com (hasta 1.000 suscriptores).
2. **Dominio de envío**: Settings → Domains → añade `tabordasystem.com` → crea en tu DNS los registros SPF, DKIM y DMARC que te indique. **Sin esto, todo cae en spam. No envíes nada antes de verificar.**
3. Crea el grupo `reset-leads`.
4. Crea la automatización: trigger "se une al grupo reset-leads" → los 5 emails de `docs/SECUENCIA_EMAILS_RESET.md` con su cadencia (inmediato / día 2 / día 4 / día 6 / día 8).
5. Reemplaza en los emails:
   - `[LINK_PDF]` → `https://tabordasystem.com/reset-protocolo.html`
   - `[LINK_PROTOCOLO]` → `https://tabordasystem.com/protocolo`
   - `[FECHA_INICIO]` y `[FECHA_CIERRE]` → fechas reales.
6. **Proceso manual diario (10 min/noche)**: Supabase → Table Editor → leads → exporta CSV → impórtalo a MailerLite al grupo `reset-leads` (MailerLite ignora duplicados). Automatizar esto NO es prioridad hasta pasar de ~30 leads/día.
7. Envíate la secuencia a ti mismo primero y revisa que no caiga en spam (Gmail + Outlook).

## 6. ANALYTICS — 30 min

1. **Vercel Web Analytics**: dashboard de Vercel → pestaña Analytics → Enable. (Opcional añadir `@vercel/analytics` al código para eventos custom; con pageviews basta para empezar.)
2. Funnel mínimo que vas a vigilar cada noche:
   - Visitas a `/reset` (Vercel Analytics)
   - Filas nuevas en `leads` (Supabase)
   - Clics al checkout (TikTok Pixel, paso 7) y ventas (dashboard Hotmart)

## 7. TIKTOK PIXEL — 45 min

1. TikTok Ads Manager (https://ads.tiktok.com) → Assets → Events → Web Events → crea un Pixel (modo manual).
2. Copia el snippet base y pégalo en `index.html` dentro de `<head>` (antes de `</head>`).
3. Eventos a configurar (puede ser desde la UI de TikTok con "event builder" sin tocar código):
   - `ViewContent` en la URL `/reset`
   - `CompleteRegistration` al click del botón de submit del formulario
   - `ClickButton` al click de los botones que llevan a `pay.hotmart.com`
4. Esto habilita retargeting futuro aunque hoy no pagues ads. Instálalo ahora: la audiencia se acumula desde el día 1.

---

## CHECKLIST FINAL DE DESPLIEGUE

- [ ] `leads.sql` ejecutado en Supabase
- [ ] Env vars en Vercel + redeploy hecho
- [ ] `checkoutUrl` real de Hotmart en `funnel.ts`
- [ ] `cohortStartDate` con fecha real en `funnel.ts`
- [ ] (Opcional) `whatsappUrl` con tu número en `funnel.ts` (formato `https://wa.me/57XXXXXXXXXX`)
- [ ] Dominio apuntando a Vercel con SSL activo
- [ ] SPF/DKIM/DMARC verificados en MailerLite
- [ ] Automatización de 5 emails activa y probada contigo mismo
- [ ] Página de gracias de Hotmart con grupo WhatsApp + Calendly
- [ ] Grupo "COHORTE FÉNIX 01" creado con mensaje fijado (reglas + fecha)
- [ ] Vercel Analytics activado
- [ ] TikTok Pixel instalado con 3 eventos
- [ ] Link in bio de TikTok → `https://tabordasystem.com/reset`

## CHECKLIST DE VALIDACIÓN POST-DEPLOY (hazlo desde TU TELÉFONO, desde el navegador de TikTok)

- [ ] Abrir el link del bio → carga `/reset` sin 404 y en menos de 3 segundos
- [ ] Registrar un email de prueba → mensaje "Acceso concedido" (no el error de fallback)
- [ ] El email aparece en la tabla `leads` de Supabase
- [ ] Botón "ABRIR PROTOCOLO RESET" → abre el protocolo completo y el botón "Imprimir/Guardar PDF" funciona
- [ ] Email 1 de la secuencia llega a la bandeja (no spam) tras importar el CSV
- [ ] `/protocolo` → botón de compra abre el checkout real de Hotmart con precio COP 140.000
- [ ] Compra de prueba → página de gracias → link de WhatsApp funciona → Calendly agenda
- [ ] `/legal` carga y los links del footer/formulario apuntan bien
- [ ] Compartir `tabordasystem.com` por WhatsApp → el preview muestra la imagen og-cover
- [ ] Registrar email duplicado → sigue mostrando éxito (no error)
- [ ] Probar todo lo anterior también en datos móviles (no solo WiFi)

## MANTENIMIENTO DURANTE LA CAMPAÑA

- Cada venta confirmada: `cohortSpotsTaken +1` en `funnel.ts` → commit → push (el contador público es tu prueba de escasez; mantenlo honesto y al día).
- Cada noche: exportar leads → importar a MailerLite → revisar funnel (visitas/leads/clics/ventas).
- Cuando la cohorte se llene o cierre: pausar el Email 5 en MailerLite y reemplazarlo por variante de lista de espera (nota ya incluida en SECUENCIA_EMAILS_RESET.md).

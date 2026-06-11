import usePageMeta from '../lib/usePageMeta'

// Página legal: Ley 1581/2012 (habeas data Colombia), T&C, Garantía Fénix y
// disclaimer de no-tratamiento. Texto plano, sin adornos: aquí la claridad es el diseño.

const SECTION = 'font-mono text-lg md:text-xl font-bold text-neon-primary mb-4 uppercase tracking-wider'
const H3 = 'font-mono text-sm font-bold text-text-primary mt-6 mb-2'
const P = 'font-sans text-sm text-text-muted leading-relaxed mb-3'
const LI = 'font-sans text-sm text-text-muted leading-relaxed mb-1.5 pl-4 relative before:content-["·"] before:absolute before:left-0 before:text-neon-primary'

export default function Legal() {
  usePageMeta(
    'Legal — Disciplina Fénix',
    'Política de privacidad, términos y condiciones, Garantía Fénix y avisos legales de Disciplina Fénix.'
  )

  return (
    <div className="min-h-screen pt-24 pb-16 bg-bg-base">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-mono text-2xl md:text-3xl font-bold text-text-primary mb-2">
          Legal
        </h1>
        <p className="font-mono text-xs text-text-dim mb-12">
          Última actualización: junio de 2026 · Responsable: Carlos Taborda — Disciplina Fénix
        </p>

        {/* ── 1. AVISO IMPORTANTE ─────────────────────────────── */}
        <section id="disclaimer" className="mb-12 terminal-panel border border-accent-warn/30 p-6">
          <h2 className={SECTION}>1. Aviso importante: esto no es tratamiento médico</h2>
          <p className={P}>
            Disciplina Fénix (incluyendo el Protocolo RESET gratuito, la Cohorte Fénix y todo el
            contenido publicado en este sitio y en redes sociales) es un programa educativo de
            hábitos, disciplina y accountability. <strong className="text-text-primary">No es, ni
            sustituye, tratamiento médico, psicológico, psiquiátrico ni terapia de adicciones.</strong>
          </p>
          <p className={P}>
            Carlos Taborda no es médico, psicólogo ni profesional de la salud. Si tienes una
            adicción que compromete tu salud, ideación suicida, síndrome de abstinencia con
            síntomas físicos (alcohol, benzodiacepinas u otras sustancias cuya interrupción
            abrupta puede ser peligrosa) o cualquier condición de salud mental diagnosticada o
            sospechada, debes consultar a un profesional de la salud antes de iniciar cualquier
            programa de este tipo. En Colombia puedes comunicarte con la Línea 106 (atención
            psicosocial) o con tu EPS.
          </p>
          <p className={P}>
            Al usar este sitio y sus programas aceptas que los resultados dependen exclusivamente
            de tu ejecución y que ninguna parte del contenido constituye consejo médico,
            psicológico, financiero o legal.
          </p>
        </section>

        {/* ── 2. PRIVACIDAD ───────────────────────────────────── */}
        <section id="privacidad" className="mb-12">
          <h2 className={SECTION}>2. Política de tratamiento de datos personales</h2>
          <p className={P}>
            En cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 y demás
            normas concordantes de la República de Colombia, se informa la política de
            tratamiento de datos personales de Disciplina Fénix.
          </p>

          <h3 className={H3}>2.1 Responsable del tratamiento</h3>
          <p className={P}>
            Carlos Taborda — Disciplina Fénix. Contacto: a través de TikTok{' '}
            <a href="https://www.tiktok.com/@carlostaho" target="_blank" rel="noopener noreferrer" className="text-neon-primary hover:underline">@carlostaho</a>{' '}
            o respondiendo cualquier correo enviado desde disciplinafenix.com.
          </p>

          <h3 className={H3}>2.2 Datos que se recolectan</h3>
          <ul className="mb-3">
            <li className={LI}>Correo electrónico (formularios de registro al Protocolo RESET y newsletter).</li>
            <li className={LI}>Origen del registro (página desde la que te registraste).</li>
            <li className={LI}>Datos de pago: son procesados directamente por Hotmart; este sitio no recibe ni almacena números de tarjeta ni credenciales financieras.</li>
            <li className={LI}>Datos de participación en la Cohorte (check-ins, puntajes), tratados de forma confidencial dentro del grupo privado del programa.</li>
          </ul>

          <h3 className={H3}>2.3 Finalidad del tratamiento</h3>
          <ul className="mb-3">
            <li className={LI}>Enviarte el material gratuito que solicitaste (Protocolo RESET).</li>
            <li className={LI}>Enviarte la secuencia de correos educativos y comerciales de Disciplina Fénix.</li>
            <li className={LI}>Gestionar tu participación en los programas pagos.</li>
            <li className={LI}>Medir el funcionamiento del sitio de forma agregada y anónima.</li>
          </ul>

          <h3 className={H3}>2.4 Tus derechos (habeas data)</h3>
          <p className={P}>
            Como titular de los datos tienes derecho a: conocer, actualizar y rectificar tus
            datos; solicitar prueba de la autorización otorgada; ser informado sobre el uso que
            se les ha dado; revocar la autorización y/o solicitar la supresión de tus datos en
            cualquier momento; y presentar quejas ante la Superintendencia de Industria y
            Comercio (SIC) por infracciones al régimen de protección de datos.
          </p>
          <p className={P}>
            Para ejercer cualquiera de estos derechos basta con responder cualquiera de nuestros
            correos con tu solicitud, o usar el enlace de baja ("unsubscribe") incluido en cada
            correo. Las solicitudes se atienden en un plazo máximo de quince (15) días hábiles,
            conforme a la ley.
          </p>

          <h3 className={H3}>2.5 Conservación y seguridad</h3>
          <p className={P}>
            Los datos se almacenan en proveedores con estándares de seguridad de la industria
            (Supabase y la plataforma de email marketing) y se conservan mientras exista una
            relación con el titular o hasta que este solicite su supresión. No vendemos,
            alquilamos ni compartimos tu correo con terceros.
          </p>
        </section>

        {/* ── 3. TÉRMINOS Y CONDICIONES ───────────────────────── */}
        <section id="terminos" className="mb-12">
          <h2 className={SECTION}>3. Términos y condiciones de la Cohorte Fénix</h2>

          <h3 className={H3}>3.1 El servicio</h3>
          <p className={P}>
            La Cohorte Fénix es un programa grupal de 21 días de ejecución supervisada que
            incluye: protocolo diario, llamada individual de arranque (15 minutos), revisión de
            check-ins diarios, llamadas grupales dominicales y sistema de puntos. El programa se
            entrega a través de un grupo privado (WhatsApp o similar) y videollamadas.
          </p>

          <h3 className={H3}>3.2 Precio y pago</h3>
          <p className={P}>
            El precio vigente es el publicado en la página /protocolo al momento de la compra.
            El pago se procesa a través de Hotmart, que actúa como plataforma de pago y emite la
            factura correspondiente. El cupo queda confirmado únicamente con el pago acreditado.
          </p>

          <h3 className={H3}>3.3 Reglas del programa</h3>
          <p className={P}>
            Las reglas son parte esencial del servicio contratado y el participante las acepta
            al comprar:
          </p>
          <ul className="mb-3">
            <li className={LI}>El check-in diario nocturno es obligatorio.</li>
            <li className={LI}>Tres (3) check-ins perdidos sin aviso previo causan la expulsión del programa sin derecho a reembolso.</li>
            <li className={LI}>Reportar información falsa en un check-in causa la expulsión inmediata sin derecho a reembolso.</li>
            <li className={LI}>Una recaída en el hábito declarado no causa expulsión si se reporta; ocultarla, sí.</li>
            <li className={LI}>Comportamientos de irrespeto grave hacia otros participantes causan expulsión sin reembolso.</li>
          </ul>

          <h3 className={H3}>3.4 Derecho de retracto</h3>
          <p className={P}>
            Conforme al artículo 47 de la Ley 1480 de 2011 (Estatuto del Consumidor), puedes
            ejercer el derecho de retracto dentro de los cinco (5) días hábiles siguientes a la
            compra, siempre que la ejecución del programa no haya comenzado. El retracto se
            gestiona a través de Hotmart o escribiéndonos directamente, y da lugar a la
            devolución total del dinero.
          </p>

          <h3 className={H3}>3.5 Propiedad intelectual</h3>
          <p className={P}>
            Todo el material de Disciplina Fénix (protocolos, documentos, guiones de llamadas,
            sistema de puntos) es propiedad de Carlos Taborda. Se otorga al participante una
            licencia de uso personal e intransferible. Está prohibida su reventa, redistribución
            o publicación.
          </p>
        </section>

        {/* ── 4. GARANTÍA ─────────────────────────────────────── */}
        <section id="garantia" className="mb-12 terminal-panel border border-neon-primary/30 p-6">
          <h2 className={SECTION}>4. Garantía Fénix (formal)</h2>
          <p className={P}>
            Adicional al derecho de retracto legal, la Cohorte Fénix ofrece la siguiente
            garantía voluntaria de satisfacción:
          </p>
          <ul className="mb-3">
            <li className={LI}>
              <strong className="text-text-primary">Condición:</strong> completar los veintiún
              (21) check-ins diarios del programa, verificables en el registro del grupo.
            </li>
            <li className={LI}>
              <strong className="text-text-primary">Cobertura:</strong> si cumplida la condición
              el participante manifiesta, dentro de los 7 días siguientes al cierre de la
              cohorte, que el programa no le generó un cambio real, se le reembolsa el 100% del
              valor pagado.
            </li>
            <li className={LI}>
              <strong className="text-text-primary">Exclusión:</strong> el abandono del programa
              o la expulsión por incumplimiento de las reglas (sección 3.3) no dan derecho a
              reembolso, por tratarse de un servicio cuya prestación depende de la participación
              activa del usuario.
            </li>
            <li className={LI}>
              <strong className="text-text-primary">Plazo de devolución:</strong> máximo diez
              (10) días hábiles desde la aprobación, por el mismo medio de pago, a través de
              Hotmart.
            </li>
          </ul>
        </section>

        {/* ── 5. GENERALES ────────────────────────────────────── */}
        <section id="general" className="mb-12">
          <h2 className={SECTION}>5. Disposiciones generales</h2>
          <p className={P}>
            Este sitio se ofrece "tal cual". Los testimonios y resultados personales descritos
            (incluidos los del propio Carlos Taborda) son experiencias individuales y no
            constituyen promesa de resultados. Estas condiciones se rigen por las leyes de la
            República de Colombia. Cualquier modificación a esta página será publicada aquí con
            su fecha de actualización.
          </p>
        </section>

        <p className="font-mono text-xs text-text-dim">
          ¿Dudas sobre cualquiera de estos puntos? Escríbeme directo:{' '}
          <a href="https://www.tiktok.com/@carlostaho" target="_blank" rel="noopener noreferrer" className="text-neon-primary hover:underline">
            @carlostaho
          </a>
          . Prefiero un "no" informado que un comprador confundido.
        </p>
      </div>
    </div>
  )
}

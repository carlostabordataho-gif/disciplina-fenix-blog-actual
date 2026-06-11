import HeroSection from '../components/home/HeroSection'
import PainSection from '../components/home/PainSection'
import TransformationSection from '../components/home/TransformationSection'
import SystemStepsSection from '../components/home/SystemStepsSection'
import OfferBanner from '../components/home/OfferBanner'
import ContentHubSection from '../components/home/ContentHubSection'
import ResetCapture from '../components/funnel/ResetCapture'
import FaqSection from '../components/home/FaqSection'
import usePageMeta from '../lib/usePageMeta'

export default function Home() {
  usePageMeta(
    'Disciplina Fénix — Carlos Taborda | Sistema de Reconstrucción Personal',
    'No te falta motivación: te falta un sistema con consecuencias. Protocolo RESET gratis de 7 días y Cohorte Fénix de 21 días supervisados.'
  )

  return (
    <div className="bg-bg-base min-h-screen">
      {/* 1. GANCHO: headline de dolor + CTAs al funnel + dashboard demo */}
      <HeroSection />

      {/* 2. DOLOR: el visitante se ve descrito */}
      <PainSection />

      {/* 3. AUTORIDAD: historia y números verificables */}
      <TransformationSection />

      {/* 4. EL MAPA: RESET → Cohorte → Escuadrón */}
      <SystemStepsSection />

      {/* 5. OFERTA: cohorte fundadora con plazas reales */}
      <OfferBanner />

      {/* 6. PRUEBA: contenido y proceso documentado */}
      <ContentHubSection />

      {/* 7. CAPTURA: última oportunidad de conversión */}
      <ResetCapture source="home" />

      {/* 8. FAQ + CTA final */}
      <FaqSection />
    </div>
  )
}

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
    'TABORDA SYSTEM — El Sistema Operativo de Disciplina | Carlos Taborda',
    'Deja de consumir motivación: instala un sistema operativo de disciplina. Protocolo RESET gratis de 7 días e instalación supervisada de 21 días (Cohorte Fénix).'
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

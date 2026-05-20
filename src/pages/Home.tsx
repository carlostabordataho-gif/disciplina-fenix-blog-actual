import HeroSection from '../components/home/HeroSection'
import TransformationSection from '../components/home/TransformationSection' // Tu nueva sección de autoridad física
import ContentHubSection from '../components/home/ContentHubSection'

export default function Home() {
  return (
    <div className="bg-bg-base min-h-screen">
      {/* 1. EL GANCHO: Identidad agresiva y acceso a tu Zenith OS */}
      <HeroSection />
      
      {/* 2. LA AUTORIDAD: Tu historia, el "Antes y Después", y tu experiencia en Bodytech */}
      <TransformationSection />
      
      {/* 3. EL ADOCTRINAMIENTO: Tu contenido diario de TikTok @carlostaho */}
      <ContentHubSection />
    </div>
  )
}
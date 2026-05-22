import HeroSection from '../components/home/HeroSection'
import TransformationSection from '../components/home/TransformationSection' // Tu nueva sección de autoridad física
import ContentHubSection from '../components/home/ContentHubSection'
import FenixTerminal from '../components/home/FenixTerminal'
import SectionHeader from '../components/ui/SectionHeader'

export default function Home() {
  return (
    <div className="bg-bg-base min-h-screen">
      {/* 1. EL GANCHO: Identidad agresiva y acceso a tu Zenith OS */}
      <HeroSection />
      
      {/* 2. LA AUTORIDAD: Tu historia, el "Antes y Después", y tu experiencia en Bodytech */}
      <TransformationSection />
      
      {/* 3. EL ADOCTRINAMIENTO: Tu contenido diario de TikTok @carlostaho */}
      <ContentHubSection />

      {/* 4. LA INTERACTIVIDAD: Terminal Fénix OS interactiva */}
      <section className="py-24 bg-bg-panel border-t border-bg-border relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeader
            label="NÚCLEO ACTIVO"
            title={<>Consola interactiva <span className="text-neon-primary">Fénix OS.</span></>}
            subtitle="Accede al núcleo del sistema directamente. Prueba comandos reales como 'help', 'streak', 'vicios', 'mentor' o 'renacer'."
            align="center"
          />
          <div className="mt-8">
            <FenixTerminal />
          </div>
        </div>
      </section>
    </div>
  )
}
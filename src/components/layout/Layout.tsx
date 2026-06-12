import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFab from '../ui/WhatsAppFab'

export default function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Con ancla (/legal#garantia): scroll al elemento. Las páginas son
    // lazy, así que el id puede tardar en existir — reintentos por 5s
    // (la primera carga del chunk en frío puede ser lenta).
    if (hash) {
      const id = hash.slice(1)
      let attempts = 0
      let cancelled = false
      const tryScroll = () => {
        if (cancelled) return
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else if (attempts++ < 50) setTimeout(tryScroll, 100)
      }
      tryScroll()
      return () => {
        cancelled = true
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  )
}

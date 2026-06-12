import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Code splitting por ruta: cada página viaja en su propio chunk.
// El visitante de /reset (tráfico frío de TikTok) ya no descarga
// framer-motion ni las otras 9 páginas: solo React + router + su landing.
// Vite genera los chunks solo; los compartidos (framer-motion, Layout)
// se deduplican y se cargan únicamente cuando una ruta los necesita.
const Layout = lazy(() => import('./components/layout/Layout'))
const Home = lazy(() => import('./pages/Home'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Sistema = lazy(() => import('./pages/Sistema'))
const Community = lazy(() => import('./pages/Community'))
const Road2030 = lazy(() => import('./pages/Road2030'))
const Reset = lazy(() => import('./pages/Reset'))
const Protocolo = lazy(() => import('./pages/Protocolo'))
const Bienvenida = lazy(() => import('./pages/Bienvenida'))
const Legal = lazy(() => import('./pages/Legal'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Fallback mínimo en estética terminal mientras llega el chunk de la ruta.
function RouteLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base">
      <p className="font-mono text-xs text-text-dim animate-pulse">&gt; cargando sistema…</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="scanline-overlay" />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Landing de captura: fuera del Layout, sin navbar ni salidas */}
          <Route path="/reset" element={<Reset />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="protocolo" element={<Protocolo />} />
            <Route path="bienvenida" element={<Bienvenida />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="sistema" element={<Sistema />} />
            <Route path="comunidad" element={<Community />} />
            <Route path="road-to-2030" element={<Road2030 />} />
            <Route path="legal" element={<Legal />} />
            {/* 404 con captura: una URL mal escrita no es un lead perdido */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

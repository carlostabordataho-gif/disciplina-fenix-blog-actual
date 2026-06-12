import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Sistema from './pages/Sistema'
import Community from './pages/Community'
import Road2030 from './pages/Road2030'
import Reset from './pages/Reset'
import Protocolo from './pages/Protocolo'
import Bienvenida from './pages/Bienvenida'
import Legal from './pages/Legal'

export default function App() {
  return (
    <BrowserRouter>
      <div className="scanline-overlay" />
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

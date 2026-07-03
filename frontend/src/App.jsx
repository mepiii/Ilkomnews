import { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { FloatingChatWidget } from './components/chat/FloatingChatWidget'
import IntroScreen from './components/common/IntroScreen'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PerformanceMonitor from './components/common/PerformanceMonitor'
import ErrorBoundary from './components/common/ErrorBoundary'
import AdminRoutes from './routes/AdminRoutes'
import { Tiles } from './components/ui/Tiles'

const HomePage = lazy(() => import('./pages/HomePage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const IlkomGalleryPage = lazy(() => import('./pages/IlkomGalleryPage'))
const DetailPage = lazy(() => import('./pages/DetailPage'))
const ProjectDetailPage = lazy(() => import('./pages/ilkomgallery/ProjectDetailPage'))
const GameDetailPage = lazy(() => import('./pages/ilkomgallery/GameDetailPage'))
const MobileDetailPage = lazy(() => import('./pages/ilkomgallery/MobileDetailPage'))
const UiUxDetailPage = lazy(() => import('./pages/ilkomgallery/UiUxDetailPage'))
const WebDetailPage = lazy(() => import('./pages/ilkomgallery/WebDetailPage'))
const SubmitProjectPage = lazy(() => import('./pages/SubmitProjectPage'))
const TrackPage = lazy(() => import('./pages/TrackPage'))
const SavedItemsPage = lazy(() => import('./pages/KoleksiPage'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-theme-muted text-sm">Memuat...</p>
    </div>
  </div>
)

function AppContent() {
  const [showIntro, setShowIntro] = useState(true)
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col transition-colors duration-300">
      {showIntro && <IntroScreen />}
      <PerformanceMonitor />

      {/* Full-page Tiles background */}
      {!isAdminRoute && (
        <Tiles fixed rows={100} cols={16} />
      )}

      {!isAdminRoute && <Navbar />}
      <main className="relative z-0 flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<DetailPage type="news" />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<DetailPage type="events" />} />
            <Route path="/ilkomgallery" element={<IlkomGalleryPage />} />
            <Route path="/ilkomgallery/project/:slug" element={<ProjectDetailPage />} />
            <Route path="/ilkomgallery/game/:slug" element={<GameDetailPage />} />
            <Route path="/ilkomgallery/mobile/:slug" element={<MobileDetailPage />} />
            <Route path="/ilkomgallery/uiux/:slug" element={<UiUxDetailPage />} />
            <Route path="/ilkomgallery/web/:slug" element={<WebDetailPage />} />
            <Route path="/submit" element={<SubmitProjectPage />} />
            <Route path="/koleksi" element={<SavedItemsPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingChatWidget />}
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

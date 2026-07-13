import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import WolfyWidget from './components/chat/WolfyWidget'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import GlobalSearch from './components/shared/GlobalSearch'
import PerformanceMonitor from './components/common/PerformanceMonitor'
import ErrorBoundary from './components/common/ErrorBoundary'
import AdminRoutes from './routes/AdminRoutes'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { EngagementProvider } from './context/EngagementContext'
import { ToastProvider } from './components/ui/Toast'
import { Tiles } from './components/ui/Tiles'
import { ADMIN_BASE } from './config/admin'


const HomePage = lazy(() => import('./pages/HomePage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const IlkomGalleryPage = lazy(() => import('./pages/IlkomGalleryPage'))
const DetailPage = lazy(() => import('./pages/DetailPage'))
const ProjectDetailPage = lazy(() => import('./pages/ilkomgallery/ProjectDetailPage'))
const SubmitProjectPage = lazy(() => import('./pages/SubmitProjectPage'))
const TrackPage = lazy(() => import('./pages/TrackPage'))
const SavedItemsPage = lazy(() => import('./pages/KoleksiPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-10 h-10 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-theme-muted text-sm">Memuat...</p>
    </div>
  </div>
)

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/' + ADMIN_BASE)

  return (
    <div className="relative min-h-screen flex flex-col transition-colors duration-300">
      <PerformanceMonitor />

      {/* Tiles background - visible on all non-admin pages */}
      {!isAdminRoute && (
        <div className="fixed inset-0 z-0">
          <Tiles tileSize="md" />
        </div>
      )}

      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <GlobalSearch />}
      <main className={`relative z-0 flex-grow ${isAdminRoute ? '' : 'pt-20 pb-16'}`}>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:slug" element={<DetailPage type="news" />} />
              <Route path="/ilkomgallery" element={<IlkomGalleryPage />} />
              <Route path="/ilkomgallery/project/:slug" element={<ProjectDetailPage />} />
              <Route path="/submit" element={<SubmitProjectPage />} />
              <Route path="/koleksi" element={<SavedItemsPage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path={`/${ADMIN_BASE}/*`} element={<AdminRoutes />} />
              {/* Anyone guessing the literal /admin hits catch-all → redirect home */}
              <Route path="/admin" element={<Navigate to="/" replace />} />
              <Route path="/admin/*" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WolfyWidget />}
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AdminAuthProvider>
          <EngagementProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </EngagementProvider>
        </AdminAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

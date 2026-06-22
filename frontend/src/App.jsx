import { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AdminAuthProvider, ProtectedRoute } from './context/AdminAuthContext'
import AdminLayout from './components/admin/AdminLayout'
import { FloatingChatWidget } from './components/chat/FloatingChatWidget'
import IntroScreen from './components/common/IntroScreen'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PerformanceMonitor from './components/common/PerformanceMonitor'
import ErrorBoundary from './components/common/ErrorBoundary'

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

// Admin pages (lazy loaded)
const AdminLoginPage = lazy(() => import('./pages/admin/LoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const AdminNewsListPage = lazy(() => import('./pages/admin/NewsListPage'))
const AdminNewsFormPage = lazy(() => import('./pages/admin/NewsFormPage'))
const AdminProjectsListPage = lazy(() => import('./pages/admin/ProjectsListPage'))
const AdminProjectDetailPage = lazy(() => import('./pages/admin/ProjectDetailPage'))
const AdminSecurityCenterPage = lazy(() => import('./pages/admin/SecurityCenterPage'))
const AdminChatStatsPage = lazy(() => import('./pages/admin/ChatStatsPage'))
const AdminAuditLogsPage = lazy(() => import('./pages/admin/AuditLogsPage'))

const PageLoader = () => (
  <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-neutral-500 text-sm">Memuat...</p>
    </div>
  </div>
)

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AdminAuthProvider>
          {showIntro && <IntroScreen />}
          <div className="min-h-screen flex flex-col bg-white dark:bg-black transition-colors duration-300">
            <PerformanceMonitor />
            {!isAdminRoute && <Navbar />}
            <main className="flex-grow">
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
                  <Route path="/track" element={<TrackPage />} />
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="news" element={<AdminNewsListPage />} />
                    <Route path="news/create" element={<AdminNewsFormPage />} />
                    <Route path="news/:id/edit" element={<AdminNewsFormPage />} />
                    <Route path="projects" element={<AdminProjectsListPage />} />
                    <Route path="projects/:id" element={<AdminProjectDetailPage />} />
                    <Route path="security" element={<AdminSecurityCenterPage />} />
                    <Route path="chat-stats" element={<AdminChatStatsPage />} />
                    <Route path="audit-logs" element={<AdminAuditLogsPage />} />
                  </Route>
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
            </main>
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <FloatingChatWidget />}
          </div>
        </AdminAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

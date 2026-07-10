import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../context/AdminAuthContext'
import AdminLayout from '../components/admin/AdminLayout'

// Lazy load admin pages
const LoginPage = lazy(() => import('../pages/admin/LoginPage'))
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'))
const NewsListPage = lazy(() => import('../pages/admin/NewsListPage'))
const NewsFormPage = lazy(() => import('../pages/admin/NewsFormPage'))
const ProjectsListPage = lazy(() => import('../pages/admin/ProjectsListPage'))
const ProjectDetailPage = lazy(() => import('../pages/admin/ProjectDetailPage'))
const ChatbotApiPage = lazy(() => import('../pages/admin/ChatbotApiPage'))
const SecurityCenterPage = lazy(() => import('../pages/admin/SecurityCenterPage'))
const ChatStatsPage = lazy(() => import('../pages/admin/ChatStatsPage'))
const AuditLogsPage = lazy(() => import('../pages/admin/AuditLogsPage'))
const AdminManagementPage = lazy(() => import('../pages/admin/AdminManagementPage'))
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'))

const AdminLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="w-10 h-10 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
  </div>
)

export default function AdminRoutes() {
  return (
    <Suspense fallback={<AdminLoader />}>
      <Routes>
        {/* Public: /admin/login */}
        <Route path="login" element={<LoginPage />} />

        {/* Protected: /admin/* → AdminLayout with nested pages */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* /admin → redirect to /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="news" element={<NewsListPage />} />
          <Route path="news/create" element={<NewsFormPage />} />
          <Route path="news/:id/edit" element={<NewsFormPage />} />
          <Route path="projects" element={<ProjectsListPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="chatbot-api" element={<ChatbotApiPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admins" element={<AdminManagementPage />} />
          <Route path="security" element={<SecurityCenterPage />} />
          <Route path="chat-stats" element={<ChatStatsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

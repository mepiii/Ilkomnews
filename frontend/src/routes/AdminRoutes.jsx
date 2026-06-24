import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider, ProtectedRoute } from '../context/AdminAuthContext'
import AdminLayout from '../components/admin/AdminLayout'

// Lazy load admin pages
const LoginPage = lazy(() => import('../pages/admin/LoginPage'))
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'))
const NewsListPage = lazy(() => import('../pages/admin/NewsListPage'))
const NewsFormPage = lazy(() => import('../pages/admin/NewsFormPage'))
const ProjectsListPage = lazy(() => import('../pages/admin/ProjectsListPage'))
const ProjectDetailPage = lazy(() => import('../pages/admin/ProjectDetailPage'))
const ChatbotApiPage = lazy(() => import('../pages/admin/ChatbotApiPage'))
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'))
const SecurityCenterPage = lazy(() => import('../pages/admin/SecurityCenterPage'))
const ChatStatsPage = lazy(() => import('../pages/admin/ChatStatsPage'))
const AuditLogsPage = lazy(() => import('../pages/admin/AuditLogsPage'))

export default function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public admin routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected admin routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="news" element={<NewsListPage />} />
          <Route path="news/create" element={<NewsFormPage />} />
          <Route path="news/:id/edit" element={<NewsFormPage />} />
          <Route path="projects" element={<ProjectsListPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="chatbot-api" element={<ChatbotApiPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="security" element={<SecurityCenterPage />} />
          <Route path="chat-stats" element={<ChatStatsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  )
}

import { useState, useLayoutEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Newspaper,
  FolderOpen,
  LogOut,
  Menu,
  Shield,
  MessageSquare,
  FileText,
  X,
  Users,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import ThemeToggle from './ui/ThemeToggle'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/news', label: 'Berita', icon: Newspaper },
  { to: '/admin/projects', label: 'Ilkom Gallery', icon: FolderOpen },
  { to: '/admin/admins', label: 'Kelola Admin', icon: Users },
  { to: '/admin/chatbot-api', label: 'Chatbot API', icon: MessageSquare },
  { to: '/admin/security', label: 'Pusat Keamanan', icon: Shield },
  { to: '/admin/chat-stats', label: 'Statistik Chat', icon: MessageSquare },
  { to: '/admin/audit-logs', label: 'Log Audit', icon: FileText },
]

export default function AdminLayout() {
  const { user, logout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useLayoutEffect(() => { setSidebarOpen(false) }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-150 text-sm font-medium ${
      isActive
        ? 'bg-black text-white dark:bg-white dark:text-black'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100'
    }`

  return (
    <div className="admin-panel relative flex h-screen w-full bg-white dark:bg-[#0a0a0a] overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-full w-[260px] flex-col
          border-r border-gray-200 dark:border-[#262626] bg-white dark:bg-[#0a0a0a]
          transition-transform duration-200 ease-in-out
          lg:static lg:z-auto lg:h-screen lg:flex-shrink-0 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#1a1a1a]">
          <h1 className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            ILKOM <span className="text-gray-400 dark:text-gray-500 font-normal">Admin</span>
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-white/5 lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-5 py-3">
            <p className="flex items-center gap-1.5 truncate text-xs text-gray-400 dark:text-gray-500">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {user.email}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <item.icon size={16} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 dark:border-[#1a1a1a] p-3 space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Tema
            </span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
          >
            <LogOut size={16} className="shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 dark:border-[#262626] bg-white dark:bg-[#0a0a0a] px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/5"
              aria-label="Buka menu"
            >
              <Menu size={18} className="text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              ILKOM <span className="text-gray-400 dark:text-gray-500 font-normal">Admin</span>
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <main className="relative flex-1 overflow-y-auto h-full">
          <div className="mx-auto max-w-7xl p-4 lg:p-6 xl:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

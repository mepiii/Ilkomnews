import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Newspaper, FolderOpen, LogOut, Menu, Shield, MessageSquare, FileText } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ui/ThemeToggle'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/news', label: 'Berita', icon: Newspaper },
  { to: '/admin/projects', label: 'Ilkom Gallery', icon: FolderOpen },
  { to: '/admin/security', label: 'Pusat Keamanan', icon: Shield },
  { to: '/admin/chat-stats', label: 'Statistik Chat', icon: MessageSquare },
  { to: '/admin/audit-logs', label: 'Log Audit', icon: FileText },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
    isActive
      ? 'bg-[var(--bg-secondary)] text-[var(--accent)]'
      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
  }`

export default function AdminLayout() {
  const { user, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[var(--border-color)] flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
            ILKOM <span className="text-[var(--accent)]">Admin</span>
          </h1>
          {user && (
            <p className="text-xs text-[var(--text-secondary)] mt-1 truncate">{user.email}</p>
          )}
        </div>
        <ThemeToggle />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-medium text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-[250px] bg-[var(--bg-secondary)] fixed inset-y-0 left-0 z-30 border-r border-[var(--border-color)]">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-[250px] bg-[var(--bg-secondary)] z-50 lg:hidden border-r border-[var(--border-color)]"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 lg:ml-[250px] flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--bg-primary)] border-b border-[var(--border-color)] sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)]">
            <Menu size={20} className="text-[var(--text-primary)]" />
          </button>
          <h1 className="text-lg font-bold text-[var(--text-primary)]">
            ILKOM <span className="text-[var(--accent)]">Admin</span>
          </h1>
          <ThemeToggle />
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

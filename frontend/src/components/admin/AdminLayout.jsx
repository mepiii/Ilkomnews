import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Newspaper, FolderOpen, LogOut, Menu, X, Shield, MessageSquare, FileText } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/news', label: 'Berita', icon: Newspaper },
  { to: '/admin/projects', label: 'Ilkom Gallery', icon: FolderOpen },
  { to: '/admin/security', label: 'Security Center', icon: Shield },
  { to: '/admin/chat-stats', label: 'Chat Stats', icon: MessageSquare },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
    isActive
      ? 'bg-white/10 text-accent'
      : 'text-white/70 hover:bg-white/5 hover:text-white'
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
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-white tracking-tight">
          ILKOM <span className="text-accent">Admin</span>
        </h1>
        {user && (
          <p className="text-xs text-white/50 mt-1 truncate">{user.email}</p>
        )}
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
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-medium text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-[250px] bg-primary fixed inset-y-0 left-0 z-30">
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
              className="fixed inset-y-0 left-0 w-[250px] bg-primary z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 lg:ml-[250px] flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} className="text-primary" />
          </button>
          <h1 className="text-lg font-bold text-primary">
            ILKOM <span className="text-secondary">Admin</span>
          </h1>
          <div className="w-9" />
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

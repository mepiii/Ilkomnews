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
  Settings,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import ThemeToggle from './ui/ThemeToggle'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/news', label: 'Berita', icon: Newspaper },
  { to: '/admin/projects', label: 'Ilkom Gallery', icon: FolderOpen },
  { to: '/admin/chatbot-api', label: 'Chatbot API', icon: MessageSquare },
  { to: '/admin/settings', label: 'Pengaturan', icon: Settings },
  { to: '/admin/security', label: 'Pusat Keamanan', icon: Shield },
  { to: '/admin/chat-stats', label: 'Statistik Chat', icon: MessageSquare },
  { to: '/admin/audit-logs', label: 'Log Audit', icon: FileText },
]

/**
 * AdminLayout
 *
 * Strict flexbox shell. The sidebar and the main content area are siblings in
 * a single flex row; the sidebar is a fixed width on desktop and a
 * transform-off-canvas drawer on mobile. They can NEVER overlap because:
 *   - Desktop: sidebar is `flex-shrink-0 w-[260px]` (in-flow, not absolute).
 *   - Mobile: sidebar is `fixed` + overlay, and the main area still has its own
 *     full width with no competing in-flow sibling.
 *
 * Stacking: sidebar/overlay at z-40/z-50, header at z-30, content at z-0.
 * The Tiles grid is layered at z-0 inside the content wrapper, so every
 * button/link above it stays fully clickable.
 */
export default function AdminLayout() {
  const { user, logout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ponytail: useLayoutEffect avoids cascading render; sidebar must close before paint
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => { setSidebarOpen(false) }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 text-sm font-medium ${
      isActive
        ? 'bg-[var(--accent)] text-white shadow-md'
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
    }`

  return (
    <div className="relative flex min-h-screen w-full bg-[var(--bg-primary)]">
      {/* Mobile overlay — sits above content, below sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: off-canvas on mobile, in-flow column on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-full w-[260px] flex-col
          border-r border-[var(--border-color)] bg-[var(--bg-primary)]
          transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:h-screen lg:flex-shrink-0 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between p-5">
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight font-header">
            <span className="text-[var(--accent)]">ILKOM</span>
            <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
              Admin
            </span>
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-secondary)] lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Current user */}
        {user && (
          <div className="px-5 py-3">
            <p className="flex items-center gap-1.5 truncate text-xs text-[var(--text-secondary)]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              {user.email}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <item.icon size={18} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer controls */}
        <div className="space-y-2 border-t border-[var(--border-color)] p-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Tema
            </span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main column: holds header + scrollable content. flex-1 takes the rest. */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl bg-[var(--bg-secondary)] p-2 transition-colors hover:bg-[var(--border-color)]"
              aria-label="Buka menu"
            >
              <Menu size={20} className="text-[var(--text-primary)]" />
            </button>
            <h1 className="text-lg font-bold font-header text-[var(--text-primary)]">
              ILKOM <span className="text-[var(--accent)]">Admin</span>
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Scrollable content area */}
        <main className="relative flex-1 overflow-y-auto">
          <div className="mx-auto min-h-full max-w-7xl p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

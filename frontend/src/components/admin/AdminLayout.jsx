import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Newspaper, FolderOpen, LogOut, Menu, Shield, MessageSquare, FileText, X, Bot, Settings } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import ThemeToggle from './ui/ThemeToggle';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/news', label: 'Berita', icon: Newspaper },
  { to: '/admin/projects', label: 'Ilkom Gallery', icon: FolderOpen },
  { to: '/admin/chatbot-api', label: 'Chatbot API', icon: Bot },
  { to: '/admin/settings', label: 'Pengaturan', icon: Settings },
  { to: '/admin/security', label: 'Pusat Keamanan', icon: Shield },
  { to: '/admin/chat-stats', label: 'Statistik Chat', icon: MessageSquare },
  { to: '/admin/audit-logs', label: 'Log Audit', icon: FileText },
];

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 text-sm font-medium ${
      isActive
        ? 'bg-[var(--accent)] text-white shadow-md'
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
    }`;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] lg:grid lg:grid-cols-[280px_1fr]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-[280px] bg-[var(--bg-primary)] z-50 flex flex-col transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5">
          <h1 className="text-xl font-bold tracking-tight font-header flex items-center gap-2">
            <span className="text-[var(--accent)]">ILKOM</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]">Admin</span>
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors lg:hidden"
          >
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {user && (
          <div className="px-5 py-3">
            <p className="text-xs text-[var(--text-secondary)] truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
              {user.email}
            </p>
          </div>
        )}

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <item.icon size={18} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Tema</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-sm font-medium text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[var(--bg-primary)] lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors"
            >
              <Menu size={20} className="text-[var(--text-primary)]" />
            </button>
            <h1 className="text-lg font-bold text-[var(--text-primary)] font-header">
              ILKOM <span className="text-[var(--accent)]">Admin</span>
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

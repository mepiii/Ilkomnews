import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Newspaper,
  Eye,
  FolderOpen,
  Clock,
  ArrowRight,
  Plus,
  BarChart3,
  Settings,
  Image as ImageIcon,
  Activity,
} from 'lucide-react'
import { adminDashboard } from '../../services/adminApi'
import { formatDate as formatDateShort } from '../../utils/formatters'
import StatCard from '../../components/admin/ui/StatCard'

const SkeletonCard = () => (
  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-4 w-20 rounded bg-[var(--bg-secondary)]" />
        <div className="h-7 w-12 rounded bg-[var(--bg-secondary)]" />
      </div>
      <div className="h-12 w-12 rounded-xl bg-[var(--bg-secondary)]" />
    </div>
  </div>
)

const TableSkeleton = () => (
  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 animate-pulse">
    <div className="mb-4 h-5 w-40 rounded bg-[var(--bg-secondary)]" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-4 border-b border-[var(--border-color)] py-3 last:border-0">
        <div className="h-4 flex-1 rounded bg-[var(--bg-secondary)]" />
        <div className="h-4 w-16 rounded bg-[var(--bg-secondary)]" />
        <div className="h-4 w-20 rounded bg-[var(--bg-secondary)]" />
      </div>
    ))}
  </div>
)

const QuickAction = ({ icon: Icon, label, to, color }) => (
  <Link
    to={to}
    className="flex flex-col items-center gap-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 transition-colors hover:bg-[var(--bg-secondary)]"
  >
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
      <Icon size={18} className="text-white" />
    </div>
    <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
  </Link>
)

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    adminDashboard.getStats()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TableSkeleton />
          <TableSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/50 p-4 text-sm text-red-400">
        Gagal memuat dashboard: {error}
      </div>
    )
  }

  const stats = data?.stats || {}
  const recentNews = data?.recent_news || []
  const recentProjects = data?.recent_projects || []

  const recentActivity = [
    ...recentNews.slice(0, 3).map((item) => ({
      id: `news-${item.id}`,
      type: 'news',
      title: item.title,
      date: item.date,
      status: item.status,
    })),
    ...recentProjects.slice(0, 3).map((item) => ({
      id: `project-${item.id}`,
      type: 'project',
      title: item.title,
      date: item.date,
      status: item.status,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-secondary)]">
            {imgFailed ? (
              <span className="text-2xl">🐺</span>
            ) : (
              <img
                src="/assets/mascot-idle.png"
                alt="Wolfy"
                className="h-full w-full object-cover"
                onError={() => setImgFailed(true)}
              />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Selamat datang kembali di panel admin ILKOM NEWS</p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs text-[var(--text-muted)]">Hari ini</p>
            <p className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Newspaper} label="Total Berita" value={stats.total_news} color="bg-purple-500/10" iconColor="text-purple-500" />
        <StatCard icon={Eye} label="Tayang" value={stats.published_news} color="bg-emerald-500/10" iconColor="text-emerald-500" />
        <StatCard icon={FolderOpen} label="Total Proyek" value={stats.total_projects} color="bg-blue-500/10" iconColor="text-blue-500" />
        <StatCard icon={Clock} label="Menunggu Review" value={stats.pending_projects} color="bg-amber-500/10" iconColor="text-amber-500" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <QuickAction icon={Plus} label="Buat Berita" to="/admin/news/create" color="bg-purple-600" />
        <QuickAction icon={FolderOpen} label="Lihat Proyek" to="/admin/projects" color="bg-blue-600" />
        <QuickAction icon={ImageIcon} label="Galeri" to="/admin/projects" color="bg-emerald-600" />
        <QuickAction icon={BarChart3} label="Statistik" to="/admin/chat-stats" color="bg-amber-600" />
        <QuickAction icon={Newspaper} label="Semua Berita" to="/admin/news" color="bg-pink-600" />
        <QuickAction icon={Settings} label="Pengaturan" to="/admin/settings" color="bg-neutral-600" />
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] px-5 py-3.5">
          <Activity size={16} className="text-[var(--accent)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Aktivitas Terbaru</h2>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {recentActivity.length === 0 ? (
            <p className="p-5 text-center text-sm text-[var(--text-muted)]">Belum ada aktivitas</p>
          ) : (
            recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-[var(--bg-secondary)] transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                      item.type === 'news' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                    }`}>
                      {item.type === 'news' ? (
                        <Newspaper size={10} className="text-purple-500" />
                      ) : (
                        <FolderOpen size={10} className="text-blue-500" />
                      )}
                    </span>
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                  </div>
                  <p className="mt-0.5 pl-7 text-xs text-[var(--text-muted)]">{formatDateShort(item.date)}</p>
                </div>
                <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  item.status === 'published' || item.status === 'accepted'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : item.status === 'pending'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : item.status === 'rejected'
                        ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                }`}>
                  {item.status === 'published' ? 'Tayang' :
                   item.status === 'accepted' ? 'Diterima' :
                   item.status === 'pending' ? 'Menunggu' :
                   item.status === 'rejected' ? 'Ditolak' : 'Draft'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent News & Projects side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-3.5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Berita Terbaru</h2>
            <Link to="/admin/news" className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:opacity-80 transition-opacity">
              Lihat semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {recentNews.length === 0 ? (
              <p className="p-5 text-center text-sm text-[var(--text-muted)]">Belum ada berita</p>
            ) : (
              recentNews.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-[var(--bg-secondary)] transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">{formatDateShort(item.date)}</p>
                  </div>
                  <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.status === 'published'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                  }`}>
                    {item.status === 'published' ? 'Tayang' : 'Draft'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-3.5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Proyek Terbaru</h2>
            <Link to="/admin/projects" className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:opacity-80 transition-opacity">
              Lihat semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {recentProjects.length === 0 ? (
              <p className="p-5 text-center text-sm text-[var(--text-muted)]">Belum ada proyek</p>
            ) : (
              recentProjects.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-[var(--bg-secondary)] transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">{item.creator_name || item.creator}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    accepted: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    rejected: 'bg-red-500/15 text-red-600 dark:text-red-400',
  }

  const labels = {
    pending: 'Menunggu',
    accepted: 'Diterima',
    rejected: 'Ditolak',
  }

  return (
    <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
      {labels[status] || status}
    </span>
  )
}

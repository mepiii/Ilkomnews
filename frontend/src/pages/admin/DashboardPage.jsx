import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Newspaper,
  Eye,
  FolderOpen,
  Clock,
  Plus,
  BarChart3,
  Settings,
  Image as ImageIcon,
  Shield,
} from 'lucide-react'
import { adminDashboard } from '../../services/adminApi'
import StatusBadge from '../../components/admin/ui/StatusBadge'
import ErrorState from '../../components/admin/ui/ErrorState'
import logo from '../../assets/BEM.png'
import StatCard from '../../components/admin/ui/StatCard'

const SkeletonCard = () => (
  <div className="rounded-lg border border-gray-200 dark:border-[#262626] bg-gray-50 dark:bg-[#141414] p-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-3 w-16 rounded bg-gray-200 dark:bg-[#262626]" />
        <div className="h-6 w-10 rounded bg-gray-200 dark:bg-[#262626]" />
      </div>
      <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-[#262626]" />
    </div>
  </div>
)

const TableSkeleton = () => (
  <div className="rounded-lg border border-gray-200 dark:border-[#262626] bg-gray-50 dark:bg-[#141414] p-4 animate-pulse">
    <div className="mb-4 h-4 w-32 rounded bg-gray-200 dark:bg-[#262626]" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-4 border-b border-gray-100 dark:border-[#1a1a1a] py-3 last:border-0">
        <div className="h-3 flex-1 rounded bg-gray-200 dark:bg-[#262626]" />
        <div className="h-3 w-16 rounded bg-gray-200 dark:bg-[#262626]" />
      </div>
    ))}
  </div>
)

const QuickAction = ({ icon: Icon, label, to }) => (
  <Link
    to={to}
    className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-[#262626] bg-gray-50 dark:bg-[#141414] p-3 transition-colors hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
  >
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 dark:bg-white">
      <Icon size={16} className="text-white dark:text-gray-900" />
    </div>
    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 text-center">{label}</span>
  </Link>
)

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminDashboard.getStats()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TableSkeleton />
          <TableSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorState message={`Gagal memuat dashboard: ${error}`} onRetry={() => { setError(''); setLoading(true); adminDashboard.getStats().then(setData).catch((err) => setError(err.message)).finally(() => setLoading(false)) }} />
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
    <div className="space-y-4">
      {/* Welcome header */}
      <div className="rounded-lg border border-gray-200 dark:border-[#262626] bg-gray-50 dark:bg-[#141414] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-gray-200 dark:border-[#262626] bg-white dark:bg-[#0a0a0a] shrink-0">
            <img src={logo} alt="BEM ILKOM" className="h-full w-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Selamat datang kembali di panel admin ILKOM NEWS</p>
          </div>
          <div className="hidden text-right sm:block shrink-0">
            <p className="text-[10px] text-gray-400 dark:text-gray-500">Hari ini</p>
            <p className="mt-0.5 text-xs font-medium text-gray-900 dark:text-gray-100">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Newspaper} label="Total Berita" value={stats.total_news} color="bg-gray-100 dark:bg-white/5" iconColor="text-gray-700 dark:text-gray-300" />
        <StatCard icon={Eye} label="Tayang" value={stats.published_news} color="bg-gray-100 dark:bg-white/5" iconColor="text-gray-700 dark:text-gray-300" />
        <StatCard icon={FolderOpen} label="Total Proyek" value={stats.total_projects} color="bg-gray-100 dark:bg-white/5" iconColor="text-gray-700 dark:text-gray-300" />
        <StatCard icon={Clock} label="Menunggu Review" value={stats.pending_projects} color="bg-gray-100 dark:bg-white/5" iconColor="text-gray-700 dark:text-gray-300" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        <QuickAction icon={Plus} label="Buat Berita" to="/admin/news/create" />
        <QuickAction icon={FolderOpen} label="Lihat Proyek" to="/admin/projects" />
        <QuickAction icon={ImageIcon} label="Galeri" to="/admin/projects" />
        <QuickAction icon={BarChart3} label="Statistik" to="/admin/chat-stats" />
        <QuickAction icon={Shield} label="Keamanan" to="/admin/security" />
        <QuickAction icon={Settings} label="Pengaturan" to="/admin/settings" />
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-[#262626] bg-gray-50 dark:bg-[#141414] overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-[#262626]">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Aktivitas Terbaru</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
            {recentActivity.map((item) => (
              <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                <div className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                  {item.type === 'news' ? <Newspaper size={14} /> : <FolderOpen size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.title}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {item.date ? new Date(item.date).toLocaleDateString('id-ID') : '-'}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

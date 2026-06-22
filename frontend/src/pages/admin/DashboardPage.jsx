import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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

const StatCard = ({ icon: Icon, label, value, color, iconColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-neutral-700"
  >
    <div className={`absolute -top-6 -right-6 h-24 w-24 rounded-full ${color} opacity-20 blur-2xl`} />
    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-sm text-neutral-400">{label}</p>
        <p className="mt-1 text-3xl font-bold text-white">{value ?? '-'}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
  </motion.div>
)

const SkeletonCard = () => (
  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-4 w-20 rounded bg-neutral-800" />
        <div className="h-7 w-12 rounded bg-neutral-800" />
      </div>
      <div className="h-11 w-11 rounded-xl bg-neutral-800" />
    </div>
  </div>
)

const TableSkeleton = () => (
  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 animate-pulse">
    <div className="mb-4 h-5 w-40 rounded bg-neutral-800" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-4 border-b border-neutral-800/50 py-3 last:border-0">
        <div className="h-4 flex-1 rounded bg-neutral-800" />
        <div className="h-4 w-16 rounded bg-neutral-800" />
        <div className="h-4 w-20 rounded bg-neutral-800" />
      </div>
    ))}
  </div>
)

const QuickAction = ({ icon: Icon, label, to, color }) => (
  <Link
    to={to}
    className="group flex flex-col items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition-all hover:border-purple-500/50 hover:bg-neutral-800"
  >
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} transition-transform group-hover:scale-110`}>
      <Icon size={18} className="text-white" />
    </div>
    <span className="text-xs font-medium text-neutral-300 transition-colors group-hover:text-white">{label}</span>
  </Link>
)

const formatDate = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

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
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
          <img
            src="/assets/mascot-idle.png"
            alt="Wolfy"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.parentElement.innerHTML = '<span class="text-2xl">🐺</span>'
            }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-neutral-400">Selamat datang kembali di panel admin ILKOM NEWS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Newspaper}
          label="Total Berita"
          value={stats.total_news}
          color="bg-purple-500/20"
          iconColor="text-purple-400"
        />
        <StatCard
          icon={Eye}
          label="Published"
          value={stats.published_news}
          color="bg-emerald-500/20"
          iconColor="text-emerald-400"
        />
        <StatCard
          icon={FolderOpen}
          label="Total Proyek"
          value={stats.total_projects}
          color="bg-blue-500/20"
          iconColor="text-blue-400"
        />
        <StatCard
          icon={Clock}
          label="Pending Review"
          value={stats.pending_projects}
          color="bg-amber-500/20"
          iconColor="text-amber-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <QuickAction icon={Plus} label="Buat Berita" to="/admin/news/create" color="bg-purple-600" />
        <QuickAction icon={FolderOpen} label="Lihat Proyek" to="/admin/projects" color="bg-blue-600" />
        <QuickAction icon={ImageIcon} label="Galeri" to="/admin/gallery" color="bg-emerald-600" />
        <QuickAction icon={BarChart3} label="Statistik" to="/admin/stats" color="bg-amber-600" />
        <QuickAction icon={Newspaper} label="Semua Berita" to="/admin/news" color="bg-pink-600" />
        <QuickAction icon={Settings} label="Pengaturan" to="/admin/settings" color="bg-neutral-600" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-neutral-800 bg-neutral-900"
      >
        <div className="flex items-center gap-2 border-b border-neutral-800 px-5 py-4">
          <Activity size={16} className="text-purple-400" />
          <h2 className="font-semibold text-white">Aktivitas Terbaru</h2>
        </div>
        <div className="divide-y divide-neutral-800/50">
          {recentActivity.length === 0 ? (
            <p className="p-5 text-center text-sm text-neutral-500">Belum ada aktivitas</p>
          ) : (
            recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-neutral-800/30">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                      item.type === 'news' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                    }`}>
                      {item.type === 'news' ? (
                        <Newspaper size={12} className="text-purple-400" />
                      ) : (
                        <FolderOpen size={12} className="text-blue-400" />
                      )}
                    </span>
                    <p className="truncate text-sm font-medium text-neutral-200">{item.title}</p>
                  </div>
                  <p className="mt-0.5 pl-8 text-xs text-neutral-500">{formatDate(item.date)}</p>
                </div>
                <span className={`ml-3 rounded-full px-2 py-0.5 text-xs font-medium ${
                  item.status === 'published' || item.status === 'accepted'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : item.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-400'
                      : item.status === 'rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-neutral-700 text-neutral-400'
                }`}>
                  {item.status === 'published' ? 'Published' :
                   item.status === 'accepted' ? 'Diterima' :
                   item.status === 'pending' ? 'Pending' :
                   item.status === 'rejected' ? 'Ditolak' : 'Draft'}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
            <h2 className="font-semibold text-white">Berita Terbaru</h2>
            <Link to="/admin/news" className="flex items-center gap-1 text-sm text-purple-400 transition-colors hover:text-purple-300">
              Lihat semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-neutral-800/50">
            {recentNews.length === 0 ? (
              <p className="p-5 text-center text-sm text-neutral-500">Belum ada berita</p>
            ) : (
              recentNews.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-neutral-800/30">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-200">{item.title}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{formatDate(item.date)}</p>
                  </div>
                  <span className={`ml-3 rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-700 text-neutral-400'
                  }`}>
                    {item.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
            <h2 className="font-semibold text-white">Proyek Terbaru</h2>
            <Link to="/admin/projects" className="flex items-center gap-1 text-sm text-purple-400 transition-colors hover:text-purple-300">
              Lihat semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-neutral-800/50">
            {recentProjects.length === 0 ? (
              <p className="p-5 text-center text-sm text-neutral-500">Belum ada proyek</p>
            ) : (
              recentProjects.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-neutral-800/30">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-200">{item.title}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{item.creator_name || item.creator}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-500/20 text-amber-400',
    accepted: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
  }

  const labels = {
    pending: 'Pending',
    accepted: 'Diterima',
    rejected: 'Ditolak',
  }

  return (
    <span className={`ml-3 rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || 'bg-neutral-700 text-neutral-400'}`}>
      {labels[status] || status}
    </span>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FileText, Activity, Users, Clock } from 'lucide-react'
import { adminAudit } from '../../services/adminApi'

const StatCard = ({ icon: Icon, label, value, color, iconColor, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
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

const ACTION_OPTIONS = [
  { value: '', label: 'Semua Aksi' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
]

const ENTITY_OPTIONS = [
  { value: '', label: 'Semua Entity' },
  { value: 'news', label: 'News' },
  { value: 'project_submission', label: 'Project' },
  { value: 'user', label: 'User' },
]

const PAGE_SIZE = 20

const formatDate = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionFilter, setActionFilter] = useState('')
  const [entityFilter, setEntityFilter] = useState('')

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page }
      if (actionFilter) params.action = actionFilter
      if (entityFilter) params.entity_type = entityFilter
      const res = await adminAudit.getLogs(params)
      setLogs(res.data || [])
      setTotalPages(res.last_page || 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, actionFilter, entityFilter])

  useEffect(() => {
    adminAudit.getSummary().then(setSummary).catch(() => {})
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleActionChange = (value) => {
    setActionFilter(value)
    setPage(1)
  }

  const handleEntityChange = (value) => {
    setEntityFilter(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900">
          <FileText size={24} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
          <p className="text-sm text-neutral-400">Riwayat aktivitas sistem dan perubahan data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Activity}
          label="Total Log"
          value={summary?.total}
          color="bg-emerald-500/20"
          iconColor="text-emerald-400"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Hari Ini"
          value={summary?.today}
          color="bg-blue-500/20"
          iconColor="text-blue-400"
          delay={0.05}
        />
        <StatCard
          icon={Users}
          label="Minggu Ini"
          value={summary?.this_week}
          color="bg-purple-500/20"
          iconColor="text-purple-400"
          delay={0.1}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={actionFilter}
          onChange={(e) => handleActionChange(e.target.value)}
          className="px-4 py-2 border border-neutral-700 rounded-lg text-sm bg-neutral-900 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors"
        >
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={entityFilter}
          onChange={(e) => handleEntityChange(e.target.value)}
          className="px-4 py-2 border border-neutral-700 rounded-lg text-sm bg-neutral-900 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors"
        >
          {ENTITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/50 p-4 text-sm text-red-400">
          Gagal memuat audit log: {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-neutral-800 bg-neutral-900"
      >
        <div className="flex items-center gap-2 border-b border-neutral-800 px-5 py-4">
          <FileText size={16} className="text-emerald-400" />
          <h2 className="font-semibold text-white">Riwayat Aktivitas</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-neutral-500 text-sm">Memuat...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-neutral-600 mb-3" />
              <p className="text-neutral-500 text-sm">Tidak ada log ditemukan</p>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-left text-neutral-400">
                    <th className="px-5 py-3 font-medium">Aksi</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">User</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Entity</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">IP Address</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {logs.map((log) => (
                    <tr key={log.id} className="transition-colors hover:bg-neutral-800/30">
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            log.action === 'create'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : log.action === 'update'
                                ? 'bg-blue-500/20 text-blue-400'
                                : log.action === 'delete'
                                  ? 'bg-red-500/20 text-red-400'
                                  : log.action === 'login'
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'bg-neutral-700 text-neutral-400'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-neutral-200 hidden md:table-cell">
                        {log.user?.name || log.user?.email || '-'}
                      </td>
                      <td className="px-5 py-3 text-neutral-400 hidden md:table-cell">
                        {log.entity_type || '-'}
                      </td>
                      <td className="px-5 py-3 font-mono text-neutral-400 hidden lg:table-cell">
                        {log.ip_address || '-'}
                      </td>
                      <td className="px-5 py-3 text-neutral-400 hidden lg:table-cell">
                        {formatDate(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-800">
                  <p className="text-xs text-neutral-400">
                    Halaman {page} dari {totalPages}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page <= 1}
                      className="px-3 py-1 text-xs border border-neutral-700 rounded-md disabled:opacity-40 hover:bg-neutral-800 transition-colors text-neutral-300"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= totalPages}
                      className="px-3 py-1 text-xs border border-neutral-700 rounded-md disabled:opacity-40 hover:bg-neutral-800 transition-colors text-neutral-300"
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

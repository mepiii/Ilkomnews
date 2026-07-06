import { useState, useEffect, useCallback } from 'react'
import { FileText, Activity, Users, Clock } from 'lucide-react'
import { adminAudit } from '../../services/adminApi'
import { formatDateTime } from '../../utils/formatters'
import StatCard from '../../components/admin/ui/StatCard'

const ACTION_OPTIONS = [
  { value: '', label: 'Semua Aksi' },
  { value: 'create', label: 'Tambah' },
  { value: 'update', label: 'Ubah' },
  { value: 'delete', label: 'Hapus' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
]

const ACTION_LABELS = {
  create: 'Tambah',
  update: 'Ubah',
  delete: 'Hapus',
  login: 'Login',
  logout: 'Logout',
}

const ENTITY_LABELS = {
  news: 'Berita',
  project_submission: 'Proyek',
  user: 'Pengguna',
}

const ENTITY_OPTIONS = [
  { value: '', label: 'Semua Entitas' },
  { value: 'news', label: 'Berita' },
  { value: 'project_submission', label: 'Proyek' },
  { value: 'user', label: 'Pengguna' },
]

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          <FileText size={24} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Log Audit</h1>
          <p className="text-sm text-[var(--text-secondary)]">Riwayat aktivitas sistem dan perubahan data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Activity} label="Total Log" value={summary?.total} color="bg-emerald-500/20" iconColor="text-emerald-400" />
        <StatCard icon={Clock} label="Hari Ini" value={summary?.today} color="bg-blue-500/20" iconColor="text-blue-400" />
        <StatCard icon={Users} label="Minggu Ini" value={summary?.this_week} color="bg-purple-500/20" iconColor="text-purple-400" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={actionFilter}
          onChange={(e) => handleActionChange(e.target.value)}
          className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
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
          className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
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

      <div
        className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]"
      >
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] px-5 py-4">
          <FileText size={16} className="text-emerald-400" />
          <h2 className="font-semibold text-[var(--text-primary)]">Riwayat Aktivitas</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-[var(--text-muted)] text-sm">Memuat...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-[var(--text-muted)] mb-3" />
              <p className="text-[var(--text-muted)] text-sm">Tidak ada log ditemukan</p>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">
                    <th className="px-5 py-3 font-medium">Aksi</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Pengguna</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Entitas</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">IP Address</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {logs.map((log) => (
                    <tr key={log.id} className="transition-colors hover:bg-[var(--bg-secondary)]">
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
                                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[var(--text-primary)] hidden md:table-cell">
                        {log.user?.name || log.user?.email || '-'}
                      </td>
                      <td className="px-5 py-3 text-[var(--text-secondary)] hidden md:table-cell">
                        {ENTITY_LABELS[log.entity_type] || log.entity_type || '-'}
                      </td>
                      <td className="px-5 py-3 font-mono text-[var(--text-secondary)] hidden lg:table-cell">
                        {log.ip_address || '-'}
                      </td>
                      <td className="px-5 py-3 text-[var(--text-secondary)] hidden lg:table-cell">
                        {formatDateTime(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border-color)]">
                  <p className="text-xs text-[var(--text-secondary)]">
                    Halaman {page} dari {totalPages}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page <= 1}
                      className="px-3 py-1 text-xs border border-[var(--border-color)] rounded-md disabled:opacity-40 hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= totalPages}
                      className="px-3 py-1 text-xs border border-[var(--border-color)] rounded-md disabled:opacity-40 hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

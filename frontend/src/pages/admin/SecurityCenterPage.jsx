import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Lock, CheckCircle } from 'lucide-react'
import { adminSecurity } from '../../services/adminApi'
import { formatDateTime } from '../../utils/formatters'
import StatCard from '../../components/admin/ui/StatCard'
import SkeletonCard from '../../components/admin/ui/SkeletonCard'
import { springPreset, useReducedMotionSafe } from '../../lib/animations'

const ITEMS_PER_PAGE = 10

export default function SecurityCenterPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const reduce = useReducedMotionSafe()

  useEffect(() => {
    adminSecurity
      .getLoginAttempts()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-[#141414]">
            <Shield size={24} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pusat Keamanan</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monitoring aktivitas login dan keamanan sistem</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/50 p-4 text-sm text-red-400">
        Gagal memuat data keamanan: {error}
      </div>
    )
  }

  const recentAttempts = data?.recent || []
  const suspiciousIPs = data?.suspicious_ips || []
  const paginatedAttempts = recentAttempts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const totalAttemptPages = Math.ceil(recentAttempts.length / ITEMS_PER_PAGE)

  return (
    <motion.div
      className="space-y-6"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : springPreset}
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : springPreset}
        className="flex items-center gap-4"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-[#141414]">
          <Shield size={24} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pusat Keamanan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitoring aktivitas login dan keamanan sistem</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Shield} label="Total Percobaan" value={data?.total_attempts} color="bg-blue-500/10" iconColor="text-blue-500" />
        <StatCard icon={AlertTriangle} label="Gagal Login" value={data?.failed_attempts} color="bg-red-500/10" iconColor="text-red-500" />
        <StatCard icon={CheckCircle} label="Berhasil Login" value={data?.successful_attempts} color="bg-emerald-500/10" iconColor="text-emerald-500" />
        <StatCard icon={Lock} label="Lockout" value={data?.lockouts} color="bg-amber-500/10" iconColor="text-amber-500" />
      </div>

      {suspiciousIPs.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-[#141414]">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-neutral-800 px-5 py-4">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">IP Mencurigakan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-800 text-left text-gray-500 dark:text-gray-400">
                  <th className="px-5 py-3 font-medium">IP Address</th>
                  <th className="px-5 py-3 font-medium text-right">Gagal Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
                {suspiciousIPs.map((ip, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-gray-50 dark:bg-[#141414]">
                    <td className="px-5 py-3 font-mono text-gray-900 dark:text-gray-100">{ip.ip_address}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                        {ip.failed_count} gagal
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-[#141414]">
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-neutral-800 px-5 py-4">
          <Shield size={16} style={{ color: 'currentColor' }} />
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Aktivitas Login Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          {recentAttempts.length === 0 ? (
            <p className="p-5 text-center text-sm text-gray-500 dark:text-gray-400">Belum ada aktivitas login</p>
          ) : (
            <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-800 text-left text-gray-500 dark:text-gray-400">
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">IP Address</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Alasan</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
                {paginatedAttempts.map((attempt, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-gray-50 dark:bg-[#141414]">
                    <td className="px-5 py-3 text-gray-900 dark:text-gray-100">{attempt.email}</td>
                    <td className="px-5 py-3 font-mono text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {attempt.ip_address}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          attempt.success
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {attempt.success ? 'Berhasil' : 'Gagal'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {attempt.reason || '-'}
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {formatDateTime(attempt.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalAttemptPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-neutral-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Halaman {page} dari {totalAttemptPages}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 text-xs border border-gray-200 dark:border-neutral-800 rounded-md disabled:opacity-40 hover:bg-gray-50 dark:bg-[#141414] transition-colors text-gray-500 dark:text-gray-400"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalAttemptPages, p + 1))}
                    disabled={page >= totalAttemptPages}
                    className="px-3 py-1 text-xs border border-gray-200 dark:border-neutral-800 rounded-md disabled:opacity-40 hover:bg-gray-50 dark:bg-[#141414] transition-colors text-gray-500 dark:text-gray-400"
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
    </motion.div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, CheckCircle, XCircle, Clock, Zap, AlertCircle } from 'lucide-react'
import { adminChatStats } from '../../services/adminApi'
import StatCard from '../../components/admin/ui/StatCard'
import SkeletonCard from '../../components/admin/ui/SkeletonCard'
import { springPreset, useReducedMotionSafe } from '../../lib/animations'

export default function ChatStatsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const reduce = useReducedMotionSafe()

  useEffect(() => {
    adminChatStats
      .getStats()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
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
          <MessageSquare size={24} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Statistik Chat</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Statistik penggunaar chatbot Wolfy</p>
        </div>
      </motion.div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
      </div>
    </motion.div>
  )
}

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/50 p-4 text-sm text-red-400">
        Gagal memuat statistik chat: {error}
      </div>
    )
  }

  const dailyBreakdown = data?.daily_breakdown || []
  const topIPs = data?.top_ips || []
  const maxDaily = Math.max(...dailyBreakdown.map((d) => d.total || 0), 1)

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
          <MessageSquare size={24} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Statistik Chat</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Statistik penggunaan chatbot Wolfy</p>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : springPreset}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <StatCard icon={MessageSquare} label="Total Query" value={data?.total_queries} color="bg-blue-500/10" iconColor="text-blue-500" />
        <StatCard icon={CheckCircle} label="Berhasil" value={data?.successful} color="bg-emerald-500/10" iconColor="text-emerald-500" />
        <StatCard icon={XCircle} label="Ditolak (Topik)" value={data?.rejected} color="bg-red-500/10" iconColor="text-red-500" />
        <StatCard icon={AlertCircle} label="Tanpa Konteks" value={data?.no_context} color="bg-amber-500/10" iconColor="text-amber-500" />
        <StatCard icon={Zap} label="Dibatasi Rate Limit" value={data?.rate_limited} color="bg-gray-900 dark:bg-white/10" iconColor="text-white dark:text-gray-100" />
        <StatCard icon={Clock} label="Hari Ini" value={data?.today} color="bg-pink-500/10" iconColor="text-pink-500" />
      </motion.div>

      {dailyBreakdown.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-[#141414]">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-neutral-800 px-5 py-4">
            <MessageSquare size={16} className="text-blue-400" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Aktivitas Harian</h2>
          </div>
          <div className="p-5 space-y-3">
            {dailyBreakdown.map((day) => {
              const total = day.total || 0
              const success = day.success || 0
              const rejected = day.rejected || 0
              const widthPct = (total / maxDaily) * 100
              const successPct = total > 0 ? (success / total) * 100 : 0
              const rejectedPct = total > 0 ? (rejected / total) * 100 : 0

              return (
                <div key={day.date} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 w-24">
                      {new Date(day.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{total}</span>
                  </div>
                  <div className="h-6 w-full rounded-md bg-gray-50 dark:bg-[#141414] overflow-hidden">
                    <div
                      className="h-full flex rounded-md overflow-hidden"
                      style={{ width: `${widthPct}%` }}
                    >
                      <div
                        className="h-full bg-emerald-500/70"
                        style={{ width: `${successPct}%` }}
                      />
                      <div
                        className="h-full bg-red-500/70"
                        style={{ width: `${rejectedPct}%` }}
                      />
                      <div className="h-full flex-1 bg-blue-500/70" />
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="flex items-center gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-emerald-500/70" />
                <span>Berhasil</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-red-500/70" />
                <span>Ditolak</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-blue-500/70" />
                <span>Lainnya</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {topIPs.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-[#141414]">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-neutral-800 px-5 py-4">
            <Zap size={16} style={{ color: 'currentColor' }} />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">IP Address Teratas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-800 text-left text-gray-500 dark:text-gray-400">
                  <th className="px-5 py-3 font-medium">IP Address</th>
                  <th className="px-5 py-3 font-medium text-right">Total Query</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
                {topIPs.map((ip, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-gray-50 dark:bg-[#141414]">
                    <td className="px-5 py-3 font-mono text-gray-900 dark:text-gray-100">{ip.ip_address}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                        {ip.count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}

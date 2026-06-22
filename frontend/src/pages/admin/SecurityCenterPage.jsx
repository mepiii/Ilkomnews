import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Lock, CheckCircle } from 'lucide-react'
import { adminSecurity } from '../../services/adminApi'

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

export default function SecurityCenterPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900">
            <Shield size={24} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Security Center</h1>
            <p className="text-sm text-neutral-400">Monitoring aktivitas login dan keamanan sistem</p>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900">
          <Shield size={24} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Security Center</h1>
          <p className="text-sm text-neutral-400">Monitoring aktivitas login dan keamanan sistem</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Shield}
          label="Total Percobaan"
          value={data?.total_attempts}
          color="bg-blue-500/20"
          iconColor="text-blue-400"
          delay={0}
        />
        <StatCard
          icon={AlertTriangle}
          label="Gagal Login"
          value={data?.failed_attempts}
          color="bg-red-500/20"
          iconColor="text-red-400"
          delay={0.05}
        />
        <StatCard
          icon={CheckCircle}
          label="Berhasil Login"
          value={data?.successful_attempts}
          color="bg-emerald-500/20"
          iconColor="text-emerald-400"
          delay={0.1}
        />
        <StatCard
          icon={Lock}
          label="Lockout"
          value={data?.lockouts}
          color="bg-amber-500/20"
          iconColor="text-amber-400"
          delay={0.15}
        />
      </div>

      {suspiciousIPs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900"
        >
          <div className="flex items-center gap-2 border-b border-neutral-800 px-5 py-4">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="font-semibold text-white">IP Mencurigakan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-left text-neutral-400">
                  <th className="px-5 py-3 font-medium">IP Address</th>
                  <th className="px-5 py-3 font-medium text-right">Gagal Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {suspiciousIPs.map((ip, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-neutral-800/30">
                    <td className="px-5 py-3 font-mono text-neutral-200">{ip.ip_address}</td>
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
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-xl border border-neutral-800 bg-neutral-900"
      >
        <div className="flex items-center gap-2 border-b border-neutral-800 px-5 py-4">
          <Shield size={16} className="text-purple-400" />
          <h2 className="font-semibold text-white">Aktivitas Login Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          {recentAttempts.length === 0 ? (
            <p className="p-5 text-center text-sm text-neutral-500">Belum ada aktivitas login</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-left text-neutral-400">
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">IP Address</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Alasan</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {recentAttempts.map((attempt, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-neutral-800/30">
                    <td className="px-5 py-3 text-neutral-200">{attempt.email}</td>
                    <td className="px-5 py-3 font-mono text-neutral-400 hidden md:table-cell">
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
                    <td className="px-5 py-3 text-neutral-400 hidden md:table-cell">
                      {attempt.reason || '-'}
                    </td>
                    <td className="px-5 py-3 text-neutral-400 hidden lg:table-cell">
                      {formatDate(attempt.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  )
}

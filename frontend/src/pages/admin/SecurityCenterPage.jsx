import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, Lock, CheckCircle } from 'lucide-react'
import { adminSecurity } from '../../services/adminApi'
import { formatDateTime } from '../../utils/formatters'
import StatCard from '../../components/admin/ui/StatCard'
import SkeletonCard from '../../components/admin/ui/SkeletonCard'

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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
            <Shield size={24} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pusat Keamanan</h1>
            <p className="text-sm text-[var(--text-secondary)]">Monitoring aktivitas login dan keamanan sistem</p>
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
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          <Shield size={24} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pusat Keamanan</h1>
          <p className="text-sm text-[var(--text-secondary)]">Monitoring aktivitas login dan keamanan sistem</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Shield} label="Total Percobaan" value={data?.total_attempts} color="bg-blue-500/10" iconColor="text-blue-500" />
        <StatCard icon={AlertTriangle} label="Gagal Login" value={data?.failed_attempts} color="bg-red-500/10" iconColor="text-red-500" />
        <StatCard icon={CheckCircle} label="Berhasil Login" value={data?.successful_attempts} color="bg-emerald-500/10" iconColor="text-emerald-500" />
        <StatCard icon={Lock} label="Lockout" value={data?.lockouts} color="bg-amber-500/10" iconColor="text-amber-500" />
      </div>

      {suspiciousIPs.length > 0 && (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] px-5 py-4">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="font-semibold text-[var(--text-primary)]">IP Mencurigakan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">
                  <th className="px-5 py-3 font-medium">IP Address</th>
                  <th className="px-5 py-3 font-medium text-right">Gagal Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {suspiciousIPs.map((ip, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-[var(--bg-secondary)]">
                    <td className="px-5 py-3 font-mono text-[var(--text-primary)]">{ip.ip_address}</td>
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

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] px-5 py-4">
          <Shield size={16} style={{ color: 'var(--accent)' }} />
          <h2 className="font-semibold text-[var(--text-primary)]">Aktivitas Login Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          {recentAttempts.length === 0 ? (
            <p className="p-5 text-center text-sm text-[var(--text-muted)]">Belum ada aktivitas login</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">IP Address</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Alasan</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {recentAttempts.map((attempt, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-[var(--bg-secondary)]">
                    <td className="px-5 py-3 text-[var(--text-primary)]">{attempt.email}</td>
                    <td className="px-5 py-3 font-mono text-[var(--text-secondary)] hidden md:table-cell">
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
                    <td className="px-5 py-3 text-[var(--text-secondary)] hidden md:table-cell">
                      {attempt.reason || '-'}
                    </td>
                    <td className="px-5 py-3 text-[var(--text-secondary)] hidden lg:table-cell">
                      {formatDateTime(attempt.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

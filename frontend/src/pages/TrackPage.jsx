import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Clock, CheckCircle, XCircle, AlertCircle, Bell, BellRing, Users } from 'lucide-react'
import { GlowCard } from '../components/ui/GlowCard'
import Breadcrumb from '../components/common/Breadcrumb'
import { PageHeader } from '../components/ui/PageHeader'
import { PageBackground } from '../components/ui/PageBackground'

import { API_BASE } from '../services/api'

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Menunggu Peninjauan' },
  accepted: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Diterima' },
  rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Ditolak' },
}

const TrackPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '')
  const [result, setResult] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const track = useCallback(async (id) => {
    if (!id.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      const res = await fetch(`${API_BASE}/submissions/track/${id.trim()}`, {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (!res.ok) throw new Error('Submission not found')
      setResult(await res.json())
      setSearchParams({ id: id.trim() })
      // Persist the tracked ID so the navbar notification bell can surface its notifications
      try {
        const ids = JSON.parse(localStorage.getItem('tracking_ids') || '[]')
        if (!ids.includes(id.trim())) {
          ids.push(id.trim())
          localStorage.setItem('tracking_ids', JSON.stringify(ids))
        }
      } catch { /* ignore storage errors */ }
      window.dispatchEvent(new Event('notifications:refresh'))
      // Fetch notifications for this tracking ID
      fetch(`${API_BASE}/notifications/${id.trim()}`)
        .then(r => r.json())
        .then(data => setNotifications(data.data || []))
        .catch(() => setNotifications([]))
    } catch (err) {
      if (err.name === 'AbortError') setError('Request timeout')
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [setSearchParams])

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) { setTrackingId(id); track(id) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => { e.preventDefault(); track(trackingId) }

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-lg mx-auto">
            <div className="mb-8">
              <Breadcrumb />
              <PageHeader
                badge={
                  <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary">
                    <div className="bg-card border border-theme rounded-2xl px-3 py-1">
                      <span className="text-xs font-semibold uppercase tracking-wider">Proyek Mahasiswa</span>
                    </div>
                    <p className="pr-3 text-xs text-theme-muted">Track</p>
                  </div>
                }
                title={'LACAK\nPENGAJUAN'}
                subtitle="Masukkan ID pelacakan untuk memeriksa status pengajuan"
              />
            </div>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" value={trackingId} onChange={e => setTrackingId(e.target.value)}
                  placeholder="Masukkan ID pelacakan untuk memeriksa status pengajuan"
                  className="flex-1 px-4 py-3 bg-theme-secondary border border-theme rounded-xl text-theme-primary font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors" />
                <button type="submit" disabled={loading || !trackingId.trim()}
                  className="w-full sm:w-auto px-6 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-semibold text-sm">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Search size={18} /> Lacak</>}
                </button>
              </div>
            </form>

            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <GlowCard glowColor="red" className="rounded-3xl p-8 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-4">
                    <AlertCircle size={40} className="text-red-500" />
                  </div>
                  <p className="text-lg font-bold text-theme-primary font-header">Pengajuan Tidak Ditemukan</p>
                  <p className="text-theme-muted text-sm mt-1">Tidak ada pengajuan dengan ID pelacakan ini</p>
                </GlowCard>
              </motion.div>
            )}

            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <GlowCard glowColor={result.status === 'accepted' ? 'green' : result.status === 'rejected' ? 'red' : 'blue'} className="rounded-3xl p-6">
                  {(() => {
                    const cfg = STATUS_CONFIG[result.status]
                    if (!cfg) return null
                    const Icon = cfg.icon
                    return (
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${cfg.bg} ${cfg.border} border mb-5`}>
                        <Icon size={18} className={cfg.color} />
                        <span className={`font-bold text-sm ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    )
                  })()}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold">ID PELACAKAN</p>
                      <p className="font-mono text-xl text-[var(--accent)] font-bold mt-1">{result.tracking_id}</p>
                    </div>
                    <div className="h-px bg-theme" />
                    <div>
                      <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold">JUDUL PROYEK</p>
                      <p className="text-theme-primary font-semibold mt-1">{result.title}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold">KATEGORI</p>
                        <p className="text-theme-primary capitalize mt-1">{result.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold">DIKIRIM</p>
                        <p className="text-theme-primary mt-1">{new Date(result.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    {result.reviewed_at && (
                      <div>
                        <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold">Ditinjau</p>
                        <p className="text-theme-primary mt-1">{new Date(result.reviewed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    )}
                    {result.status === 'rejected' && result.rejection_reason && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                        <p className="text-xs text-red-500 font-bold uppercase tracking-wider mb-1">Alasan Penolakan</p>
                        <p className="text-theme-primary text-sm">{result.rejection_reason}</p>
                      </div>
                    )}
                    {result.status === 'accepted' && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">Proyek Anda telah diterima dan akan segera muncul di galeri!</p>
                      </div>
                    )}
                    {result.collaborators && result.collaborators.length > 0 && (
                      <div>
                        <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-2"><Users size={12} /> Kolaborator</p>
                        <div className="flex flex-wrap gap-2">
                          {result.collaborators.map((c, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-theme-secondary border border-theme rounded-full text-xs font-medium text-theme-primary">
                              {typeof c === 'object' && c.avatar && <img src={c.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />}
                              {typeof c === 'string' ? c : `${c.name}${c.nim ? ' (' + c.nim + ')' : ''}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {/* Notifications */}
            {result && notifications.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <BellRing size={16} style={{ color: 'var(--accent)' }} />
                  <p className="text-sm font-semibold text-theme-primary">Notifikasi</p>
                </div>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`rounded-2xl p-4 border ${
                      notif.type === 'accepted' ? 'bg-green-500/5 border-green-500/20' :
                      notif.type === 'rejected' ? 'bg-red-500/5 border-red-500/20' :
                      notif.type === 'submitted' ? 'bg-emerald-500/5 border-emerald-500/20' :
                      'bg-blue-500/5 border-blue-500/20'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${
                          notif.type === 'accepted' ? 'text-green-500' :
                          notif.type === 'rejected' ? 'text-red-500' :
                          notif.type === 'submitted' ? 'text-emerald-500' :
                          'text-blue-500'
                        }`}>
                          {notif.type === 'accepted' ? <CheckCircle size={18} /> :
                           notif.type === 'rejected' ? <XCircle size={18} /> :
                           notif.type === 'submitted' ? <CheckCircle size={18} /> :
                           <Bell size={18} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-theme-primary">{notif.title}</p>
                          <p className="text-xs text-theme-muted mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-theme-muted mt-1">
                            {new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="mt-8 text-center">
              <Link
                to="/submit"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold text-white bg-[var(--accent)] hover:brightness-110 transition-all duration-300"
              >
                Ajukan Proyek Baru
              </Link>
            </div>
          </div>
        </div>
    </PageBackground>
  )
}

export default TrackPage

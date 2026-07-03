import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { GlowCard } from '../components/ui/GlowCard'
import Breadcrumb from '../components/common/Breadcrumb'
import { PageHeader } from '../components/ui/PageHeader'
import { Tiles } from '../components/ui/Tiles'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Pending Review' },
  accepted: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Accepted' },
  rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Rejected' },
}

const TrackPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '')
  const [result, setResult] = useState(null)
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
  }, [])

  const handleSubmit = (e) => { e.preventDefault(); track(trackingId) }

  return (
    <div className="min-h-screen bg-transparent relative z-0 pt-24 pb-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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
              title="Track Submission"
              subtitle="Enter your tracking ID to check submission status"
            />
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={trackingId} onChange={e => setTrackingId(e.target.value)}
                placeholder="Enter tracking ID (e.g. ABC12345)"
                className="flex-1 px-4 py-3 bg-theme-secondary border border-theme rounded-xl text-theme-primary font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors" />
              <button type="submit" disabled={loading || !trackingId.trim()}
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-semibold text-sm">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Search size={18} /> Track</>}
              </button>
            </div>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <GlowCard glowColor="red" className="rounded-3xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-4">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <p className="text-lg font-bold text-theme-primary font-header">Submission Not Found</p>
                <p className="text-theme-muted text-sm mt-1">No submission found with this tracking ID</p>
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
                    <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold">Tracking ID</p>
                    <p className="font-mono text-xl text-purple-600 dark:text-purple-400 font-bold mt-1">{result.tracking_id}</p>
                  </div>
                  <div className="h-px bg-theme" />
                  <div>
                    <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold">Project Title</p>
                    <p className="text-theme-primary font-semibold mt-1">{result.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold">Category</p>
                      <p className="text-theme-primary capitalize mt-1">{result.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold">Submitted</p>
                      <p className="text-theme-primary mt-1">{new Date(result.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  {result.reviewed_at && (
                    <div>
                      <p className="text-xs text-theme-muted uppercase tracking-wider font-semibold">Reviewed</p>
                      <p className="text-theme-primary mt-1">{new Date(result.reviewed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  )}
                  {result.status === 'rejected' && result.rejection_reason && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                      <p className="text-xs text-red-500 font-bold uppercase tracking-wider mb-1">Rejection Reason</p>
                      <p className="text-theme-primary text-sm">{result.rejection_reason}</p>
                    </div>
                  )}
                  {result.status === 'accepted' && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                      <p className="text-green-600 dark:text-green-400 text-sm font-medium">Your project has been accepted and will appear in the gallery soon!</p>
                    </div>
                  )}
                </div>
              </GlowCard>
            </motion.div>
          )}

          <div className="mt-8 text-center">
            <Link to="/submit" className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium">Submit a new project</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackPage

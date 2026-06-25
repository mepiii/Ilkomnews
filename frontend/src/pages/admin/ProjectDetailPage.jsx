import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, X, ExternalLink, GitFork, User, Tag, Calendar, FolderOpen } from 'lucide-react'
import { adminProjects } from '../../services/adminApi'

const STATUS_STYLES = {
  pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  accepted: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  rejected: 'bg-red-500/15 text-red-600 dark:text-red-400',
}

const STATUS_LABELS = {
  pending: 'Menunggu',
  accepted: 'Diterima',
  rejected: 'Ditolak',
}

function RejectModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    setSubmitting(true)
    await onConfirm(reason)
    setSubmitting(false)
    setReason('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="bg-[var(--bg-card)] rounded-xl shadow-xl border border-[var(--border-color)] w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Tolak Proyek</h3>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Alasan Penolakan</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
                placeholder="Masukkan alasan penolakan..."
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-[var(--text-secondary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Menolak...' : 'Tolak Proyek'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rejectModal, setRejectModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    adminProjects.getById(id)
      .then((data) => setProject(data.project || data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleAccept = async () => {
    setActionLoading(true)
    try {
      await adminProjects.accept(id)
      setProject((prev) => ({ ...prev, status: 'accepted' }))
    } catch (err) {
      alert('Gagal: ' + err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (reason) => {
    try {
      await adminProjects.reject(id, reason)
      setProject((prev) => ({ ...prev, status: 'rejected' }))
      setRejectModal(false)
    } catch (err) {
      alert('Gagal: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-sm">
          <ArrowLeft size={16} /> Kembali
        </button>
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      </div>
    )
  }

  if (!project) return null

  const isPending = project.status === 'pending'
  const screenshots = project.screenshots || project.images || []

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
        {isPending && (
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Check size={15} /> Terima
            </button>
            <button
              onClick={() => setRejectModal(true)}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={15} /> Tolak
            </button>
          </div>
        )}
      </div>

      {/* Project Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6"
      >
        {/* Title + Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">{project.title}</h1>
          <span className={`inline-flex self-start text-xs px-3 py-1 rounded-full font-medium ${STATUS_STYLES[project.status] || 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
            {STATUS_LABELS[project.status] || project.status}
          </span>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 whitespace-pre-line">{project.description}</p>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <MetaItem icon={User} label="Pembuat" value={project.creator_name || project.creator || '-'} />
          {project.creator_nim && <MetaItem icon={Tag} label="NIM" value={project.creator_nim} />}
          {project.creator_major && <MetaItem icon={FolderOpen} label="Jurusan" value={project.creator_major} />}
          {project.creator_year && <MetaItem icon={Calendar} label="Angkatan" value={project.creator_year} />}
          {project.tracking_id && <MetaItem icon={Tag} label="Tracking ID" value={project.tracking_id} />}
          <MetaItem icon={FolderOpen} label="Kategori" value={project.category || '-'} />
          <MetaItem icon={Calendar} label="Tanggal Submit" value={
            project.created_at ? new Date(project.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'
          } />
          {project.reviewed_at && (
            <MetaItem icon={Calendar} label="Ditinjau pada" value={
              new Date(project.reviewed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            } />
          )}
          {project.reviewed_by && <MetaItem icon={User} label="Ditinjau oleh" value={project.reviewed_by} />}
        </div>

        {/* Team members */}
        {project.team_members && Array.isArray(project.team_members) && project.team_members.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wide">Anggota Tim</p>
            <div className="flex flex-wrap gap-2">
              {project.team_members.map((member, i) => (
                <span key={i} className="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs rounded-full">
                  {typeof member === 'string' ? member : member.name || member}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tech stack tags */}
        {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wide">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech, i) => (
                <span key={i} className="px-2.5 py-1 bg-secondary/10 text-secondary dark:text-purple-300 text-xs rounded-full font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(project.demo_url || project.github_url || project.link || project.url) && (
          <div className="flex flex-wrap gap-3 mb-6">
            {(project.demo_url || project.link || project.url) && (
              <a
                href={project.demo_url || project.link || project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 text-secondary dark:text-purple-300 text-sm font-medium rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <ExternalLink size={14} /> Demo
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm font-medium rounded-lg hover:bg-[var(--border-color)] transition-colors"
              >
                <GitFork size={14} /> GitHub
              </a>
            )}
          </div>
        )}

        {/* Reject reason */}
        {project.status === 'rejected' && project.rejection_reason && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-xs font-medium text-red-600 mb-1">Alasan Penolakan:</p>
            <p className="text-sm text-red-700">{project.rejection_reason}</p>
          </div>
        )}
      </motion.div>

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6"
        >
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">Tangkapan Layar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {screenshots.map((src, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-[var(--border-color)]">
                <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-48 object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Reject Modal */}
      <RejectModal
        open={rejectModal}
        onClose={() => setRejectModal(false)}
        onConfirm={handleReject}
      />
    </div>
  )
}

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-[var(--text-muted)]" />
      </div>
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-0.5">{label}</p>
        <p className="text-sm text-[var(--text-secondary)]">{value}</p>
      </div>
    </div>
  )
}

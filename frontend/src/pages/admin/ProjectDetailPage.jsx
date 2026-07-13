import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, X, ExternalLink, GitFork, User, Calendar, FolderOpen, Users } from 'lucide-react'
import { adminProjects } from '../../services/adminApi'
import StatusBadge from '../../components/admin/ui/StatusBadge'
import { lockScroll, unlockScroll } from '../../lib/scrollLock'

function RejectModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Lock body scroll while the modal is open (overflow-hidden + backdrop blur)
  useEffect(() => {
    if (open) {
      lockScroll()
      return () => unlockScroll()
    }
  }, [open])

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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="bg-[var(--bg-card)] rounded-lg sm:rounded-xl shadow-xl border border-[var(--border-color)] w-full max-w-md p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Tolak Proyek</h3>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[var(--text-secondary)] mb-1">Alasan Penolakan</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
                placeholder="Masukkan alasan penolakan..."
              />
            </div>
            <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-5">
              <button
                onClick={onClose}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-[var(--text-secondary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
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
      .then((data) => setProject(data.project || data.data || data))
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
      setProject((prev) => ({ ...prev, status: 'rejected', rejection_reason: reason }))
      setRejectModal(false)
      document.body.classList.remove('scroll-locked')
    } catch (err) {
      alert('Gagal: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 sm:py-20">
        <div className="w-8 h-8 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-400 text-xs sm:text-sm">
          <ArrowLeft size={16} /> Kembali
        </button>
        <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-600 text-xs sm:text-sm">{error}</div>
      </div>
    )
  }

  if (!project) return null

  const isPending = project.status === 'pending'
  const screenshots = project.screenshots_urls || []
  const collaborators = Array.isArray(project.collaborators) ? project.collaborators : []

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-400 text-xs sm:text-sm w-fit">
          <ArrowLeft size={16} /> Kembali
        </button>
        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Thumbnail */}
          {(project.thumbnail_url || project.thumbnail) && (
            <div className="rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-[#141414]">
              <img 
                src={project.thumbnail_url || project.thumbnail} 
                alt={project.title} 
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Project Info */}
          <div className="bg-gray-50 dark:bg-[#141414] rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4 sm:p-6">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{project.title}</h1>
            
            {project.description && (
              <div className="mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-pre-line leading-relaxed">{project.description}</p>
              </div>
            )}

            {/* Tech Stack */}
            {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tech_stack.map((tech, i) => (
                    <span key={i} className="px-2 sm:px-2.5 py-1 bg-gray-900 dark:bg-white/10 text-white dark:text-gray-100 text-[10px] sm:text-xs rounded-full font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(project.live_demo || project.github_link || project.download_link || project.figma_link) && (
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                {project.live_demo && (
                  <a href={project.live_demo} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-900 dark:bg-white/10 text-white dark:text-gray-100 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-900 dark:bg-white/20 transition-colors">
                    <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" /> Demo
                  </a>
                )}
                {project.github_link && (
                  <a href={project.github_link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-50 dark:bg-[#141414] text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 dark:bg-[#141414] transition-colors">
                    <GitFork size={12} className="sm:w-3.5 sm:h-3.5" /> GitHub
                  </a>
                )}
                {project.download_link && (
                  <a href={project.download_link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-50 dark:bg-[#141414] text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 dark:bg-[#141414] transition-colors">
                    <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" /> Download
                  </a>
                )}
                {project.figma_link && (
                  <a href={project.figma_link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-50 dark:bg-[#141414] text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 dark:bg-[#141414] transition-colors">
                    <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" /> Figma
                  </a>
                )}
              </div>
            )}

            {/* Rejection Reason */}
            {project.status === 'rejected' && project.rejection_reason && (
              <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-lg mb-4 sm:mb-6">
                <p className="text-[10px] sm:text-xs font-medium text-red-600 dark:text-red-400 mb-1">Alasan Penolakan:</p>
                <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">{project.rejection_reason}</p>
              </div>
            )}
          </div>

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <div className="bg-gray-50 dark:bg-[#141414] rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4 sm:p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-sm sm:text-base">Screenshot</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {screenshots.map((src, i) => (
                  <img key={i} src={src} alt={`Screenshot ${i + 1}`} loading="lazy" className="rounded-lg border border-gray-200 dark:border-neutral-800 w-full aspect-video object-cover" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Actions */}
          {isPending && (
            <div className="bg-gray-50 dark:bg-[#141414] rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4 sm:p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-sm sm:text-base">Aksi</h2>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAccept}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Check size={14} /> Terima Proyek
                </button>
                <button
                  onClick={() => { setRejectModal(true) }}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X size={14} /> Tolak Proyek
                </button>
              </div>
            </div>
          )}

          {/* Creator Profile */}
          <div className="bg-gray-50 dark:bg-[#141414] rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4 sm:p-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
              <User size={14} /> Pembuat
            </h2>
            <div className="flex items-center gap-3">
              {project.creator_avatar_url || project.creator_avatar ? (
                <img 
                  src={project.creator_avatar_url || project.creator_avatar} 
                  alt={project.creator_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-900 dark:border-white/20 flex-shrink-0"
                />
              ) : (
                           <div className="w-12 h-12 rounded-full bg-gray-900 dark:bg-white/20 flex items-center justify-center text-white dark:text-gray-100 text-lg font-bold flex-shrink-0">
                  {(project.creator_name || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">{project.creator_name || '-'}</p>
                {project.creator_type === 'dosen' && (
                  <span className="text-[10px] sm:text-xs text-amber-600 font-medium">Dosen</span>
                )}
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.creator_nim && (
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{project.creator_type === 'dosen' ? 'NIP' : 'NIM'}: {project.creator_nim}</span>
                  )}
                </div>
                {project.creator_major && (
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{project.creator_major}</p>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 dark:bg-[#141414] rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4 sm:p-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-sm sm:text-base">Informasi</h2>
            <div className="space-y-3 sm:space-y-4">
              <MetaItem icon={FolderOpen} label="Kategori" value={({ web: 'Web', mobile: 'Mobile', uiux: 'UI/UX', game: 'Game', ai: 'AI/ML' })[project.category] || project.category || '-'} />
              {project.tracking_id && (
                <MetaItem icon={GitFork} label="ID Pelacakan" value={<span className="font-mono">{project.tracking_id}</span>} />
              )}
              <MetaItem icon={Calendar} label="Tanggal Submit" value={
                project.created_at ? new Date(project.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'
              } />
              {project.reviewed_at && (
                <MetaItem icon={Calendar} label="Ditinjau pada" value={
                  new Date(project.reviewed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                } />
              )}
            </div>
          </div>

          {/* Collaborators */}
          {collaborators.length > 0 && (
            <div className="bg-gray-50 dark:bg-[#141414] rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4 sm:p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
                <Users size={14} /> Kolaborator
              </h2>
              <div className="space-y-2">
                {collaborators.map((collab, i) => {
                  const name = typeof collab === 'string' ? collab : collab.name || 'Unknown'
                  const avatar = typeof collab === 'object' ? (collab.avatar || collab.avatar_url) : null
                  return (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-[#141414]">
                       {avatar ? (
                          <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                       ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-900 dark:bg-white/20 flex items-center justify-center text-white dark:text-gray-100 text-lg font-bold flex-shrink-0">
                          {name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{name}</p>
                        {typeof collab === 'object' && collab.type === 'dosen' && (
                          <span className="text-[10px] text-amber-600">Dosen</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {createPortal(
        <RejectModal
          open={rejectModal}
          onClose={() => { setRejectModal(false) }}
          onConfirm={handleReject}
        />,
        document.body
      )}
    </div>
  )
}

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2 sm:gap-3">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-50 dark:bg-[#141414] flex items-center justify-center flex-shrink-0">
        <Icon size={12} className="text-gray-500 dark:text-gray-400 sm:w-3.5 sm:h-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{value}</p>
      </div>
    </div>
  )
}

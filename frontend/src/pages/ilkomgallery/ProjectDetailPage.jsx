import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  User, Eye, Share2, Bookmark, Heart,
  ChevronRight, Link as LinkIcon, Check,
  ArrowLeft, Play, Brain, AlertCircle
} from 'lucide-react'
import { FaGithub, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

import { API_BASE } from '../../services/api'
import Breadcrumb from '../../components/common/Breadcrumb'
import { formatNumber, generateSlug } from '../../utils/formatters'
import { viewTracker } from '../../services/api'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { isProjectLiked, isProjectSaved } from '../../hooks/useEngagement'

const getCategoryDisplay = (category) => ({
  web: 'Web Development', mobile: 'Mobile App', uiux: 'UI/UX Design',
  game: 'Game Development', ai: 'AI Project'
}[category] || category)

const ProjectDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [realViews, setRealViews] = useState(0)
  const [relatedProjects, setRelatedProjects] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchProject = async () => {
      try {
        setLoading(true)
        const id = parseInt(slug)
        let foundProject = null
        if (!isNaN(id)) {
          const res = await fetch(`${API_BASE}/projects/${id}`)
          if (res.ok) foundProject = await res.json()
          else throw new Error('Project not found')
        } else {
          const res = await fetch(`${API_BASE}/projects`)
          if (!res.ok) throw new Error('Failed to fetch')
          const data = await res.json()
          const projects = data.data || data
          foundProject = projects.find(p => generateSlug(p.title) === slug) || projects.find(p => p.id.toString() === slug)
          if (!foundProject) throw new Error('Project not found')
        }
        setProject(foundProject)
        viewTracker.increment('projects', foundProject.id, foundProject.views || 0).then(setRealViews)
        const allRes = await fetch(`${API_BASE}/projects`)
        if (allRes.ok) {
          const allData = await allRes.json()
          setRelatedProjects((allData.data || allData).filter(p => p.id !== foundProject.id && p.category === foundProject.category).slice(0, 3))
        }
      } catch (err) { setError(err.message) } finally { setLoading(false) }
    }
    fetchProject()
  }, [slug])

  useEffect(() => {
    if (project) {
      setIsLiked(isProjectLiked(project.id))
      setIsBookmarked(isProjectSaved(project.id))
    }
  }, [project])

  const handleShare = async (platform) => {
    const url = window.location.href, title = project?.title || ''
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    }
    if (platform === 'copy') { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* clipboard may be unavailable */ } }
    else if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  const handleToggleLike = () => {
    const likes = JSON.parse(localStorage.getItem('project_likes') || '{}')
    if (likes[project.id]) { delete likes[project.id]; setIsLiked(false) }
    else { likes[project.id] = { likedAt: new Date().toISOString() }; setIsLiked(true) }
    localStorage.setItem('project_likes', JSON.stringify(likes))
  }

  const handleToggleSave = () => {
    const saves = JSON.parse(localStorage.getItem('project_saves') || '{}')
    if (saves[project.id]) { delete saves[project.id]; setIsBookmarked(false) }
    else { saves[project.id] = { savedAt: new Date().toISOString() }; setIsBookmarked(true) }
    localStorage.setItem('project_saves', JSON.stringify(saves))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin" /></div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-center p-6"><div><AlertCircle size={32} className="text-red-500 mx-auto mb-3" /><p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{error}</p><button onClick={() => navigate('/ilkomgallery')} className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background: 'var(--accent)' }}>Kembali ke Gallery</button></div></div>
  if (!project) return null

  const thumbnailUrl = project.thumbnail_url || project.thumbnail || 'https://placehold.co/600x400/8B5CF6/white?text=No+Image'
  const techStack = project.tech_stack ? (typeof project.tech_stack === 'string' ? project.tech_stack.split(',').map(t => t.trim()) : project.tech_stack) : []
  const collaborators = Array.isArray(project.collaborators) ? project.collaborators : []
  const creatorAvatarUrl = project.creator_avatar_url || project.creator_avatar || null

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-24">
      <Breadcrumb />

      {/* Back Button */}
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition-opacity" 
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={16} /> Kembali
      </motion.button>

      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden mb-8"
      >
        <div className="aspect-[16/7] bg-[#1A0533]">
          <ImageWithFallback
            src={thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover"
            fallbackText="No Image"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: 'var(--accent)' }}>
              {getCategoryDisplay(project.category)}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight font-heading">{project.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
            {project.creator_name && <span className="flex items-center gap-1"><User size={12} /> {project.creator_name}</span>}
            <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(realViews)} views</span>
          </div>
        </div>
      </motion.div>

      {/* Project Content */}
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl p-6 md:p-10 mb-12" 
        style={{ background: 'var(--bg-card)' }}
      >
        {/* Description */}
        {project.description && (
          <div className="mb-10">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Brain size={18} style={{ color: 'var(--accent)' }} />
              Deskripsi
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
              {project.description}
            </p>
          </div>
        )}

        {/* Tech Stack */}
        {techStack.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <motion.span 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-3 py-1 text-xs font-medium rounded-full" 
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(project.live_demo || project.github_link) && (
          <div className="flex flex-wrap gap-3 mb-10">
            {project.live_demo && (
              <a href={project.live_demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:shadow-lg" style={{ background: 'var(--accent)' }}>
                <Play size={16} /> Live Demo
              </a>
            )}
            {project.github_link && (
              <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                <FaGithub size={16} /> GitHub
              </a>
            )}
          </div>
        )}

        {/* Team */}
        <div className="border-t pt-8" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Tim Pengembang</h2>
          <div className="space-y-3">
            {/* Creator */}
            {project.creator_name && (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                {creatorAvatarUrl ? (
                  <img src={creatorAvatarUrl} alt={project.creator_name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--accent)' }}>
                    {project.creator_name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{project.creator_name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 dark:text-purple-400">Pembuat</span>
                  {project.creator_type === 'dosen' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 ml-1">Dosen</span>
                  )}
                </div>
              </div>
            )}
            {/* Collaborators */}
            {collaborators.map((m, idx) => {
              const name = typeof m === 'string' ? m : (m.name || 'Unknown')
              const avatar = typeof m === 'object' ? (m.avatar || m.avatar_url) : null
              const isDosen = typeof m === 'object' && m.type === 'dosen'
              return (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-purple-500/60">
                      {name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{name}</p>
                    {isDosen && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">Dosen</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 mt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <motion.button 
            onClick={handleToggleLike} 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl transition-all" 
            style={{ color: isLiked ? '#ef4444' : 'var(--text-muted)', background: isLiked ? 'rgba(239,68,68,0.1)' : 'transparent' }}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          </motion.button>
          <motion.button 
            onClick={handleToggleSave} 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl transition-all" 
            style={{ color: isBookmarked ? 'var(--accent)' : 'var(--text-muted)', background: isBookmarked ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent' }}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </motion.button>
          <div className="relative">
            <motion.button 
              onClick={() => setShowShareMenu(!showShareMenu)} 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl transition-all" 
              style={{ color: 'var(--text-muted)' }}
            >
              <Share2 size={18} />
            </motion.button>
            {showShareMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                <div className="absolute right-0 mt-2 rounded-xl shadow-xl py-1.5 z-20 min-w-[160px]" style={{ background: 'var(--bg-secondary)' }}>
                  {[
                    { icon: <FaFacebook size={14} className="text-blue-600" />, label: 'Facebook', key: 'facebook' },
                    { icon: <FaTwitter size={14} className="text-blue-400" />, label: 'Twitter', key: 'twitter' },
                    { icon: <FaLinkedin size={14} className="text-blue-700" />, label: 'LinkedIn', key: 'linkedin' },
                    { icon: <FaWhatsapp size={14} className="text-green-500" />, label: 'WhatsApp', key: 'whatsapp' }
                  ].map(it => (
                    <button key={it.key} onClick={() => handleShare(it.key)} className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {it.icon} {it.label}
                    </button>
                  ))}
                  <div className="my-1 border-t" style={{ borderColor: 'var(--border-color)' }} />
                  <button onClick={() => handleShare('copy')} className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {copied ? <Check size={14} className="text-green-500" /> : <LinkIcon size={14} />} {copied ? 'Tersalin!' : 'Salin Link'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.article>

      {/* Related Projects - Consistent with NewsDetail */}
      {relatedProjects.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>Proyek Terkait</h2>
            <Link to="/ilkomgallery" className="text-xs font-medium flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: 'var(--accent)' }}>
              Lihat Semua <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedProjects.map(item => (
              <Link 
                key={item.id} 
                to={`/ilkomgallery/project/${item.id}`} 
                className="group rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg" 
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback 
                    src={item.thumbnail_url || item.thumbnail} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    fallbackText="No Image" 
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{getCategoryDisplay(item.category)}</p>
                  <h3 className="text-sm font-bold line-clamp-2 mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{item.description || 'Tidak ada deskripsi'}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProjectDetailPage

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar, User, Eye, Share2, Bookmark, Heart,
  ChevronRight, Link as LinkIcon, Check,
  ArrowLeft, Play, Brain, AlertCircle
} from 'lucide-react'
import { FaGithub, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'

import { API_BASE } from '../../services/api'
import { formatNumber, generateSlug } from '../../utils/formatters'
import { viewTracker } from '../../services/api'
import ImageWithFallback from '../../components/ui/ImageWithFallback'

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
      const bm = JSON.parse(localStorage.getItem('projectBookmarks') || '[]')
      setIsBookmarked(bm.includes(project.id))
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
    if (platform === 'copy') { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {} }
    else if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin" /></div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-center p-6"><div><AlertCircle size={32} className="text-red-500 mx-auto mb-3" /><p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{error}</p><button onClick={() => navigate('/ilkomgallery')} className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm">Kembali</button></div></div>
  if (!project) return null

  const creator = { name: project.creator_name || 'Unknown', avatar: project.creator_avatar_url, major: project.creator_major || '', nim: project.creator_nim || '', year: project.creator_year || '', type: project.creator_type || 'mahasiswa' }
  const collabs = (project.collaborators || []).map(c => ({ name: typeof c === 'string' ? c : c.name || 'Unknown', avatar: c.avatar || null, major: c.major || '', nim: c.nim || '', year: c.year || '', type: c.type || 'mahasiswa' }))
  const team = [{ ...creator, isCreator: true }, ...collabs]

  return (
    <div className="max-w-4xl mx-auto pt-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-6 hover:opacity-70" style={{ color: 'var(--text-secondary)' }}><ArrowLeft size={16} /> Kembali</button>

      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="aspect-[16/7] bg-neutral-900"><ImageWithFallback src={project.thumbnail_url || project.thumbnail} alt={project.title} className="w-full h-full object-cover" fallbackText="Tidak Ada Gambar" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-white/15 backdrop-blur-sm border border-white/10 mb-3"><Brain size={12} /> {getCategoryDisplay(project.category)}</span>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">{project.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1"><User size={12} /> {creator.name}</span>
            {creator.year && <span className="flex items-center gap-1"><Calendar size={12} /> {creator.year}</span>}
            <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(realViews)}</span>
          </div>
        </div>
      </div>

      <article className="rounded-xl p-6 md:p-8 space-y-5" style={{ background: 'var(--bg-card)' }}>
        {(project.live_demo || project.github_link) && (
          <div className="flex flex-wrap gap-2">
            {project.live_demo && <a href={project.live_demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[var(--accent)] hover:brightness-110 transition"><Play size={14} fill="currentColor" /> Demo</a>}
            {project.github_link && <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition" style={{ color: 'var(--text-primary)' }}><FaGithub size={14} /> GitHub</a>}
          </div>
        )}

        {project.tech_stack?.length > 0 && (
          <div><h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Tech Stack</h2>
            <div className="flex flex-wrap gap-1.5">{project.tech_stack.map((t, i) => <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800" style={{ color: 'var(--text-primary)' }}>{t}</span>)}</div>
          </div>
        )}

        {project.description && (
          <div><h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Deskripsi</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
          </div>
        )}

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">{project.tags.map((t, i) => <span key={i} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800" style={{ color: 'var(--text-muted)' }}>#{t}</span>)}</div>
        )}

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Tim</h2>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {team.map((m, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 ${i !== team.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800' : ''} ${i === 0 ? 'bg-neutral-50 dark:bg-neutral-800/50' : ''}`}>
                {m.avatar ? <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  : <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: 'var(--accent)', opacity: m.isCreator ? 1 : 0.6 }}>{m.name.charAt(0)}</div>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{m.name}</span>
                    {m.isCreator && <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded bg-[var(--accent)]/10" style={{ color: 'var(--accent)' }}>Pembuat</span>}
                    {m.type === 'dosen' && <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">Dosen</span>}
                  </div>
                  {[m.major, m.nim, m.year].filter(Boolean).length > 0 && (
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{[m.major, m.nim ? `NIM: ${m.nim}` : null, m.year ? `Angkatan ${m.year}` : null].filter(Boolean).join(' · ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <button onClick={() => setIsLiked(!isLiked)} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" style={{ color: isLiked ? '#ef4444' : 'var(--text-muted)' }}><Heart size={16} fill={isLiked ? 'currentColor' : 'none'} /></button>
          <button onClick={() => { setIsBookmarked(!isBookmarked); const bm = JSON.parse(localStorage.getItem('projectBookmarks') || '[]'); localStorage.setItem('projectBookmarks', JSON.stringify(!isBookmarked ? [...bm, project.id] : bm.filter(id => id !== project.id))) }} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" style={{ color: isBookmarked ? 'var(--accent)' : 'var(--text-muted)' }}><Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} /></button>
          <div className="relative">
            <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" style={{ color: 'var(--text-muted)' }}><Share2 size={16} /></button>
            {showShareMenu && <>
              <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
              <div className="absolute right-0 mt-1 rounded-xl shadow-xl py-1 z-20 min-w-[150px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                {[{ icon: <FaFacebook size={12} className="text-blue-600" />, label: 'Facebook', key: 'facebook' }, { icon: <FaTwitter size={12} className="text-blue-400" />, label: 'Twitter', key: 'twitter' }, { icon: <FaLinkedin size={12} className="text-blue-700" />, label: 'LinkedIn', key: 'linkedin' }, { icon: <FaWhatsapp size={12} className="text-green-500" />, label: 'WhatsApp', key: 'whatsapp' }].map(it => (
                  <button key={it.key} onClick={() => handleShare(it.key)} className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800" style={{ color: 'var(--text-primary)' }}>{it.icon} {it.label}</button>
                ))}
                <div className="my-0.5 border-t border-neutral-100 dark:border-neutral-800" />
                <button onClick={() => handleShare('copy')} className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800" style={{ color: 'var(--text-primary)' }}>{copied ? <Check size={12} className="text-green-500" /> : <LinkIcon size={12} />} {copied ? 'Tersalin!' : 'Salin Link'}</button>
              </div>
            </>}
          </div>
        </div>
      </article>

      {relatedProjects.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Proyek Terkait</h2><Link to="/ilkomgallery" className="text-xs font-medium flex items-center gap-1 hover:opacity-70" style={{ color: 'var(--accent)' }}>Lihat Semua <ChevronRight size={12} /></Link></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedProjects.map(item => (
              <Link key={item.id} to={`/ilkomgallery/project/${item.id}`} className="group rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:-translate-y-0.5 transition-all">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800"><ImageWithFallback src={item.thumbnail_url || `https://picsum.photos/seed/p-${item.id}/400/300`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fallbackText="No Image" /></div>
                <div className="p-3"><p className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>{getCategoryDisplay(item.category)}</p><h3 className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3></div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetailPage

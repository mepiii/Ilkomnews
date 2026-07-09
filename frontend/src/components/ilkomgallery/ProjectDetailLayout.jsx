import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Play, X, Download, ExternalLink, GitFork,
  User, Calendar, Code2, Award, Users,
  Mail, ArrowLeft, Globe, Tag, ChevronRight, Home
} from 'lucide-react'

/**
 * Shared layout for gallery detail pages.
 * Improved readability and navigation following IMPECC.md guidelines.
 */

export default function ProjectDetailLayout({ 
  project, 
  categoryLabel,
  categoryIcon: CategoryIcon,
  backPath = '/ilkomgallery',
  accentColor = 'orange'
}) {
  const [showTrailer, setShowTrailer] = useState(false)
  const navigate = useNavigate()

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
            <Tag size={32} className="text-[var(--text-muted)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Proyek Tidak Ditemukan</h1>
          <p className="text-[var(--text-secondary)] mb-6">Proyek yang Anda cari tidak tersedia.</p>
          <Link 
            to={backPath}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-lg hover:brightness-110 transition font-medium"
          >
            <ArrowLeft size={18} />
            <span>Kembali ke Galeri</span>
          </Link>
        </div>
      </div>
    )
  }

  const videoUrl = project.gameplayVideo || project.previewVideo
  const techStack = project.techStack || project.tech_stack || []
  const collaborators = project.collaborators || []
  const creatorAvatar = project.creator_avatar_url || project.creator_avatar || project.creatorAvatar

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img 
          src={project.banner || project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 px-4 py-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition backdrop-blur-sm text-sm font-medium"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>
        </div>
        
        {/* Title & Actions Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-3">
              {CategoryIcon && <CategoryIcon size={16} className="text-[var(--accent)]" />}
              <span className="text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
                {categoryLabel}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight max-w-4xl">
              {project.title}
            </h1>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {videoUrl && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-lg font-medium hover:brightness-110 transition"
                >
                  <Play size={18} />
                  <span>Tonton Trailer</span>
                </button>
              )}
              
              {project.downloadLink && (
                <a
                  href={project.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition backdrop-blur-sm border border-white/20"
                >
                  <Download size={18} />
                  <span>Download</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/" className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm">
              <Home size={14} />
              <span className="font-medium">Beranda</span>
            </Link>
            <ChevronRight size={14} className="text-[var(--text-muted)]/50" />
            <Link to="/ilkomgallery" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-medium">
              ILKOM Gallery
            </Link>
            <ChevronRight size={14} className="text-[var(--text-muted)]/50" />
            <Link to={`/ilkomgallery?category=${project.category}`} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-medium">
              {categoryLabel}
            </Link>
            <ChevronRight size={14} className="text-[var(--text-muted)]/50" />
            <span className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[200px]">
              {project.title}
            </span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Links Bar */}
            {(project.live_demo || project.github_link || project.githubLink || project.figma_link || project.figmaLink) && (
              <div className="flex flex-wrap gap-3 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
                {project.live_demo && (
                  <a href={project.live_demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg text-sm font-medium hover:bg-[var(--accent)]/20 transition">
                    <Globe size={16} /> Live Demo
                  </a>
                )}
                {(project.github_link || project.githubLink) && (
                  <a href={project.github_link || project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">
                    <GitFork size={16} /> GitHub
                  </a>
                )}
                {(project.figma_link || project.figmaLink) && (
                  <a href={project.figma_link || project.figmaLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition">
                    <ExternalLink size={16} /> Figma
                  </a>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 text-lg">
                <Tag size={18} className="text-[var(--accent)]" />
                Deskripsi
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {project.description || 'Tidak ada deskripsi'}
              </p>
            </div>
            
            {/* Tech Stack */}
            {techStack.length > 0 && (
              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6">
                <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 text-lg">
                  <Code2 size={18} className="text-[var(--accent)]" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Creator */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 text-lg">
                <User size={18} />
                Pembuat
              </h3>
              
              <div className="flex items-center gap-4">
                {creatorAvatar ? (
                  <img 
                    src={creatorAvatar} 
                    alt={project.creator || project.creator_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--accent)]/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {(project.creator || project.creator_name || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[var(--text-primary)] text-lg truncate">
                    {project.creator || project.creator_name || 'Unknown'}
                  </h4>
                  {project.jurusan && (
                    <p className="text-[var(--text-muted)] text-sm truncate">{project.jurusan}</p>
                  )}
                  {project.nim && (
                    <p className="text-[var(--text-muted)] text-xs">NIM: {project.nim}</p>
                  )}
                </div>
              </div>
              
              {project.angkatan && (
                <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Calendar size={14} />
                  <span>Angkatan {project.angkatan}</span>
                </div>
              )}
            </div>
            
            {/* Collaborators */}
            {collaborators.length > 0 && (
              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6">
                <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 text-lg">
                  <Users size={18} />
                  Kolaborator
                </h3>
                <div className="space-y-3">
                  {collaborators.map((collab, idx) => {
                    const name = typeof collab === 'string' ? collab : collab.name || 'Unknown'
                    const avatar = typeof collab === 'object' ? (collab.avatar || collab.avatar_url) : null
                    const isDosen = typeof collab === 'object' && collab.type === 'dosen'
                    
                    return (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition">
                        {avatar ? (
                          <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] text-sm font-bold">
                            {name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--text-primary)] truncate">{name}</p>
                          {isDosen && (
                            <span className="text-xs text-amber-600 font-medium">Dosen</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Award */}
            {project.award && (
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 p-6">
                <h3 className="font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2 text-lg">
                  <Award size={18} className="text-amber-500" />
                  Penghargaan
                </h3>
                <p className="text-amber-600 font-medium">{project.award}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && videoUrl && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-[var(--accent)] transition"
            >
              <X size={24} />
            </button>
            <div className="bg-black rounded-xl overflow-hidden">
              <iframe 
                src={videoUrl} 
                className="w-full aspect-video"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

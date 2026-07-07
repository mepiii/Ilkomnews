import { Link } from 'react-router-dom'
import { ExpandableCard } from '../ui/ExpandableCard'
import { Globe, Smartphone, Palette, Gamepad2, Cpu } from 'lucide-react'

const categoryIcons = { web: Globe, mobile: Smartphone, uiux: Palette, game: Gamepad2, ai: Cpu }
const categoryLabels = { web: 'Web', mobile: 'Mobile', uiux: 'UI/UX', game: 'Game', ai: 'AI' }
const categoryThemes = { web: '220 60% 35%', mobile: '150 50% 30%', uiux: '280 50% 35%', game: '0 60% 40%', ai: '270 50% 40%' }

const parseTechStack = (tech_stack) => {
    if (!tech_stack) return []
    if (Array.isArray(tech_stack)) return tech_stack.map(t => String(t).trim()).filter(Boolean)
    if (typeof tech_stack === 'string') return tech_stack.split(',').map(t => t.trim()).filter(Boolean)
    return []
  }

const ProjectExpandableCard = ({ project }) => {
  const CatIcon = categoryIcons[project.category] || Globe
  const techItems = parseTechStack(project.tech_stack)
  const collaborators = Array.isArray(project.collaborators) ? project.collaborators : []
  const themeColor = categoryThemes[project.category] || '270 50% 40%'

  return (
    <ExpandableCard
      title={project.title}
      src={project.thumbnail_url || 'https://placehold.co/600x800/8B5CF6/white?text=Tidak+Ada+Gambar'}
      itemType="project"
      itemId={project.id}
      themeColor={themeColor}
      badge={
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/40 text-white backdrop-blur-sm">
          <CatIcon size={10} /> {categoryLabels[project.category] || project.category}
        </span>
      }
      meta={
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {project.creator_name && (
            <div className="flex items-center gap-1">
              {project.creator_avatar_url ? (
                <img src={project.creator_avatar_url} alt={project.creator_name} className="w-4 h-4 rounded-full object-cover" />
              ) : (
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold bg-purple-600">
                  {project.creator_name.charAt(0)}
                </div>
              )}
              <span>{project.creator_name}</span>
            </div>
          )}
          {techItems.length > 0 && (
            <>
              <span>·</span>
              <span>{techItems.slice(0, 2).join(', ')}</span>
            </>
          )}
        </div>
      }
    >
      <div className="w-full space-y-3">
        {/* Creator + Collaborators */}
        {(project.creator_name || collaborators.length > 0) && (
          <div>
            <h4 className="text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Tim</h4>
            <div className="space-y-1.5">
              {project.creator_name && (
                <div className="flex items-center gap-2">
                  {project.creator_avatar_url ? (
                    <img src={project.creator_avatar_url} alt={project.creator_name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold bg-purple-600">
                      {project.creator_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{project.creator_name}</span>
                    <span className="text-[9px] font-medium px-1 py-0.5 rounded bg-purple-500/10 text-purple-500 dark:text-purple-400">Pembuat</span>
                  </div>
                </div>
              )}
              {collaborators.map((collab, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold bg-purple-500/60">
                    {typeof collab === 'string' ? collab.charAt(0) : (collab.name || '?').charAt(0)}
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {typeof collab === 'string' ? collab : collab.name || 'Unknown'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.description && (
          <div>
            <h4 className="text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Deskripsi</h4>
            <p className="text-xs leading-relaxed break-words" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
          </div>
        )}

        <Link
          to={`/ilkomgallery/project/${project.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[11px] font-medium hover:bg-[var(--accent)]/20 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Lihat Detail
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>
    </ExpandableCard>
  )
}

export default ProjectExpandableCard

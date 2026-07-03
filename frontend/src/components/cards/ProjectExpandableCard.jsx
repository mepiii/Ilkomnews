import { Link } from 'react-router-dom'
import { ExpandableCard } from '../ui/ExpandableCard'
import { Globe, Smartphone, Palette, Gamepad2, Cpu } from 'lucide-react'

const categoryIcons = { web: Globe, mobile: Smartphone, uiux: Palette, game: Gamepad2, ai: Cpu }
const categoryLabels = { web: 'Pengembangan Web', mobile: 'Aplikasi Mobile', uiux: 'Desain UI/UX', game: 'Pengembangan Game', ai: 'AI / Lainnya' }

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

  return (
    <ExpandableCard
      title={project.title}
      src={project.thumbnail_url || 'https://placehold.co/800x500/8B5CF6/white?text=Tidak+Ada+Gambar'}
      itemType="project"
      itemId={project.id}
      badge={
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-600/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25">
          <CatIcon size={12} /> {categoryLabels[project.category] || project.category}
        </span>
      }
      meta={
        <div className="space-y-2">
          {project.creator_name && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50 flex-wrap">
              <span className="font-medium">{project.creator_name}</span>
              {collaborators.length > 0 && (
                <><span>+</span><span>{collaborators.length} Kolaborator</span></>
              )}
            </div>
          )}
          {techItems.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {techItems.slice(0, 3).map((tech, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-purple-100 dark:bg-purple-600/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25">
                  {tech}
                </span>
              ))}
              {techItems.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-purple-100 dark:bg-purple-600/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25">
                  +{techItems.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      }
    >
      <div className="w-full space-y-5">
        {collaborators.length > 0 && (
          <div className="rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 min-w-0">
            <h4 className="text-gray-700 dark:text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
              Kolaborator <span className="text-gray-400 dark:text-white/40 font-normal">({collaborators.length})</span>
            </h4>
            <div className="space-y-1.5 text-sm">
              {collaborators.map((collab, idx) => (
                <p key={idx} className="text-gray-600 dark:text-white/70 break-words">{typeof collab === 'string' ? collab : collab.name || '-'}</p>
              ))}
            </div>
          </div>
        )}

        {project.description && (
          <div>
            <h4 className="text-gray-700 dark:text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">Deskripsi</h4>
            <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed break-words">{project.description}</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Link
            to={`/ilkomgallery/project/${project.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-600/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25 text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-600/25 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Lihat Detail
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </ExpandableCard>
  )
}

export default ProjectExpandableCard

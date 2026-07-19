import { Link } from 'react-router-dom'
import { ExpandableCard } from '../ui/ExpandableCard'
import { Globe, Smartphone, Palette, Gamepad2, Cpu, ArrowRight } from 'lucide-react'

const categoryIcons = { web: Globe, mobile: Smartphone, uiux: Palette, game: Gamepad2, ai: Cpu }
const categoryLabels = { web: 'Web', mobile: 'Mobile', uiux: 'UI/UX', game: 'Game', ai: 'AI' }
const categoryThemes = { web: '220 60% 35%', mobile: '150 50% 30%', uiux: '280 50% 35%', game: '0 60% 40%', ai: '270 50% 40%' }

const parseTechStack = (tech_stack) => {
  if (!tech_stack) return []
  if (Array.isArray(tech_stack)) return tech_stack.map(t => String(t).trim()).filter(Boolean)
  if (typeof tech_stack === 'string') return tech_stack.split(',').map(t => t.trim()).filter(Boolean)
  return []
}

/** Stacked avatar group — shows up to 3 avatars + +X badge */
function AvatarStack({ creator, collaborators }) {
  // Build a list of all members [{ name, avatar }]
  const members = []
  if (creator?.name) members.push({ name: creator.name, avatar: creator.avatar })
  for (const c of collaborators) {
    const name = typeof c === 'string' ? c : (c.name || 'Unknown')
    const avatar = typeof c === 'object' ? (c.avatar || c.avatar_url || null) : null
    members.push({ name, avatar })
  }
  if (members.length === 0) return null

  const shown = members.slice(0, 3)
  const extra = members.length - shown.length

  return (
    <div className="avatar-stack">
      {shown.map((m, i) => (
        <div key={i} className="avatar-item" title={m.name}>
          {m.avatar ? (
            <img
              src={m.avatar}
              alt={m.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentNode.textContent = m.name.charAt(0).toUpperCase()
              }}
            />
          ) : (
            m.name.charAt(0).toUpperCase()
          )}
        </div>
      ))}
      {extra > 0 && (
        <div className="avatar-badge" title={`+${extra} lainnya`}>+{extra}</div>
      )}
    </div>
  )
}

const ProjectExpandableCard = ({ project }) => {
  const CatIcon = categoryIcons[project.category] || Globe
  const techItems = parseTechStack(project.tech_stack)
  const collaborators = Array.isArray(project.collaborators) ? project.collaborators : []
  const themeColor = categoryThemes[project.category] || '270 50% 40%'

  const creatorAvatarUrl = project.creator_avatar_url || project.creator_avatar || null
  const thumbnailUrl = project.thumbnail_url || project.thumbnail || ''

  const creatorObj = project.creator_name
    ? { name: project.creator_name, avatar: creatorAvatarUrl }
    : null

  return (
    <ExpandableCard
      title={project.title}
      src={thumbnailUrl}
      description={project.description}
      itemType="project"
      itemId={project.id}
      themeColor={themeColor}
      badge={
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full bg-[var(--accent)] text-white backdrop-blur-sm truncate max-w-full">
          <CatIcon size={12} /> {categoryLabels[project.category] || project.category}
        </span>
      }
      meta={
        <div className="flex items-center justify-between text-xs overflow-hidden" style={{ color: 'var(--text-muted)' }}>
          {/* Left: creator name */}
          <div className="flex items-center gap-1 min-w-0">
            {project.creator_name && (
              <div className="flex items-center gap-1 min-w-0">
                {creatorAvatarUrl ? (
                  <img
                    src={creatorAvatarUrl}
                    alt={project.creator_name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div                     className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold bg-[var(--accent)] shrink-0">
                    {project.creator_name.charAt(0)}
                  </div>
                )}
                <span className="truncate max-w-[80px]">{project.creator_name}</span>
              </div>
            )}
          </div>
          {/* Right: stacked avatars of collaborators */}
          {(creatorObj || collaborators.length > 0) && (
            <AvatarStack creator={creatorObj} collaborators={collaborators} />
          )}
        </div>
      }
    >
      <div className="w-full space-y-3 overflow-hidden">
        {/* Creator + Collaborators */}
        {(project.creator_name || collaborators.length > 0) && (
          <div className="overflow-hidden">
            <h4 className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider mb-2">
              Tim Pengembang
            </h4>
            <div className="space-y-1.5">
              {project.creator_name && (
                <div className="flex items-center gap-2">
                  {creatorAvatarUrl ? (
                    <img
                      src={creatorAvatarUrl}
                      alt={project.creator_name}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.style && (e.target.nextSibling.style.display = 'flex') }}
                    />
                  ) : null}
                  <div
                      className={`w-7 h-7 rounded-full items-center justify-center text-white text-sm font-bold bg-[var(--accent)] shrink-0 ${creatorAvatarUrl ? 'hidden' : 'flex'}`}
                  >
                    {project.creator_name.charAt(0)}
                  </div>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{project.creator_name}</span>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] whitespace-nowrap shrink-0">Pembuat</span>
                    {project.creator_type === 'dosen' && (
                      <span className="tech-badge text-[9px] whitespace-nowrap shrink-0">Dosen</span>
                    )}
                  </div>
                </div>
              )}
              {collaborators.slice(0, 3).map((collab, idx) => {
                const collabName = typeof collab === 'string' ? collab : (collab.name || 'Unknown')
                const collabAvatar = typeof collab === 'object' ? (collab.avatar || collab.avatar_url) : null
                const collabType = typeof collab === 'object' ? collab.type : 'mahasiswa'
                return (
                  <div key={idx} className="flex items-center gap-2">
                    {collabAvatar ? (
                      <img
                        src={collabAvatar}
                        alt={collabName}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.style && (e.target.nextSibling.style.display = 'flex') }}
                      />
                    ) : null}
                    <div
                      className={`w-7 h-7 rounded-full items-center justify-center text-white text-sm font-bold bg-[var(--accent)]/60 shrink-0 ${collabAvatar ? 'hidden' : 'flex'}`}
                    >
                      {collabName.charAt(0)}
                    </div>
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{collabName}</span>
                      {collabType === 'dosen' && (
                        <span className="tech-badge text-[9px] whitespace-nowrap shrink-0">Dosen</span>
                      )}
                    </div>
                  </div>
                )
              })}
              {collaborators.length > 3 && (
                <p className="text-[10px] text-[var(--text-muted)] pl-8 truncate">
                  +{collaborators.length - 3} kolaborator lainnya
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {techItems.length > 0 && (
          <div className="overflow-hidden">
            <h4 className="text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {techItems.slice(0, 5).map((tech, i) => (
                <span key={i} className="tech-badge">{tech}</span>
              ))}
              {techItems.length > 5 && (
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-[var(--text-muted)] whitespace-nowrap">
                  +{techItems.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        <Link
          to={`/ilkomgallery/project/${project.id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          Lihat Detail
          <ArrowRight size={14} />
        </Link>
      </div>
    </ExpandableCard>
  )
}

export default ProjectExpandableCard

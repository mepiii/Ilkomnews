import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Gamepad2 } from 'lucide-react'
import { GlowCard } from '../ui/GlowCard'

const createSlug = (title) => title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')

const GameProjectCard = ({ project }) => {
  const slug = createSlug(project.title)
  return (
    <Link to={`/ilkomgallery/game/${slug}`} className="group block">
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <GlowCard glowColor="purple" className="rounded-2xl overflow-hidden">
          <div className="relative h-72 w-full">
            <img src={project.thumbnail} alt={project.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 px-2.5 py-1 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                <Gamepad2 size={12} /><span>Game Project</span>
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">{project.title}</h3>
              <div className="flex items-center gap-3 text-white/60 text-xs mb-1">
                <span>{project.creator_name || project.creator}</span><span>•</span><span>Angkatan {project.creator_year || project.angkatan}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-white/50 text-xs line-clamp-1 flex-1 mr-3">{project.description}</p>
                <motion.div
                  className="w-8 h-8 flex items-center justify-center bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-white flex-shrink-0"
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </motion.div>
              </div>
            </div>
          </div>
        </GlowCard>
      </motion.div>
    </Link>
  )
}

export default GameProjectCard

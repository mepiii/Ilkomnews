import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Globe, Smartphone, Palette, Gamepad2, Sparkles } from 'lucide-react'
import { AnimatedText } from '../ui/AnimatedText'
import { FlowButton } from '../ui/FlowButton'
import { SmoothTabs } from '../ui/SmoothTabs'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const TABS = [
  { id: 'web', label: 'Web Development', icon: Globe },
  { id: 'mobile', label: 'Aplikasi Mobile', icon: Smartphone },
  { id: 'uiux', label: 'Desain UI/UX', icon: Palette },
  { id: 'game', label: 'Game Development', icon: Gamepad2 },
  { id: 'ai', label: 'AI / Lainnya', icon: Sparkles },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const IlkomGallery = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/projects?category=${activeTab}`)
        const data = await res.json()
        setProjects(data.data || [])
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [activeTab])

  const items = projects.slice(0, 6) // Show max 6 projects on homepage

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Proyek Mahasiswa</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-header">
            <span style={{ color: 'var(--text-primary)' }}><AnimatedText>ILKOM </AnimatedText></span>
            <span style={{ color: 'var(--accent)' }}><AnimatedText delay={0.1}>Gallery</AnimatedText></span>
          </h2>
          <div className="w-12 h-0.5 mx-auto rounded-full mb-4" style={{ background: 'var(--accent)' }} />
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            Galeri karya dan proyek mahasiswa Fakultas Ilmu Komputer
          </p>
        </motion.div>

        {/* Tab Navigation — smooth tabs */}
        <div className="flex justify-center mb-8">
          <SmoothTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Grid — 2-col matching gallery page cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {items.map((project, i) => (
              <motion.div
                key={project.id || i}
                variants={itemVariant}
                className="group rounded-2xl overflow-hidden relative"
                style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                {/* Thumbnail with overlay */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.thumbnail_url || 'https://placehold.co/800x500/8B5CF6/white?text=No+Image'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Badge top-left */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-white text-xs font-medium rounded-full backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.4)' }}>
                      {project.category?.toUpperCase() || 'PROJECT'}
                    </span>
                  </div>
                  {/* Arrow button bottom-right */}
                  <Link to={`/ilkomgallery/project/${project.id}`}>
                    <div className="absolute bottom-3 right-3 z-10">
                      <motion.div
                        className="w-8 h-8 flex items-center justify-center bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-white"
                        whileHover={{ scale: 1.15, backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </Link>
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold line-clamp-1 mb-1 font-header" style={{ color: 'var(--text-primary)' }}>{project.title}</h3>
                  <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                    <span>{project.creator_name}</span>
                    <span>•</span>
                    <span>Angkatan {project.creator_year}</span>
                  </div>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link to="/ilkomgallery">
            <FlowButton text="Jelajahi Semua Proyek" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default IlkomGallery

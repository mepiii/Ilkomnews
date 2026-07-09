import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Smartphone, Palette, Gamepad2, Sparkles, RefreshCw } from 'lucide-react'
import { Text_03 } from '../ui/Text03'
import { FlowButton } from '../ui/FlowButton'
import { GlowCard } from '../ui/GlowCard'
import { SmoothTabs } from '../ui/SmoothTabs'
import ProjectExpandableCard from '../cards/ProjectExpandableCard'
import { projectsService } from '../../services/api'
import { container, itemVariant } from '../../lib/animations'

const TABS = [
  { id: 'all', label: 'Semua', icon: Sparkles },
  { id: 'web', label: 'Pengembangan Web', icon: Globe },
  { id: 'mobile', label: 'Aplikasi Mobile', icon: Smartphone },
  { id: 'uiux', label: 'Desain UI/UX', icon: Palette },
  { id: 'game', label: 'Pengembangan Game', icon: Gamepad2 },
  { id: 'ai', label: 'AI / Lainnya', icon: Sparkles },
]

const IlkomGallery = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [backgroundLoading, setBackgroundLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)
  const isFirstLoad = useRef(true)

  const fetchProjects = (tab) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    if (isFirstLoad.current) {
      setLoading(true)
    } else {
      setBackgroundLoading(true)
    }
    setError(null)

    const timeout = setTimeout(() => controller.abort(), 10000)
    const params = tab === 'all' ? {} : { category: tab }

    projectsService.getAll(params, { signal: controller.signal })
      .then(res => {
        setProjects(Array.isArray(res.data) ? res.data : [])
        isFirstLoad.current = false
      })
      .catch(err => {
        if (err.name === 'AbortError' || err.name === 'CanceledError') return
        setError(err.message || 'Gagal memuat proyek')
        // Do not wipe existing data — let the user see stale content
        // and retry. setProjects([]) causes the "data disappears" symptom.
      })
      .finally(() => {
        clearTimeout(timeout)
        setLoading(false)
        setBackgroundLoading(false)
      })
  }

  useEffect(() => {
    fetchProjects(activeTab)
    return () => abortRef.current?.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const items = projects.slice(0, 4)

  return (
    <section className="py-20 md:py-24 relative z-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary mb-5">
            <div className="bg-theme-card border border-theme rounded-2xl px-3 py-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Ilkom Gallery</span>
            </div>
            <p className="pr-3 text-xs text-theme-muted">Proyek Mahasiswa</p>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 font-header">
            <Text_03 text="ILKOM Gallery" className="section-gradient-text" />
          </h2>
          <div className="w-20 h-0.5 mx-auto rounded-full mb-5" style={{ background: 'linear-gradient(to right, rgb(48,11,85), rgb(122,71,166))' }} />
          <p className="text-theme-muted text-base max-w-2xl mx-auto">Galeri karya dan proyek mahasiswa Fakultas Ilmu Komputer</p>
        </motion.div>

        <div className="flex justify-center mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <SmoothTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {backgroundLoading && (
          <div className="flex justify-center mb-4">
            <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 items-stretch"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={i} variants={itemVariant}>
                  <div className="h-64 rounded-xl bg-theme-secondary animate-pulse" />
                </motion.div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-16 space-y-4">
                <p className="text-theme-muted text-sm">{error}</p>
                <button
                  onClick={() => fetchProjects(activeTab)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-all"
                >
                  <RefreshCw size={14} /> Muat ulang
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-theme-muted text-sm">Belum ada proyek di kategori ini</p>
              </div>
            ) : (
              items.map((project, i) => (
                <motion.div key={project.id || i} variants={itemVariant} className="h-full">
                  <GlowCard glowColor="purple" className="rounded-2xl h-full">
                    <ProjectExpandableCard project={project} />
                  </GlowCard>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-10">
          <Link to="/ilkomgallery">
            <FlowButton text="Lihat Semua Proyek" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default IlkomGallery

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Smartphone, Palette, Gamepad2, Sparkles } from 'lucide-react'
import { Text_03 } from '../ui/Text03'
import { FlowButton } from '../ui/FlowButton'
import { GlowCard } from '../ui/GlowCard'
import { SmoothTabs } from '../ui/SmoothTabs'
import ProjectExpandableCard from '../cards/ProjectExpandableCard'
import { projectsService } from '../../services/api'
import { Tiles } from '../ui/Tiles'
import { FlickeringGrid } from '../ui/FlickeringGrid'

const TABS = [
  { id: 'web', label: 'Pengembangan Web', icon: Globe },
  { id: 'mobile', label: 'Aplikasi Mobile', icon: Smartphone },
  { id: 'uiux', label: 'Desain UI/UX', icon: Palette },
  { id: 'game', label: 'Pengembangan Game', icon: Gamepad2 },
  { id: 'ai', label: 'AI / Lainnya', icon: Sparkles },
]
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const itemVariant = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } }

const IlkomGallery = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try { const result = await projectsService.getAll({ category: activeTab }); setProjects(Array.isArray(result.data) ? result.data : []); setError(null) }
      catch { setProjects([]); setError('Gagal memuat proyek') } finally { setLoading(false) }
    }
    fetchProjects()
  }, [activeTab])
  const items = projects.slice(0, 4)
  return (
    <section className="py-20 md:py-24 relative z-0 overflow-hidden bg-theme">
      <Tiles rows={10} cols={16} />
      <FlickeringGrid squareSize={4} gridGap={6} flickerChance={0.3} color="rgb(139, 92, 246)" maxOpacity={0.3} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary mb-5">
            <div className="bg-theme-card border border-theme rounded-2xl px-3 py-1"><span className="text-xs font-semibold uppercase tracking-wider">Ilkom Gallery</span></div>
            <p className="pr-3 text-xs text-theme-muted">Proyek Mahasiswa</p>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 font-header"><Text_03 text="ILKOM Gallery" className="section-gradient-text" /></h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full mb-5" />
          <p className="text-theme-muted text-base max-w-2xl mx-auto">Galeri karya dan proyek mahasiswa Fakultas Ilmu Komputer</p>
        </motion.div>
        <div className="flex justify-center mb-8"><SmoothTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} /></div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={container} initial="hidden" animate="show" exit={{ opacity: 0, y: -12 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading ? Array.from({ length: 4 }).map((_, i) => (<motion.div key={i} variants={itemVariant}><div className="h-64 rounded-xl bg-theme-secondary animate-pulse" /></motion.div>))
            : error ? <div className="col-span-full text-center py-10"><p className="text-theme-muted text-sm">{error}</p></div>
            : items.length === 0 ? <div className="col-span-full text-center py-10"><p className="text-theme-muted text-sm">Belum ada proyek di kategori ini</p></div>
            : items.map((project, i) => (<motion.div key={project.id || i} variants={itemVariant}><GlowCard glowColor="purple" className="rounded-2xl"><ProjectExpandableCard project={project} /></GlowCard></motion.div>))}
          </motion.div>
        </AnimatePresence>
        <div className="text-center mt-10"><Link to="/ilkomgallery"><FlowButton text="Lihat Semua Proyek" /></Link></div>
      </div>
    </section>
  )
}
export default IlkomGallery

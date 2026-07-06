import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Smartphone, Palette, Gamepad2, Sparkles, Filter } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import ProjectExpandableCard from '../components/cards/ProjectExpandableCard'
import { GlowCard } from '../components/ui/GlowCard'
import { PageHeader } from '../components/ui/PageHeader'
import EmptyResults from '../components/ui/EmptyResults'
import { SmoothTabs } from '../components/ui/SmoothTabs'
import ExpandingSearchDock from '../components/shared/ExpandingSearchDock'
import AnimatedFilterDropdown from '../components/shared/AnimatedFilterDropdown'
import { PageBackground } from '../components/ui/PageBackground'
import { projectsService } from '../services/api'

const TABS = [
  { id: 'web', label: 'Pengembangan Web', icon: Globe },
  { id: 'mobile', label: 'Aplikasi Mobile', icon: Smartphone },
  { id: 'uiux', label: 'Desain UI/UX', icon: Palette },
  { id: 'game', label: 'Pengembangan Game', icon: Gamepad2 },
  { id: 'ai', label: 'AI / Lainnya', icon: Sparkles },
]

const SORT_OPTIONS = ['Terbaru', 'Terlama', 'Terpopuler']

import { container, itemVariant } from '../lib/animations'

const IlkomGalleryPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('web')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Terbaru')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')
    if (tabParam && TABS.some(t => t.id === tabParam)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tabParam)
      localStorage.setItem('lastGalleryTab', tabParam)
    } else {
      const saved = localStorage.getItem('lastGalleryTab')
      if (saved && TABS.some(t => t.id === saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveTab(saved)
        navigate(`/ilkomgallery?tab=${saved}`, { replace: true })
      }
    }
  }, [location.search, navigate])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    projectsService.getAll({ category: activeTab })
      .then(res => setProjects(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [activeTab])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, activeTab])

  const handleTabChange = (id) => {
    setActiveTab(id)
    localStorage.setItem('lastGalleryTab', id)
    navigate(`/ilkomgallery?tab=${id}`, { replace: true })
  }

  const filtered = useMemo(() => projects
    .filter(p => {
      if (!searchQuery) return true
      const s = searchQuery.toLowerCase()
      return p.title?.toLowerCase().includes(s) || p.creator_name?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s)
    })
    .sort((a, b) => {
      if (sortBy === 'Terlama') return new Date(a.created_at) - new Date(b.created_at)
      if (sortBy === 'Terpopuler') return (b.views || 0) - (a.views || 0)
      return new Date(b.created_at) - new Date(a.created_at)
    }), [projects, searchQuery, sortBy])

  return (
    <PageBackground>
      <div className="min-h-screen relative z-0 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <Breadcrumb />

          <PageHeader
            badge={
              <>
                <div className="bg-theme-card border border-theme rounded-2xl px-3 py-1"><span className="text-xs font-semibold uppercase tracking-wider">Proyek Mahasiswa</span></div>
                <p className="pr-3 text-xs text-theme-muted">Galeri</p>
              </>
            }
            title="ILKOM Gallery"
            subtitle="Galeri karya dan proyek mahasiswa Fakultas Ilmu Komputer"
            textStyle="gradient"
          />

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <SmoothTabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-3 flex-wrap justify-center mb-6">
            <ExpandingSearchDock value={searchQuery} onChange={setSearchQuery} placeholder="Cari project, creator..." />
            <AnimatedFilterDropdown options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} icon={Filter} />
          </div>

          {/* Count */}
          <div className="flex items-center gap-2 mb-4">
            <p className="text-theme-muted text-sm">
              <span className="font-semibold text-accent">{filtered.length}</span> project ditemukan
            </p>
          </div>

          {/* Projects Grid — same as homepage */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} variants={container} initial="hidden" animate="show" exit={{ opacity: 0, y: -12 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <motion.div key={i} variants={itemVariant}>
                    <div className="h-64 rounded-xl bg-theme-secondary animate-pulse" />
                  </motion.div>
                ))
              ) : filtered.length === 0 ? (
                <EmptyResults
                  icon={<Globe size={40} className="text-accent" />}
                  title="Tidak ada project yang ditemukan"
                  description="Coba ubah filter atau cari dengan kata kunci lain"
                  onReset={() => { handleTabChange('web'); setSearchQuery('') }}
                />
              ) : (
                filtered.map((project, _i) => (
                  <motion.div key={project.id || _i} variants={itemVariant}>
                    <GlowCard glowColor="purple" className="rounded-2xl">
                      <ProjectExpandableCard project={project} />
                    </GlowCard>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageBackground>
  )
}

export default IlkomGalleryPage

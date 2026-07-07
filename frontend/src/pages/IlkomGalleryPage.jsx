import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Smartphone, Palette, Gamepad2, Sparkles, Filter, Tag } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import ProjectExpandableCard from '../components/cards/ProjectExpandableCard'
import { GlowCard } from '../components/ui/GlowCard'
import { PageHeader } from '../components/ui/PageHeader'
import EmptyResults from '../components/ui/EmptyResults'
import { SmoothTabs } from '../components/ui/SmoothTabs'
import ExpandingSearchDock from '../components/shared/ExpandingSearchDock'
import AnimatedFilterDropdown from '../components/shared/AnimatedFilterDropdown'
import { PageBackground } from '../components/ui/PageBackground'
import { parseTags } from '../utils/parsers'
import { projectsService } from '../services/api'

const TABS = [
  { id: 'web', label: 'Pengembangan Web', icon: Globe },
  { id: 'mobile', label: 'Aplikasi Mobile', icon: Smartphone },
  { id: 'uiux', label: 'Desain UI/UX', icon: Palette },
  { id: 'game', label: 'Pengembangan Game', icon: Gamepad2 },
  { id: 'ai', label: 'AI / Lainnya', icon: Sparkles },
]

const SORT_OPTIONS = ['Terbaru', 'Terlama', 'Terpopuler']
const ITEMS_PER_PAGE = 8

import { container, itemVariant } from '../lib/animations'

const IlkomGalleryPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('web')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Terbaru')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState('Semua')

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
    projectsService.getAll(activeTab === 'all' ? {} : { category: activeTab })
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

  const uniqueTags = useMemo(() => [...new Set(projects.flatMap(p => parseTags(p.tags || [])))], [projects])
  const TAG_OPTIONS = useMemo(() => ['Semua', ...uniqueTags], [uniqueTags])

  const filtered = useMemo(() => projects
    .filter(p => {
      if (!searchQuery) return true
      const s = searchQuery.toLowerCase()
      return p.title?.toLowerCase().includes(s) || p.creator_name?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s)
    })
    .filter(p => selectedTag === 'Semua' || parseTags(p.tags || []).includes(selectedTag))
    .sort((a, b) => {
      if (sortBy === 'Terlama') return new Date(a.created_at) - new Date(b.created_at)
      if (sortBy === 'Terpopuler') return (b.views || 0) - (a.views || 0)
      return new Date(b.created_at) - new Date(a.created_at)
    }), [projects, searchQuery, sortBy])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, sortBy, searchQuery, selectedTag])

  return (
    <PageBackground>
      <div className="min-h-screen relative z-0 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <Breadcrumb />

          <PageHeader
            badge={
              <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary">
                <div className="bg-theme-card border border-theme rounded-2xl px-3 py-1"><span className="text-xs font-semibold uppercase tracking-wider">Proyek Mahasiswa</span></div>
                <p className="pr-3 text-xs text-theme-muted">Galeri</p>
              </div>
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
            {TAG_OPTIONS.length > 1 && (
              <AnimatedFilterDropdown options={TAG_OPTIONS} value={selectedTag} onChange={setSelectedTag} icon={Tag} />
            )}
          </div>

          {/* Count */}
          <div className="flex items-center gap-2 mb-4">
            <p className="text-theme-muted text-sm">
              <span className="font-semibold text-accent">{filtered.length}</span> project ditemukan
            </p>
          </div>

          {/* Projects Grid — same as homepage */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab + currentPage + selectedTag} variants={container} initial="hidden" animate="show" exit={{ opacity: 0, y: -12 }} className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <motion.div key={i} variants={itemVariant}>
                    <div className="h-64 rounded-xl bg-theme-secondary animate-pulse" />
                  </motion.div>
                ))
              ) : paginatedItems.length === 0 ? (
                <EmptyResults
                  icon={<Globe size={40} className="text-accent" />}
                  title="Tidak ada project yang ditemukan"
                  description="Coba ubah filter atau cari dengan kata kunci lain"
                  onReset={() => { handleTabChange('all'); setSearchQuery(''); setSelectedTag('Semua') }}
                />
              ) : (
                paginatedItems.map((project, _i) => (
                  <motion.div key={project.id || _i} variants={itemVariant}>
                    <GlowCard glowColor="purple" className="rounded-2xl">
                      <ProjectExpandableCard project={project} />
                    </GlowCard>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--accent)]/10 transition-colors"
              >
                <ChevronLeft size={18} className="text-[var(--accent)]" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                    currentPage === page
                      ? 'bg-[var(--accent)] text-white shadow-md'
                      : 'border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-[var(--accent)]/10'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--accent)]/10 transition-colors"
              >
                <ChevronRight size={18} className="text-[var(--accent)]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </PageBackground>
  )
}

export default IlkomGalleryPage

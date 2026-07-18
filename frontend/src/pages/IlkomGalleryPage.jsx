import { useState, useEffect, useMemo, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Smartphone, Palette, Gamepad2, Sparkles, Filter, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import ProjectExpandableCard from '../components/cards/ProjectExpandableCard'
import { GlowCard } from '../components/ui/GlowCard'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionPill } from '../components/ui/SectionPill'
import EmptyResults from '../components/ui/EmptyResults'
import { SmoothTabs } from '../components/ui/SmoothTabs'
import ExpandingSearchDock from '../components/shared/ExpandingSearchDock'
import AnimatedFilterDropdown from '../components/shared/AnimatedFilterDropdown'
import { PageBackground } from '../components/ui/PageBackground'
import { parseTags } from '../utils/parsers'
import { projectsService } from '../services/api'

const TABS = [
  { id: 'all', label: 'Semua', icon: Sparkles },
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
  const [activeTab, setActiveTab] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Terbaru')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState('Semua')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')
    if (tabParam && TABS.some(t => t.id === tabParam)) {
      setActiveTab(tabParam)
      localStorage.setItem('lastGalleryTab', tabParam)
    } else {
      const saved = localStorage.getItem('lastGalleryTab')
      if (saved && TABS.some(t => t.id === saved)) {
        setActiveTab(saved)
        navigate(`/ilkomgallery?tab=${saved}`, { replace: true })
      }
    }
  }, [location.search, navigate])

  const fetchProjects = useCallback(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    projectsService.getAll(activeTab === 'all' ? {} : { category: activeTab }, { signal: controller.signal })
      .then(res => {
        const data = Array.isArray(res) ? res : (res?.data ?? res?.projects ?? [])
        setProjects(data)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Gagal memuat proyek')
          // Do NOT clear projects — keep stale data visible and surface
          // the error in the UI with a "Muat ulang" button instead.
        }
      })
      .finally(() => setLoading(false))
    return controller
  }, [activeTab])

  useEffect(() => {
    const controller = fetchProjects()
    return () => controller.abort()
  }, [fetchProjects])

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
    }), [projects, searchQuery, sortBy, selectedTag])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, sortBy, searchQuery, selectedTag])

  return (
    <PageBackground>
      <div className="min-h-screen relative z-0 pt-6 pb-20 bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(122,71,166,0.10),transparent_60%),linear-gradient(180deg,#fafafa_0%,#f3eef9_100%)] dark:bg-[radial-gradient(1000px_500px_at_15%_-10%,rgba(122,71,166,0.18),transparent_55%),radial-gradient(900px_500px_at_85%_110%,rgba(170,120,225,0.12),transparent_60%),linear-gradient(180deg,#08070b_0%,#0a090f_50%,#07060a_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <Breadcrumb />

          <PageHeader
            badge={<SectionPill label="Proyek Mahasiswa" caption="Galeri" />}
            title="ILKOM Gallery"
            subtitle="Galeri karya dan proyek mahasiswa Fakultas Ilmu Komputer"
            textStyle="gradient"
          />

          {/* Tabs */}
          <div className="flex justify-center mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
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
            <motion.div key={activeTab + currentPage + selectedTag} variants={container} initial="hidden" animate="show" exit={{ opacity: 0, y: -12 }}              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <motion.div key={i} variants={itemVariant}>
                    <div className="h-64 rounded-xl bg-theme-secondary animate-pulse" />
                  </motion.div>
                ))
              ) : error ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-sm text-red-500 mb-3">{error}</p>
                  <button onClick={() => { setError(''); fetchProjects() }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-all">Muat ulang</button>
                </div>
              ) : paginatedItems.length === 0 ? (
                <EmptyResults
                  icon={<Globe size={40} className="text-accent" />}
                  title="Tidak ada project yang ditemukan"
                  description="Coba ubah filter atau cari dengan kata kunci lain"
                  onReset={() => { handleTabChange('all'); setSearchQuery(''); setSelectedTag('Semua') }}
                />
              ) : (
                paginatedItems.map((project, _i) => (
                  <motion.div key={project.id || _i} variants={itemVariant} className="min-w-0">
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
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-800/80 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--accent)]/10 transition-colors"
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
                      : 'border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-[var(--accent)]/10'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-800/80 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--accent)]/10 transition-colors"
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

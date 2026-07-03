import { useState, useEffect } from 'react'
import Breadcrumb from '../components/common/Breadcrumb'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ArticleCard from '../components/articles/ArticleCard'
import { AnimatedTabs } from '../components/ui/AnimatedTabs'
import { PageHeader } from '../components/ui/PageHeader'
import { Tiles } from '../components/ui/Tiles'
import { FlickeringGrid } from '../components/ui/FlickeringGrid'
import ExpandingSearchDock from '../components/shared/ExpandingSearchDock'
import AnimatedFilterDropdown from '../components/shared/AnimatedFilterDropdown'
import { mockNews } from '../services/api'
import { Newspaper, Filter } from 'lucide-react'

const parseTags = (tags) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags.map(t => String(t).trim()).filter(Boolean)
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags)
      if (Array.isArray(parsed)) return parsed.map(t => String(t).trim()).filter(Boolean)
    } catch {}
    return tags.split(',').map(t => t.trim()).filter(Boolean)
  }
  return []
}

const NEWS_CATEGORIES = [
  { id: 'all', label: 'Semua Berita', icon: Newspaper },
  { id: 'Workshop', label: 'Workshop', icon: Newspaper },
  { id: 'Kompetisi', label: 'Kompetisi', icon: Newspaper },
  { id: 'Pelatihan', label: 'Pelatihan', icon: Newspaper },
  { id: 'Seminar', label: 'Seminar', icon: Newspaper },
]

const SORT_OPTIONS = ['Terbaru', 'Terlama', 'Terpopuler']

const NewsPage = () => {
  const [allNews, setAllNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Terbaru')
  const [selectedTag, setSelectedTag] = useState('all')

  useEffect(() => {
    mockNews.getAll()
      .then(res => setAllNews(Array.isArray(res) ? res : (res.data || [])))
      .catch(() => setAllNews([]))
      .finally(() => setLoading(false))
  }, [])

  const uniqueTags = [...new Set(allNews.flatMap(item => parseTags(item.tags)))]

  const filtered = allNews
    .filter(n => activeTab === 'all' || n.category === activeTab)
    .filter(n => selectedTag === 'all' || parseTags(n.tags).includes(selectedTag))
    .filter(n => {
      if (!searchQuery) return true
      const s = searchQuery.toLowerCase()
      return n.title?.toLowerCase().includes(s) || n.author?.toLowerCase().includes(s) || n.summary?.toLowerCase().includes(s)
    })
    .sort((a, b) => {
      if (sortBy === 'Terlama') return new Date(a.date) - new Date(b.date)
      if (sortBy === 'Terpopuler') return (b.views || 0) - (a.views || 0)
      return new Date(b.date) - new Date(a.date)
    })

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-transparent relative z-0 pt-24 pb-12">
      <FlickeringGrid squareSize={4} gridGap={6} flickerChance={0.3} color="rgb(139, 92, 246)" />
      <Tiles rows={10} cols={16} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/20 dark:bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />

        <PageHeader
          badge={
            <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary">
              <div className="bg-card border border-theme rounded-2xl px-3 py-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Berita Terkini</span>
              </div>
              <p className="pr-3 text-xs text-theme-muted">Terbaru</p>
            </div>
          }
          title="Berita Terkini"
          subtitle="Informasi terbaru seputar kegiatan mahasiswa, event, dan perkembangan teknologi di Fakultas Ilmu Komputer"
        />

        {/* Tag Filter */}
        {uniqueTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button onClick={() => setSelectedTag('all')} className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${selectedTag === 'all' ? 'bg-purple-600 text-white' : 'bg-theme-secondary text-theme-muted hover:text-theme-primary'}`}>Semua</button>
            {uniqueTags.map(tag => (
              <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${selectedTag === tag ? 'bg-purple-600 text-white' : 'bg-theme-secondary text-theme-muted hover:text-theme-primary'}`}>#{tag}</button>
            ))}
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-6 flex justify-center">
          <AnimatedTabs tabs={NEWS_CATEGORIES} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-6">
          <ExpandingSearchDock value={searchQuery} onChange={setSearchQuery} placeholder="Cari berita, penulis..." />
          <AnimatedFilterDropdown options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} icon={Filter} />
        </div>

        {/* Count */}
        <div className="flex items-center gap-2 mb-4">
          <p className="text-theme-muted text-sm">
            <span className="font-semibold text-accent">{filtered.length}</span> berita ditemukan
          </p>
        </div>

        {/* News Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-theme-secondary rounded-2xl border border-theme">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-4">
              <Newspaper size={40} className="text-accent" />
            </div>
            <p className="text-theme-primary text-lg font-medium">Tidak ada berita yang ditemukan</p>
            <p className="text-theme-muted text-sm mt-1">Coba ubah filter atau cari dengan kata kunci lain</p>
            <button onClick={() => { setActiveTab('all'); setSearchQuery(''); setSortBy('Terbaru'); setSelectedTag('all') }} className="mt-4 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium hover:bg-accent/20 transition-colors">
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsPage

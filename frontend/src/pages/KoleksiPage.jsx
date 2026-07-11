import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Heart, Eye, FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProjectExpandableCard from '../components/cards/ProjectExpandableCard'
import NewsExpandableCard from '../components/cards/NewsExpandableCard'
import { Text_03 } from '../components/ui/Text03'
import { PageBackground } from '../components/ui/PageBackground'
import { getAllItems } from '../services/interactions'

const ITEMS_PER_PAGE = 8

const TABS = [
  { id: 'all', label: 'Semua', icon: FolderOpen },
  { id: 'viewed', label: 'Dilihat', icon: Eye },
  { id: 'liked', label: 'Disukai', icon: Heart },
  { id: 'saved', label: 'Disimpan', icon: Bookmark },
]

const TYPE_TABS = [
  { id: 'all', label: 'Semua' },
  { id: 'project', label: 'Proyek' },
  { id: 'news', label: 'Berita' },
]

const KoleksiPage = () => {
  const [items, setItems] = useState([])
  const [activeTab, setActiveTab] = useState('saved')
  const [activeType, setActiveType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Load items from localStorage on mount
  useEffect(() => {
    const loadItems = () => {
      const allItems = getAllItems()
      setItems(allItems)
    }
    
    loadItems()
    
    // Listen for storage changes (from other tabs)
    const handleStorageChange = () => loadItems()
    window.addEventListener('storage', handleStorageChange)
    
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Filter items based on active tab and type
  const filteredItems = items.filter(item => {
    // Filter by status - only show items that match the criteria
    if (activeTab === 'viewed' && !item.viewed) return false
    if (activeTab === 'liked' && !item.liked) return false
    if (activeTab === 'saved' && !item.saved) return false
    if (activeTab === 'all') {
      // Show items that have been viewed, liked, or saved
      if (!item.viewed && !item.liked && !item.saved) return false
    }

    // Filter by type
    if (activeType !== 'all' && item.type !== activeType) return false

    return true
  })

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const counts = {
    all: items.filter(i => i.viewed || i.liked || i.saved).length,
    viewed: items.filter(i => i.viewed).length,
    liked: items.filter(i => i.liked).length,
    saved: items.filter(i => i.saved).length,
  }

  // Check if item has required data to render a card
  const hasRequiredData = (item) => {
    return item && (item.title || item.id)
  }

  return (
    <PageBackground>
      <div className="min-h-screen relative z-0 pt-6 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 font-header">
              <Text_03 text="Koleksi Saya" className="section-gradient-text" />
            </h1>
            <div className="w-20 h-0.5 mx-auto rounded-full mb-5" style={{ background: 'linear-gradient(to right, rgb(48,11,85), rgb(122,71,166))' }} />
            <p className="text-theme-muted text-base max-w-2xl mx-auto">
              Artikel dan proyek yang telah Anda lihat, sukai, atau simpan
            </p>
          </motion.div>

          {/* Status tabs */}
          <div className="flex justify-center gap-2 mb-4 overflow-x-auto tabs-scroll pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setCurrentPage(1) }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                    activeTab === tab.id
                      ? 'bg-[var(--accent)] text-white shadow-md'
                      : 'bg-theme-secondary text-theme-muted hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                  {counts[tab.id] > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    }`}>
                      {counts[tab.id]}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Type filter */}
          <div className="flex justify-center gap-2 mb-8 overflow-x-auto tabs-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
            {TYPE_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveType(tab.id); setCurrentPage(1) }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 ${
                  activeType === tab.id
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
                    : 'text-theme-muted hover:text-[var(--accent)] hover:bg-[var(--accent)]/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {paginatedItems.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl">
              <Bookmark size={48} className="mx-auto mb-4 text-theme-muted" />
              <p className="text-theme-muted text-lg">Belum ada koleksi</p>
              <p className="text-theme-muted text-sm mt-2">
                {activeTab === 'viewed' ? 'Klik kartu untuk melihat konten' :
                 activeTab === 'liked' ? 'Suka konten untuk mengumpulkannya di sini' :
                 activeTab === 'saved' ? 'Simpan konten untuk mengumpulkannya di sini' :
                 'Jelajahi konten untuk mengumpulkannya di sini'}
              </p>
              <Link to="/news" className="mt-4 inline-block hover:opacity-80 transition-opacity" style={{ color: 'var(--accent)' }}>
                Jelajahi Berita
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {paginatedItems.filter(hasRequiredData).map(item => (
                  <div key={`${item.type}-${item.id}`} className="relative">
                    {item.type === 'project' ? (
                      <ProjectExpandableCard project={item} />
                    ) : (
                      <NewsExpandableCard article={item} />
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-colors duration-150 ${
                        currentPage === page
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-theme-secondary text-theme-muted hover:text-[var(--accent)] hover:bg-[var(--accent)]/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageBackground>
  )
}

export default KoleksiPage

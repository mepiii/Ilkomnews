import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProjectExpandableCard from '../components/cards/ProjectExpandableCard'
import NewsExpandableCard from '../components/cards/NewsExpandableCard'
import { Text_03 } from '../components/ui/Text03'
import { PageBackground } from '../components/ui/PageBackground'

const ITEMS_PER_PAGE = 8

const KoleksiPage = () => {
  const [savedItems, setSavedItems] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_items') || '[]')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedItems(saved)
  }, [])

  const filteredItems = activeTab === 'all'
    ? savedItems
    : savedItems.filter(item => item.type === activeTab)

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const removeItem = (id) => {
    const updated = savedItems.filter(item => item.id !== id)
    setSavedItems(updated)
    localStorage.setItem('saved_items', JSON.stringify(updated))
  }

  return (
    <PageBackground>
      <div className="min-h-screen relative z-0 pt-24 pb-12">
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
            <div className="w-20 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full mb-5" />
            <p className="text-theme-muted text-base max-w-2xl mx-auto">
              Artikel dan proyek yang telah Anda sukai, simpan, atau lihat
            </p>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {['all', 'project', 'news'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1) }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'bg-theme-secondary text-theme-muted hover:text-theme-primary'
                }`}
              >
                {tab === 'all' ? 'Semua' : tab === 'project' ? 'Proyek' : 'Berita'}
              </button>
            ))}
          </div>

          {paginatedItems.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl">
              <Bookmark size={48} className="mx-auto mb-4 text-theme-muted" />
              <p className="text-theme-muted text-lg">Belum ada koleksi</p>
              <p className="text-theme-muted text-sm mt-2">Sukai, simpan, atau lihat konten untuk mengumpulkannya di sini</p>
              <Link to="/ilkomgallery" className="mt-4 inline-block text-purple-600 hover:text-purple-700">
                Jelajahi Galeri
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {paginatedItems.map(item => (
                  <div key={item.id} className="relative">
                    {item.type === 'project' ? (
                      <ProjectExpandableCard project={item} />
                    ) : (
                      <NewsExpandableCard article={item} />
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 z-10 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
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
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-purple-600 text-white'
                          : 'bg-theme-secondary text-theme-muted hover:text-theme-primary'
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

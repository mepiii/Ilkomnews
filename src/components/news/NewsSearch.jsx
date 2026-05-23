import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../../utils/formatters'

const NewsSearch = ({ onSearch, onClose, isOpen }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const inputRef = useRef(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100)
    }
  }, [isOpen])

  // Handle search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true)
      try {
        // Mock search results
        const mockResults = [
          { id: 1, title: 'Workshop AI: Masa Depan Kecerdasan Buatan', category: 'Workshop', date: new Date(), slug: 'workshop-ai' },
          { id: 2, title: 'Lomba Programming Competition 2024', category: 'Kompetisi', date: new Date(), slug: 'lomba-programming' },
          { id: 3, title: 'Web Development Bootcamp Batch 3', category: 'Pelatihan', date: new Date(), slug: 'web-dev-bootcamp' },
        ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
        
        setResults(mockResults)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  const saveRecentSearch = (searchQuery) => {
    if (!searchQuery.trim()) return
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return
    saveRecentSearch(searchQuery)
    onSearch(searchQuery)
    onClose()
  }

  const removeRecentSearch = (searchToRemove) => {
    const updated = recentSearches.filter(s => s !== searchToRemove)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const clearAllRecent = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in-scale">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="Cari berita, artikel, event..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-gray hover:text-primary"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size={32} className="animate-spin text-secondary" />
            </div>
          ) : query.length >= 2 ? (
            results.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    to={`/news/${result.slug || result.id}`}
                    onClick={onClose}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-semibold text-primary mb-1">{result.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-text-gray">
                      <span className="bg-accent/20 text-primary px-2 py-0.5 rounded">
                        {result.category}
                      </span>
                      <span>{formatRelativeTime(result.date)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-gray">Tidak ditemukan hasil untuk "{query}"</p>
                <p className="text-sm text-text-gray mt-1">Coba gunakan kata kunci lain</p>
              </div>
            )
          ) : (
            recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-text-gray">Pencarian Terbaru</span>
                  <button
                    onClick={clearAllRecent}
                    className="text-xs text-secondary hover:text-accent"
                  >
                    Hapus semua
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(search)
                        handleSearch(search)
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors group"
                    >
                      <span>{search}</span>
                      <X
                        size={14}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeRecentSearch(search)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {/* Search Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-center text-xs text-text-gray">
          Tekan Enter untuk mencari • {results.length} hasil ditemukan
        </div>
      </div>
    </div>
  )
}

export default NewsSearch
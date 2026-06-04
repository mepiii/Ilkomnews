import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, Filter, Calendar, TrendingUp, Sparkles, ChevronRight, X, 
  SlidersHorizontal, Clock, Wrench, Trophy, BookOpen, Mic, 
  Megaphone, CalendarRange, CalendarDays, CalendarCheck 
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { mockNews } from '../services/api'
import { generateSlug, formatDate } from '../utils/formatters'

const NewsPage = () => {
  const [news, setNews] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ category: 'all', dateRange: 'all' })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const filterRef = useRef(null)

  const categories = [
    { value: 'all', label: 'Semua Kategori', icon: null },
    { value: 'Workshop', label: 'Workshop', icon: Wrench },
    { value: 'Kompetisi', label: 'Kompetisi', icon: Trophy },
    { value: 'Pelatihan', label: 'Pelatihan', icon: BookOpen },
    { value: 'Seminar', label: 'Seminar', icon: Mic },
    { value: 'Pengumuman', label: 'Pengumuman', icon: Megaphone },
  ]

  const dateRangeOptions = [
    { value: 'all', label: 'Semua Waktu', icon: CalendarRange },
    { value: 'week', label: 'Minggu Ini', icon: CalendarDays },
    { value: 'month', label: 'Bulan Ini', icon: Calendar },
    { value: 'year', label: 'Tahun Ini', icon: CalendarCheck },
  ]

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await mockNews.getAll()
        setNews(data)
        setFilteredNews(data)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  useEffect(() => {
    let filtered = [...news]
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category)
    }
    
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      if (filters.dateRange === 'week') {
        filterDate.setDate(now.getDate() - 7)
        filtered = filtered.filter(item => new Date(item.date) >= filterDate)
      } else if (filters.dateRange === 'month') {
        filterDate.setMonth(now.getMonth() - 1)
        filtered = filtered.filter(item => new Date(item.date) >= filterDate)
      } else if (filters.dateRange === 'year') {
        filterDate.setFullYear(now.getFullYear() - 1)
        filtered = filtered.filter(item => new Date(item.date) >= filterDate)
      }
    }
    
    setFilteredNews(filtered)
  }, [filters, news, searchQuery])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const clearAllFilters = () => {
    handleFilterChange({ category: 'all', dateRange: 'all' })
    setSearchQuery('')
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category !== 'all') count++
    if (filters.dateRange !== 'all') count++
    if (searchQuery) count++
    return count
  }

  // Click outside to close filter
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-purple-50/20 to-white">
      
      {/* Background Pattern Futuristik */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(0deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:25px_25px]"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(115deg, rgba(139,92,246,0.02) 0px, rgba(139,92,246,0.02) 1px, transparent 1px, transparent 40px)`
        }}></div>
      </div>
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/20 rounded-full blur-3xl"></div>
      
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Breadcrumb */}
        <Breadcrumb />
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-5 border border-purple-200 shadow-sm">
            <TrendingUp size={14} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Latest News</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Berita <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Terkini</span>
          </h1>
          
          <div className="w-20 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full mb-5"></div>
          
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Informasi terbaru seputar kegiatan mahasiswa, event, dan perkembangan teknologi di Fakultas Ilmu Komputer
          </p>
        </div>

        {/* Search & Filter Bar - Enhanced */}
        <div className="mb-10">
          {/* Main Search Bar */}
          <div className="relative">
            <div className={`
              flex items-center gap-3 p-1.5 bg-white rounded-2xl shadow-lg transition-all duration-300
              ${isSearchFocused ? 'ring-2 ring-purple-400 shadow-purple-100' : 'ring-1 ring-gray-200'}
            `}>
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isSearchFocused ? 'text-purple-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Cari berita berdasarkan judul, kategori, atau konten..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent rounded-xl outline-none text-gray-800 placeholder:text-gray-400 text-sm sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              
              {/* Divider */}
              <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
              
              {/* Filter Button with Badge */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                    ${getActiveFiltersCount() > 0 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <SlidersHorizontal size={18} />
                  <span className="hidden sm:inline">Filter</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-white text-purple-600 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
                
                {/* Filter Dropdown - Modern Design */}
                {isFilterOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-purple-100 z-30 overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                      <div className="flex items-center gap-2">
                        <Filter size={16} className="text-purple-600" />
                        <h3 className="font-semibold text-gray-800">Filter Berita</h3>
                      </div>
                      {getActiveFiltersCount() > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                          Reset Semua
                        </button>
                      )}
                    </div>
                    
                    {/* Filter Content */}
                    <div className="p-5 space-y-6">
                      {/* Category Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Kategori</label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => {
                            const IconComponent = cat.icon
                            return (
                              <button
                                key={cat.value}
                                onClick={() => handleFilterChange({ ...filters, category: cat.value })}
                                className={`
                                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                                  ${filters.category === cat.value
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }
                                `}
                              >
                                {IconComponent && <IconComponent size={14} />}
                                {cat.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      
                      {/* Date Range Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Rentang Waktu</label>
                        <div className="grid grid-cols-2 gap-2">
                          {dateRangeOptions.map((option) => {
                            const IconComponent = option.icon
                            return (
                              <button
                                key={option.value}
                                onClick={() => handleFilterChange({ ...filters, dateRange: option.value })}
                                className={`
                                  inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                  ${filters.dateRange === option.value
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }
                                `}
                              >
                                {IconComponent && <IconComponent size={14} />}
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Active Filters Chips */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs text-gray-500">Filter aktif:</span>
              {filters.category !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  {categories.find(c => c.value === filters.category)?.label}
                  <button onClick={() => handleFilterChange({ ...filters, category: 'all' })} className="hover:text-purple-900 ml-0.5">×</button>
                </span>
              )}
              {filters.dateRange !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  {dateRangeOptions.find(o => o.value === filters.dateRange)?.label}
                  <button onClick={() => handleFilterChange({ ...filters, dateRange: 'all' })} className="hover:text-purple-900 ml-0.5">×</button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  Pencarian: {searchQuery.length > 20 ? searchQuery.substring(0, 20) + '...' : searchQuery}
                  <button onClick={() => setSearchQuery('')} className="hover:text-purple-900 ml-0.5">×</button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-gray-400 hover:text-purple-600 transition-colors ml-1"
              >
                Hapus semua
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">
            Menampilkan <span className="font-semibold text-purple-600">{filteredNews.length}</span> berita
          </p>
        </div>

        {/* News Grid - Full Image Cards */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada berita ditemukan</h3>
            <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian Anda</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {filteredNews.map((item) => (
              <Link
                key={item.id}
                to={`/news/${generateSlug(item.title)}`}
                className="group block"
              >
                <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-300">
                  
                  {/* FULL IMAGE Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100">
                    <img 
                      src={item.image || `https://picsum.photos/seed/news-${item.id}/600/800`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/seed/fallback-${item.id}/600/800`
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-purple-800/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
                        {item.category || 'Berita'}
                      </span>
                    </div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <h3 className="font-bold text-white text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-purple-200 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Calendar size={10} className="text-purple-300" />
                          <span className="text-white/80 text-[10px] sm:text-xs">{formatDate(item.date)}</span>
                        </div>
                        <span className="text-purple-300 text-[10px] sm:text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all group-hover:text-white">
                          Baca <ChevronRight size={10} />
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Accent Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default NewsPage
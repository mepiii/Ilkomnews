import React, { useState } from 'react'
import { Filter, Calendar, Tag, Search, ChevronDown, X } from 'lucide-react'

const NewsFilter = ({ onFilterChange, onSearch, categories, initialFilters = {} }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || 'all')
  const [dateRange, setDateRange] = useState(initialFilters.dateRange || 'all')
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])

  const dateRanges = [
    { value: 'all', label: 'Semua Waktu' },
    { value: 'today', label: 'Hari Ini' },
    { value: 'week', label: 'Minggu Ini' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'year', label: 'Tahun Ini' }
  ]

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    onFilterChange({ category, dateRange })
    updateActiveFilters('category', category)
  }

  const handleDateChange = (range) => {
    setDateRange(range)
    onFilterChange({ category: selectedCategory, dateRange: range })
    updateActiveFilters('date', range)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
    if (searchQuery) {
      updateActiveFilters('search', searchQuery)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    onSearch('')
    setActiveFilters(prev => prev.filter(f => f.type !== 'search'))
  }

  const updateActiveFilters = (type, value) => {
    if (value && value !== 'all') {
      const filterLabels = {
        category: { label: `Kategori: ${value}`, type: 'category' },
        date: { label: `Waktu: ${dateRanges.find(r => r.value === value)?.label}`, type: 'date' },
        search: { label: `Pencarian: ${value}`, type: 'search' }
      }
      
      if (filterLabels[type]) {
        setActiveFilters(prev => {
          const filtered = prev.filter(f => f.type !== type)
          if (value !== 'all' && value !== '') {
            return [...filtered, filterLabels[type]]
          }
          return filtered
        })
      }
    } else {
      setActiveFilters(prev => prev.filter(f => f.type !== type))
    }
  }

  const removeFilter = (type) => {
    if (type === 'category') {
      setSelectedCategory('all')
      onFilterChange({ category: 'all', dateRange })
    } else if (type === 'date') {
      setDateRange('all')
      onFilterChange({ category: selectedCategory, dateRange: 'all' })
    } else if (type === 'search') {
      handleClearSearch()
    }
    setActiveFilters(prev => prev.filter(f => f.type !== type))
  }

  const resetAllFilters = () => {
    setSelectedCategory('all')
    setDateRange('all')
    setSearchQuery('')
    onFilterChange({ category: 'all', dateRange: 'all' })
    onSearch('')
    setActiveFilters([])
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          placeholder="Cari berita berdasarkan judul atau konten..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-24 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
        />
        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-gray" />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={16} className="text-text-gray" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-1 px-3 py-1.5 bg-gray-100 rounded-lg text-primary"
          >
            <Filter size={16} />
            <span className="text-sm">Filter</span>
            <ChevronDown size={14} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            type="submit"
            className="hidden md:block px-4 py-1.5 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Cari
          </button>
        </div>
      </form>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-text-gray">Filter aktif:</span>
          {activeFilters.map((filter, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary rounded-md text-xs"
            >
              {filter.label}
              <button onClick={() => removeFilter(filter.type)} className="hover:text-primary">
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            onClick={resetAllFilters}
            className="text-xs text-text-gray hover:text-primary transition-colors"
          >
            Reset semua
          </button>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden md:flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <Tag size={18} className="text-secondary" />
          <span className="text-sm font-medium text-primary">Kategori:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              selectedCategory === 'all' 
                ? 'bg-secondary text-white shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedCategory === cat 
                  ? 'bg-secondary text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 ml-auto">
          <Calendar size={18} className="text-secondary" />
          <span className="text-sm font-medium text-primary">Waktu:</span>
        </div>
        
        <select 
          value={dateRange}
          onChange={(e) => handleDateChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
        >
          {dateRanges.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 md:hidden">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Kategori</label>
            <select 
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Waktu</label>
            <select 
              value={dateRange}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={resetAllFilters}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-primary text-sm"
            >
              Reset Filter
            </button>
            <button
              onClick={() => {
                onSearch(searchQuery)
                setShowFilters(false)
              }}
              className="flex-1 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsFilter
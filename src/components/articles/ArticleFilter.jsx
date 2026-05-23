import React, { useState } from 'react'
import { Filter, Search, ChevronDown } from 'lucide-react'

const ArticleFilter = ({ onFilterChange, categories, onSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    onFilterChange({ category, sortBy })
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
    onFilterChange({ category: selectedCategory, sortBy: sort })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const sortOptions = [
    { value: 'latest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'popular', label: 'Terpopuler' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 md:max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray" />
          </div>
        </form>

        {/* Filter Toggle Mobile */}
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg"
        >
          <Filter size={18} />
          <span>Filter</span>
          <ChevronDown size={18} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-secondary" />
            <span className="text-sm font-medium text-primary">Filter:</span>
          </div>
          
          <select 
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 md:hidden">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Kategori</label>
            <select 
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Urutkan</label>
            <select 
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticleFilter
import React, { useState } from 'react'
import { Filter, Calendar, MapPin, Search, ChevronDown } from 'lucide-react'

const EventFilter = ({ onFilterChange, onSearch, categories, locations }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const months = [
    { value: 'all', label: 'Semua Bulan' },
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ]

  const handleFilterChange = (type, value) => {
    if (type === 'category') setSelectedCategory(value)
    if (type === 'location') setSelectedLocation(value)
    if (type === 'month') setSelectedMonth(value)
    
    onFilterChange({
      category: type === 'category' ? value : selectedCategory,
      location: type === 'location' ? value : selectedLocation,
      month: type === 'month' ? value : selectedMonth
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const resetFilters = () => {
    setSelectedCategory('all')
    setSelectedLocation('all')
    setSelectedMonth('all')
    setSearchQuery('')
    onFilterChange({ category: 'all', location: 'all', month: 'all' })
    onSearch('')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 md:max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari event..."
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

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="hidden md:block text-sm text-text-gray hover:text-primary transition-colors"
        >
          Reset Filter
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Calendar size={18} className="text-secondary" />
          <span className="text-sm font-medium text-primary">Bulan:</span>
        </div>
        
        <select 
          value={selectedMonth}
          onChange={(e) => handleFilterChange('month', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          {months.map(month => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-secondary" />
          <span className="text-sm font-medium text-primary">Kategori:</span>
        </div>
        
        <select 
          value={selectedCategory}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="all">Semua Kategori</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          <MapPin size={18} className="text-secondary" />
          <span className="text-sm font-medium text-primary">Lokasi:</span>
        </div>
        
        <select 
          value={selectedLocation}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="all">Semua Lokasi</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 md:hidden">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Bulan</label>
            <select 
              value={selectedMonth}
              onChange={(e) => handleFilterChange('month', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Kategori</label>
            <select 
              value={selectedCategory}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Lokasi</label>
            <select 
              value={selectedLocation}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="all">Semua Lokasi</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="w-full bg-gray-100 text-primary py-2 rounded-lg text-sm font-medium"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  )
}

export default EventFilter
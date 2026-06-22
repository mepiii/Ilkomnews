import { useState, useMemo } from 'react'

export const useFilter = (items, initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = useMemo(() => {
    let result = [...items]

    // Apply search
    if (searchTerm) {
      result = result.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply custom filters
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'all') {
        result = result.filter(item => item[key] === filters[key])
      }
    })

    return result
  }, [items, filters, searchTerm])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
    setSearchTerm('')
  }

  return {
    filteredItems,
    filters,
    searchTerm,
    setSearchTerm,
    updateFilter,
    resetFilters
  }
}
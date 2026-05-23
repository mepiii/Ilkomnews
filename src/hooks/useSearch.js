import { useState, useCallback, useMemo } from 'react'

export const useSearch = (items, searchFields = ['title', 'summary']) => {
  const [query, setQuery] = useState('')

  const searchResults = useMemo(() => {
    if (!query.trim()) return items

    const searchLower = query.toLowerCase()
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field]
        return value && value.toLowerCase().includes(searchLower)
      })
    })
  }, [items, query, searchFields])

  const handleSearch = useCallback((newQuery) => {
    setQuery(newQuery)
  }, [])

  const clearSearch = useCallback(() => {
    setQuery('')
  }, [])

  return {
    query,
    searchResults,
    handleSearch,
    clearSearch,
    hasResults: searchResults.length > 0,
    resultCount: searchResults.length
  }
}
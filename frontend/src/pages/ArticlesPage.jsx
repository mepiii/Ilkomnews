import React, { useState, useEffect } from 'react'
import ArticleList from '../components/articles/ArticleList'
import ArticleFilter from '../components/articles/ArticleFilter'
import Breadcrumb from '../components/common/Breadcrumb'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { mockArticles } from '../services/api'

const ArticlesPage = () => {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ category: 'all', sortBy: 'latest' })
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['Pembelajaran', 'Tutorial', 'Opini', 'Review', 'Tips & Trik']

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await mockArticles.getAll()
        setArticles(data)
        setFilteredArticles(data)
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  useEffect(() => {
    let filtered = [...articles]
    
    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category)
    }
    
    // Search
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Sort
    if (filters.sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (filters.sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
    }
    
    setFilteredArticles(filtered)
  }, [filters, searchQuery, articles])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Artikel</h1>
        <p className="text-text-gray mt-1">Artikel menarik seputar teknologi dan ilmu komputer</p>
      </div>
      
      <ArticleFilter 
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        categories={categories}
      />
      
      {loading ? <LoadingSpinner /> : <ArticleList articles={filteredArticles} loading={loading} />}
    </div>
  )
}

export default ArticlesPage
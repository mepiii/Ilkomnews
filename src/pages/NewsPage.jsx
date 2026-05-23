import React, { useState, useEffect } from 'react'
import NewsList from '../components/news/NewsList'
import NewsFilter from '../components/news/NewsFilter'
import Breadcrumb from '../components/common/Breadcrumb'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { mockNews } from '../services/api'

const NewsPage = () => {
  const [news, setNews] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ category: 'all', dateRange: 'all' })

  const categories = ['Workshop', 'Kompetisi', 'Pelatihan', 'Seminar', 'Pengumuman']

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
  }, [filters, news])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] [background-size:24px_24px]" />
      
      {/* Decorative blur */}
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
      <div className="absolute top-32 right-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-8">
        <Breadcrumb />
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Berita Terkini</h1>
          <p className="text-text-gray mt-1">
            INFORMASI SEPUTAR FASILKOM DAN EDUKASI LAINNYA
          </p>
        </div>
        
        <NewsFilter 
          onFilterChange={handleFilterChange}
          categories={categories}
        />
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <NewsList news={filteredNews} loading={loading} />
        )}
      </div>
    </div>
  )
}

export default NewsPage
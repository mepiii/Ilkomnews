import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, BookOpen, Clock, User, Calendar, FileText, PenTool, Sparkles } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import { articlesService } from '../../services/api'

const TechArticles = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articlesService.getLatest(3)
        setArticles(data)
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  // Notebook colors dengan tema ungu
  const notebookColors = [
    'border-purple-200 bg-gradient-to-br from-white to-purple-50/30',
    'border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30',
    'border-violet-200 bg-gradient-to-br from-white to-violet-50/30',
  ]

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Terbaru'
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  // Get read time
  const getReadTime = (readTime) => {
    if (readTime) return readTime
    return `${Math.floor(Math.random() * 20) + 5} min read`
  }

  if (loading) return <LoadingSpinner />

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-1.5 mb-4">
            <PenTool size={16} className="text-purple-600" />
            <span className="text-purple-600 text-sm font-medium">Catatan</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a0533] mb-3">
            Artikel <span className="text-purple-600">Teknologi</span>
          </h2>
          <div className="w-20 h-1 bg-purple-600 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto">
            Catatan penelitian, eksperimen, dan tutorial dari lab kami
          </p>
        </div>

        {/* Articles Grid - Notebook Style (3 items only) */}
        {articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">Belum ada artikel</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, idx) => {
              const isHovered = hoveredId === article.id
              const notebookColor = notebookColors[idx % notebookColors.length]
              
              return (
                <div
                  key={article.id}
                  className="group"
                  onMouseEnter={() => setHoveredId(article.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Link to={`/articles/${article.id}`} className="block">
                    {/* Notebook Card */}
                    <div className={`relative bg-white rounded-lg border-l-8 ${notebookColor} shadow-md transition-all duration-300 ${isHovered ? 'shadow-xl -translate-y-1' : ''}`}>
                      
                      {/* Notebook Spiral Binding Effect */}
                      <div className="absolute -top-2 left-4 flex gap-2">
                        <div className="w-2 h-3 bg-gray-300 rounded-full"></div>
                        <div className="w-2 h-3 bg-gray-300 rounded-full"></div>
                        <div className="w-2 h-3 bg-gray-300 rounded-full"></div>
                        <div className="w-2 h-3 bg-gray-300 rounded-full"></div>
                      </div>
                      
                      {/* Corner Fold Effect */}
                      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-transparent to-gray-100 transform rotate-45 origin-top-right"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-5 pt-6">
                        {/* Header with Icon & Date */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <PenTool size={14} className="text-purple-600" />
                            </div>
                            <span className="text-xs text-purple-600 font-medium">{article.category || 'Artikel'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar size={10} />
                            <span>{formatDate(article.date)}</span>
                          </div>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-lg font-bold text-[#1a0533] mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {article.title}
                        </h3>
                        
                        {/* Summary / Abstract */}
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
                          {article.summary || article.content?.substring(0, 100) || 'Tidak ada deskripsi'}
                        </p>
                        
                        {/* Tags / Metadata */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Sparkles size={10} />
                            Tutorial
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Clock size={10} />
                            {getReadTime(article.readTime)}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <User size={10} />
                            {article.author || 'Penulis'}
                          </span>
                        </div>
                        
                        {/* Footer with Action */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-gray-100">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <FileText size={10} />
                            <span>Baca selengkapnya</span>
                          </div>
                          <div className="text-purple-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                            <span>Buka</span>
                            <ChevronRight size={12} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Page Number */}
                      <div className="text-right px-4 pb-2 text-xs text-gray-300 font-mono">
                        p. {String(idx + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            to="/articles" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group"
          >
            <BookOpen size={18} />
            <span>Lihat Semua Artikel</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

export default TechArticles
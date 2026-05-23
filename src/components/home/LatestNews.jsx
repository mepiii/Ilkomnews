import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Calendar, TrendingUp } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import { newsService } from '../../services/api'

const LatestNews = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  
  const sectionRef = useRef(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await newsService.getLatest(4)
        
        const data = response.data || response
        const newsData = Array.isArray(data) ? data : []
        
        setNews(newsData)
        setError(null)
      } catch (error) {
        console.error('Error fetching news:', error)
        setError(error.message || 'Gagal memuat berita')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  const formatDate = (date) => {
    if (!date) return 'Terbaru'
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-3xl border border-purple-100 shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} className="text-purple-600" />
            </div>
            <p className="text-gray-600 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (news.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-3xl border border-purple-100 shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} className="text-purple-600" />
            </div>
            <p className="text-gray-600 text-lg">Belum ada berita</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-20 md:py-24 bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Decorative Elements - More Subtle */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header - More Modern & Clean */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#1a0533] mb-4">
            Berita <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Terkini</span>
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mx-auto mb-5"></div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Informasi terbaru seputar kegiatan mahasiswa dan kampus
          </p>
        </div>

        {/* Grid - 2 kolom di mobile, 4 kolom di desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12">
          {news.map((item) => {
            const isHovered = hoveredId === item.id
            
            return (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="group block h-full"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Card - Tanpa transform, hanya border dan shadow */}
                <div className={`
                  relative bg-white rounded-2xl overflow-hidden 
                  border-2 transition-all duration-300 
                  h-full flex flex-col
                  ${isHovered 
                    ? 'border-purple-400 shadow-2xl shadow-purple-500/25' 
                    : 'border-purple-100 shadow-lg shadow-purple-500/5 hover:shadow-xl'
                  }
                `}>
                  
                  {/* Thumbnail - Clean gradient background */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50 flex-shrink-0">
                    <img 
                      src={item.image || `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/400/300`} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                      }}
                    />
                    
                    {/* Overlay Gradient - Subtle */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent"></div>
                    
                    {/* Category Badge - Modern Style */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white text-purple-600 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg border border-purple-100">
                        {item.category || 'Berita'}
                      </span>
                    </div>
                    
                    {/* Hover Overlay - Clean Design */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-t from-purple-600/90 via-purple-600/50 to-transparent
                      backdrop-blur-sm transition-all duration-300
                      flex items-center justify-center
                      ${isHovered ? 'opacity-100' : 'opacity-0'}
                    `}>
                      <div className="bg-white text-purple-600 text-xs md:text-sm font-bold px-3 md:px-5 py-2 md:py-2.5 rounded-full shadow-xl flex items-center gap-1.5 md:gap-2 transform transition-transform duration-300 scale-100 group-hover:scale-105">
                        <span>Baca Berita</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content - Better Spacing */}
                  <div className="p-3 md:p-5 lg:p-6 flex-1 flex flex-col">
                    {/* Title - Improved Typography */}
                    <div className="min-h-[40px] md:min-h-[48px] lg:min-h-[56px] mb-2 md:mb-3">
                      <h3 className="text-xs md:text-sm lg:text-base font-bold text-[#1a0533] line-clamp-2 leading-snug group-hover:text-purple-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    
                    {/* Meta Info - Calendar Only */}
                    <div className="mb-3 md:mb-4">
                      <div className="inline-flex items-center gap-1.5 bg-purple-50 px-2 md:px-2.5 py-1 rounded-lg">
                        <Calendar size={11} className="text-purple-600" />
                        <span className="font-semibold text-[10px] md:text-xs text-purple-700">{formatDate(item.date)}</span>
                      </div>
                    </div>
                    
                    {/* Divider - Gradient */}
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent my-2 md:my-3"></div>
                    
                    {/* Read More Link - Enhanced */}
                    <div className="mt-auto">
                      <span className="text-[10px] md:text-xs lg:text-sm text-purple-600 group-hover:text-indigo-600 transition-colors flex items-center gap-1 md:gap-1.5 font-bold">
                        Baca selengkapnya
                        <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>

                  {/* Decorative Corner Accent */}
                  <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button - More Prominent */}
        <div className="text-center">
          <Link 
            to="/news" 
            className="inline-flex items-center gap-2 px-6 md:px-8 lg:px-10 py-3 md:py-3.5 lg:py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-bold hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 group shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 text-sm md:text-base"
          >
            <span>Lihat Semua Berita</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
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

export default LatestNews
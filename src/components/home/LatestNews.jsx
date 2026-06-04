import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Calendar, TrendingUp, Zap, Sparkles, Globe, Newspaper, Bell, Radio } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import { newsService } from '../../services/api'
import { generateSlug } from '../../utils/formatters'

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
      } catch (err) {
        console.error('Error fetching news:', err)
        setError(err.message || 'Gagal memuat berita')
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

  const getImageSrc = (item) => {
    return item.image || `https://picsum.photos/seed/news-${item.id || item.title}/600/800`
  }

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200 shadow-xl">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200 shadow-xl">
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
    <section ref={sectionRef} className="py-20 md:py-24 bg-white relative overflow-hidden">
      {/* Pattern Futuristik */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(115deg, rgba(139, 92, 246, 0.06) 0px, rgba(139, 92, 246, 0.06) 1px, transparent 1px, transparent 40px)`,
          }}
        ></div>
      </div>

      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(139, 92, 246, 0.04) 0px, rgba(139, 92, 246, 0.04) 1px, transparent 1px, transparent 20px)`,
          }}
        ></div>
      </div>

      {/* Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-100/30 via-transparent to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100/20 via-transparent to-transparent rounded-full blur-3xl"></div>

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent animate-pulse-slow z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6 border border-purple-200 shadow-sm">
            <Newspaper size={12} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Breaking News</span>
            <Radio size={12} className="text-purple-600" />
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Berita <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Terkini</span>
          </h2>

          <div className="w-20 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto mb-5"></div>

          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Informasi terbaru seputar kegiatan mahasiswa dan kampus
          </p>
        </div>

        {/* Full Image Cards - Futuristik */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12">
          {news.map((item) => {
            const isHovered = hoveredId === item.id

            return (
              <Link
                key={item.id}
                to={`/news/${generateSlug(item.title)}`}
                className="group block"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className={`
                    relative aspect-[4/5] rounded-2xl overflow-hidden 
                    transition-all duration-500 ease-out
                    ${isHovered
                      ? 'shadow-2xl shadow-purple-500/25'
                      : 'shadow-lg shadow-black/10'}
                  `}
                >
                  {/* Full Background Image */}
                  <img
                    src={getImageSrc(item)}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x800?text=No+Image'
                    }}
                  />

                  {/* Gradient Overlay - Futuristik */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0418]/95 via-[#1a0a2e]/60 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-800/10 via-transparent to-purple-900/10"></div>
                  
                  {/* Neon Border Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 ${
                    isHovered 
                      ? 'border-purple-400/60 shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                      : 'border-white/10'
                  }`}></div>

                  {/* Top Info - Futuristik */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-purple-600/90 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg border border-white/20">
                        {item.category || 'Berita'}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/20">
                      <Calendar size={11} className="text-purple-300" />
                      <span className="font-semibold text-[10px] md:text-xs text-white/90">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Content - Futuristik */}
                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-5 lg:p-6 z-10">
                    <div className="transition-all duration-500">
                      <h3 className="text-sm md:text-base lg:text-lg font-bold text-white line-clamp-3 leading-snug mb-3 group-hover:text-purple-200 transition-colors">
                        {item.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[11px] md:text-sm text-white/80 font-semibold group-hover:text-white transition-colors">
                          Baca selengkapnya
                          <ChevronRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </span>

                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-400 transition-all duration-300">
                          <ChevronRight size={16} className="text-white/70 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Futuristic Corner Accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Bottom Neon Glow Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  
                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button - Futuristik */}
        <div className="text-center">
          <Link
            to="/news"
            className="group inline-flex items-center gap-2 px-6 md:px-8 lg:px-10 py-3 md:py-3.5 lg:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40 text-sm md:text-base relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Globe size={18} className="relative z-10" />
            <span className="relative z-10">Lihat Semua Berita</span>
            <ChevronRight size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default LatestNews
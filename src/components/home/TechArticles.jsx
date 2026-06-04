// src/components/articles/TechArticles.js
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, BookOpen, Clock, User, Calendar, Globe, Cpu, Zap, Shield, Rocket, Star, TrendingUp, ArrowUpRight } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import { articlesService } from '../../services/api'
import { generateSlug, formatDate, formatReadTime } from '../../utils/formatters'

const TechArticles = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  const futuristicIcons = [
    { icon: Cpu, label: 'AI & Technology' },
    { icon: Rocket, label: 'Innovation' },
    { icon: Shield, label: 'Cyber Security' },
    { icon: Globe, label: 'Global Tech' },
    { icon: Zap, label: 'Future Tech' },
    { icon: Star, label: 'Featured' }
  ]

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const data = await articlesService.getLatest(3)
        setArticles(data || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
        setError(error.message || 'Gagal memuat artikel')
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1052 30%, #1a0533 60%, #0f0520 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-3xl border border-purple-500/20">
            <BookOpen size={48} className="mx-auto text-purple-300 mb-3" />
            <p className="text-purple-200">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all duration-300 font-medium"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (articles.length === 0) {
    return (
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1052 30%, #1a0533 60%, #0f0520 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-3xl border border-purple-500/20">
            <BookOpen size={48} className="mx-auto text-purple-300 mb-3" />
            <p className="text-purple-200">Belum ada artikel</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="tech-articles-section relative overflow-hidden py-28" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1052 30%, #1a0533 60%, #0f0520 100%)' }}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(168, 130, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="ta-orb ta-orb-1"></div>
        <div className="ta-orb ta-orb-2"></div>
        <div className="ta-orb ta-orb-3"></div>
        
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2.5 bg-purple-500/10 backdrop-blur-xl rounded-full px-5 py-2 mb-8 border border-purple-400/20">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></div>
            <span className="text-purple-300 text-xs font-semibold tracking-[0.2em] uppercase">Latest Insights</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight">
            Artikel{' '}
            <span className="ta-gradient-text">Teknologi</span>
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-400/60"></div>
            <div className="w-2 h-2 rounded-full bg-purple-400/60"></div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-purple-400/60"></div>
          </div>
          
          <p className="text-purple-300/70 text-sm md:text-base lg:text-lg max-w-xl mx-auto leading-relaxed font-light px-4">
            Eksplorasi teknologi terkini, tutorial mendalam, dan wawasan dari para ahli
          </p>
        </div>

        {/* Articles Grid - Responsive: 3 card dalam satu baris di mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7">
          {articles.map((article, idx) => {
            const isHovered = hoveredId === article.id
            const iconData = futuristicIcons[idx % futuristicIcons.length]
            const IconComponent = iconData.icon
            
            return (
              <div
                key={article.id}
                className="group w-full"
                onMouseEnter={() => setHoveredId(article.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link to={`/articles/${generateSlug(article.title)}`} className="block h-full">
                  <div className={`
                    ta-card relative rounded-2xl overflow-hidden transition-all duration-500 
                    h-full flex flex-col
                    ${isHovered ? 'ta-card-hovered' : ''}
                  `}>
                    
                    {/* Terminal Header Bar - Responsive padding */}
                    <div className="ta-terminal-bar relative z-10 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3.5 flex items-center">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ff5f57] shadow-[0_0_6px_rgba(255,95,87,0.4)]"></div>
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#febc2e] shadow-[0_0_6px_rgba(254,188,46,0.4)]"></div>
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#28c840] shadow-[0_0_6px_rgba(40,200,64,0.4)]"></div>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] text-purple-400/50 font-mono tracking-wider truncate block px-1">
                          article_{idx + 1}.tsx
                        </span>
                      </div>
                      <div className="w-10 sm:w-12 md:w-14 flex justify-end">
                        <ArrowUpRight size={12} className="sm:w-[14px] sm:h-[14px] md:w-[14px] md:h-[14px] text-purple-400/40 group-hover:text-purple-300 group-hover:rotate-12 transition-all duration-300" />
                      </div>
                    </div>
                    
                    {/* Card Body - Responsive padding */}
                    <div className="relative z-10 p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                      
                      {/* Top Row: Icon + Date */}
                      <div className="flex items-start justify-between mb-4 sm:mb-5">
                        <div className={`
                          ta-icon-box w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl 
                          flex items-center justify-center 
                          transition-all duration-500 
                          group-hover:scale-110 group-hover:rotate-3
                        `}>
                          <IconComponent size={18} className="sm:w-[22px] sm:h-[22px] md:w-[26px] md:h-[26px] text-purple-300 group-hover:text-white transition-colors duration-300" />
                        </div>
                        
                        <div className="flex items-center gap-1 bg-white/5 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10">
                          <Calendar size={10} className="sm:w-[11px] sm:h-[11px] text-purple-400/70" />
                          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-purple-200/80 whitespace-nowrap">{formatDate(article.date)}</span>
                        </div>
                      </div>
                      
                      {/* Category - Tanpa Sparkles */}
                      <div className="inline-flex items-center gap-1.5 bg-purple-500/10 px-2 sm:px-2.5 md:px-3 py-1 rounded-full mb-3 sm:mb-4 border border-purple-500/15 self-start">
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-purple-300/90 tracking-wide truncate max-w-[100px] sm:max-w-none">
                          {article.category || 'Technology'}
                        </span>
                      </div>
                      
                      {/* Title - Responsive font size */}
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-2 md:mb-3 line-clamp-2 group-hover:text-purple-200 transition-colors duration-300 leading-snug">
                        {article.title}
                      </h3>
                      
                      {/* Summary - Responsive hide on very small screens */}
                      <p className="text-purple-300/50 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4 sm:mb-5 md:mb-6 flex-1 hidden xs:block">
                        {article.summary || article.content?.substring(0, 100) || 'Tidak ada deskripsi'}
                      </p>
                      
                      {/* Meta Tags - Responsive */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-5">
                        <div className="ta-meta-tag flex items-center gap-1 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg">
                          <Clock size={9} className="sm:w-[10px] sm:h-[10px] md:w-[11px] md:h-[11px] text-purple-400/70" />
                          <span className="text-[9px] sm:text-[10px] md:text-[11px] text-purple-200/70">{formatReadTime(article.content)}</span>
                        </div>
                        <div className="ta-meta-tag flex items-center gap-1 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg">
                          <User size={9} className="sm:w-[10px] sm:h-[10px] md:w-[11px] md:h-[11px] text-purple-400/70" />
                          <span className="text-[9px] sm:text-[10px] md:text-[11px] text-purple-200/70 truncate max-w-[70px] sm:max-w-none">
                            {article.author || 'Tim Penulis'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Footer - Responsive padding */}
                    <div className="ta-card-footer relative z-10 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-purple-500/15 flex items-center justify-center border border-purple-500/20">
                          <Globe size={9} className="sm:w-[10px] sm:h-[10px] md:w-[12px] md:h-[12px] text-purple-400/70" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] md:text-xs text-purple-300/50 font-medium truncate max-w-[80px] sm:max-w-none">
                          {iconData.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 sm:gap-2 text-purple-300 font-semibold text-xs sm:text-sm group-hover:text-white group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-300">
                        <span className="text-[11px] sm:text-xs md:text-sm">Baca</span>
                        <ChevronRight size={12} className="sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px] group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </div>

                    {/* Bottom Glow Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center z-20"></div>
                    
                    {/* Corner glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 sm:mt-14 md:mt-16">
          <Link 
            to="/articles" 
            className="ta-view-all-btn group inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl font-semibold text-xs sm:text-sm tracking-wide transition-all duration-500"
          >
            <BookOpen size={16} className="sm:w-[17px] sm:h-[17px] md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform duration-300" />
            <span>Jelajahi Semua Artikel</span>
            <ChevronRight size={16} className="sm:w-[17px] sm:h-[17px] md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      <style>{`
        /* Extra small screens breakpoint */
        @media (min-width: 480px) {
          .xs\\:block {
            display: block;
          }
        }
        .xs\\:block {
          display: none;
        }

        /* Gradient Text */
        .ta-gradient-text {
          background: linear-gradient(135deg, #c084fc, #e9d5ff, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Floating Orbs */
        .ta-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }
        .ta-orb-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(147, 51, 234, 0.15), transparent 70%);
          top: -100px;
          left: -100px;
          animation: ta-float 8s ease-in-out infinite;
        }
        .ta-orb-2 {
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.12), transparent 70%);
          bottom: -80px;
          right: -80px;
          animation: ta-float 10s ease-in-out infinite;
          animation-delay: 2s;
        }
        .ta-orb-3 {
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(192, 132, 252, 0.1), transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: ta-float 12s ease-in-out infinite;
          animation-delay: 4s;
        }
        
        @keyframes ta-float {
          0%, 100% { opacity: 0.6; transform: translate(0, 0) scale(1); }
          50% { opacity: 1; transform: translate(20px, -20px) scale(1.05); }
        }

        /* Card Styles */
        .ta-card {
          background: linear-gradient(165deg, rgba(15, 5, 30, 0.95) 0%, rgba(20, 8, 40, 0.9) 50%, rgba(12, 4, 25, 0.95) 100%);
          border: 1px solid rgba(147, 51, 234, 0.15);
          backdrop-filter: blur(20px);
          box-shadow: 
            0 4px 24px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(168, 85, 247, 0.08);
        }
        .ta-card-hovered {
          border-color: rgba(168, 85, 247, 0.35);
          transform: translateY(-6px);
          box-shadow: 
            0 20px 60px rgba(107, 33, 168, 0.25),
            0 8px 24px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(168, 85, 247, 0.15);
        }

        /* Terminal Bar */
        .ta-terminal-bar {
          background: linear-gradient(180deg, rgba(20, 10, 40, 0.8) 0%, rgba(15, 5, 30, 0.6) 100%);
          border-bottom: 1px solid rgba(147, 51, 234, 0.12);
        }

        /* Icon Box */
        .ta-icon-box {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(168, 85, 247, 0.08));
          border: 1px solid rgba(147, 51, 234, 0.2);
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.08);
        }
        .group:hover .ta-icon-box {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(168, 85, 247, 0.15));
          border-color: rgba(168, 85, 247, 0.4);
          box-shadow: 0 0 30px rgba(147, 51, 234, 0.2);
        }

        /* Meta Tags */
        .ta-meta-tag {
          background: rgba(147, 51, 234, 0.06);
          border: 1px solid rgba(147, 51, 234, 0.1);
        }

        /* Card Footer */
        .ta-card-footer {
          border-top: 1px solid rgba(147, 51, 234, 0.1);
          background: rgba(10, 3, 20, 0.3);
        }

        /* View All Button */
        .ta-view-all-btn {
          background: rgba(147, 51, 234, 0.08);
          border: 1px solid rgba(168, 85, 247, 0.25);
          color: #d8b4fe;
        }
        .ta-view-all-btn:hover {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(126, 34, 206, 0.9));
          border-color: transparent;
          color: #ffffff;
          box-shadow: 
            0 12px 40px rgba(147, 51, 234, 0.35),
            0 0 0 1px rgba(168, 85, 247, 0.3);
          transform: translateY(-2px);
        }

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
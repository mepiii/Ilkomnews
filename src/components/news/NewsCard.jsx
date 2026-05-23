import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Eye, Clock, User, ArrowRight } from 'lucide-react'

const NewsCard = ({ news, variant = 'default' }) => {
  const isCompact = variant === 'compact'
  const isHorizontal = variant === 'horizontal'

  // Format tanggal
  const formatDate = (date) => {
    if (!date) return 'Tanggal tidak tersedia'
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Horizontal variant
  if (isHorizontal) {
    return (
      <Link to={`/news/${news.id}`} className="block group">
        <div className="flex bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
          <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
            <img 
              src={news.image || 'https://placehold.co/400x300/7A47A6/FFFFFF?text=ILKOM+NEWS'} 
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#FFC148]/20 text-[#7A47A6] text-xs px-2 py-0.5 rounded-full font-semibold">
                {news.category || 'Berita'}
              </span>
              <span className="text-xs text-[#A7A3A3] flex items-center gap-1">
                <Clock size={10} />
                {formatDate(news.date)}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#300B55] mb-1 line-clamp-2 group-hover:text-[#7A47A6] transition-colors">
              {news.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-[#A7A3A3] mt-2">
              <div className="flex items-center gap-1">
                <Eye size={11} />
                <span>{news.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Compact variant
  if (isCompact) {
    return (
      <Link to={`/news/${news.id}`} className="block group">
        <div className="flex items-center gap-3 py-3 border-b border-gray-100 hover:bg-[#FFEDCA]/30 transition-colors px-2 rounded-lg">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={news.image || 'https://placehold.co/400x300/7A47A6/FFFFFF?text=ILKOM+NEWS'} 
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[#300B55] line-clamp-2 group-hover:text-[#7A47A6] transition-colors">
              {news.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#A7A3A3]">{formatDate(news.date)}</span>
              <span className="text-xs text-[#FFC148]">•</span>
              <span className="text-xs text-[#A7A3A3]">{news.views || 0} views</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant - FULL GAMBAR + CLEAN DESIGN
  return (
    <Link to={`/news/${news.id}`} className="block group h-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 border border-gray-100 h-full hover:-translate-y-1.5">
        {/* Full Image Section */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={news.image || 'https://placehold.co/500x300/7A47A6/FFFFFF?text=ILKOM+NEWS'} 
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Overlay Gradient on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#300B55]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-[#FFC148] to-[#FFD580] text-[#300B55] px-3 py-1 rounded-lg text-xs font-bold shadow-md">
              {news.category || 'Berita'}
            </span>
          </div>
          
          {/* Featured Badge */}
          {news.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="bg-[#7A47A6] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
                <span className="text-[#FFC148]">★</span> Featured
              </span>
            </div>
          )}
          
          {/* View Count on Hover */}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye size={10} className="inline mr-1" /> {news.views || 124} views
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-5">
          {/* Date & Info */}
          <div className="flex items-center gap-3 text-xs text-[#A7A3A3] mb-3">
            <div className="flex items-center gap-1 group-hover:text-[#FFC148] transition-colors duration-300">
              <Calendar size={12} />
              <span>{formatDate(news.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>2 jam lalu</span>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-[#300B55] mb-2 line-clamp-2 group-hover:text-[#7A47A6] transition-all duration-300">
            {news.title}
          </h3>
          
          {/* Summary */}
          <p className="text-[#A7A3A3] text-sm leading-relaxed line-clamp-2 mb-4">
            {news.summary || news.excerpt || 'Tidak ada deskripsi untuk berita ini. Silakan klik untuk membaca selengkapnya.'}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-r from-[#7A47A6] to-[#9B6BC6] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {news.author?.charAt(0) || 'A'}
              </div>
              <span className="text-xs text-[#A7A3A3] group-hover:text-[#300B55] transition-colors duration-300">
                {news.author || 'Admin ILKOM'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#7A47A6] text-sm font-medium group-hover:gap-2 transition-all duration-300">
              <span>Baca</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default NewsCard
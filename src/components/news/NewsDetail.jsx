import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Calendar, User, Eye, Share2, Bookmark, Heart, 
  ChevronLeft, ChevronRight, Link as LinkIcon, Check, Clock, Tag, 
  ArrowLeft, TrendingUp, Zap, Globe, Shield
} from 'lucide-react'
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { formatDate, formatRelativeTime, formatNumber, generateSlug } from '../../utils/formatters'

const NewsDetail = ({ news, relatedNews = [] }) => {
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    
    // Check if already bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setIsBookmarked(bookmarks.includes(news.id))
  }, [news.id])

  const handleShare = async (platform) => {
    const url = window.location.href
    const title = news.title
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    }
    
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
    
    setShowShareMenu(false)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    if (!isBookmarked) {
      bookmarks.push(news.id)
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    } else {
      const updated = bookmarks.filter(id => id !== news.id)
      localStorage.setItem('bookmarks', JSON.stringify(updated))
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Navigation Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-purple-600 transition-all duration-300 rounded-xl hover:bg-purple-50"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>
        
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isLiked 
                ? 'text-red-500 bg-red-50 scale-110' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          
          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isBookmarked 
                ? 'text-purple-600 bg-purple-100' 
                : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          
          {/* Share Button */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2.5 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
            >
              <Share2 size={20} />
            </button>
            
            {showShareMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowShareMenu(false)}
                />
                <div className="absolute right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-purple-100 py-2 z-20 min-w-[220px] animate-fade-in">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Bagikan ke
                  </div>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-2.5 text-left hover:bg-purple-50 flex items-center gap-3 transition-colors"
                  >
                    <FaFacebook size={18} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2.5 text-left hover:bg-purple-50 flex items-center gap-3 transition-colors"
                  >
                    <FaTwitter size={18} className="text-blue-400" />
                    <span className="text-sm font-medium text-gray-700">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full px-4 py-2.5 text-left hover:bg-purple-50 flex items-center gap-3 transition-colors"
                  >
                    <FaLinkedin size={18} className="text-blue-700" />
                    <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full px-4 py-2.5 text-left hover:bg-purple-50 flex items-center gap-3 transition-colors"
                  >
                    <FaWhatsapp size={18} className="text-green-500" />
                    <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-4 py-2.5 text-left hover:bg-purple-50 flex items-center gap-3 transition-colors"
                  >
                    {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}
                    <span className="text-sm font-medium text-gray-700">
                      {copied ? 'Tersalin!' : 'Salin Tautan'}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article Container */}
      <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
        {/* Hero Image Section */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900">
          {news.image ? (
            <>
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Zap size={80} className="text-purple-400/50" />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            {/* Category Badge */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                <TrendingUp size={12} />
                {news.category || 'Berita'}
              </span>
              {news.tags?.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {news.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{formatDate(news.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{formatRelativeTime(news.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>{news.author || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={14} />
                <span>{formatNumber(news.views || 0)} dilihat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="px-6 md:px-10 py-8">
          {/* Summary */}
          {news.summary && (
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-l-4 border-purple-500">
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                {news.summary}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-purple max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-purple-600 prose-strong:text-gray-800 prose-li:text-gray-600">
            {news.content?.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4">{paragraph.substring(2)}</h1>
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3">{paragraph.substring(3)}</h2>
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={idx} className="text-xl font-semibold mt-5 mb-2">{paragraph.substring(4)}</h3>
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '))
                return (
                  <ul key={idx} className="list-disc pl-6 my-4 space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="text-gray-600">{item.substring(2)}</li>
                    ))}
                  </ul>
                )
              }
              return <p key={idx} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>
            })}
          </div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500 mr-2">Tags:</span>
                {news.tags.map((tag, index) => (
                  <button
                    key={index}
                    className="bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-600 px-3 py-1 rounded-full text-xs transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {news.author?.charAt(0) || 'A'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-800">{news.author || 'Admin Ilkom News'}</h4>
                  <Shield size={14} className="text-purple-500" />
                </div>
                <p className="text-sm text-gray-500 mb-2">Penulis & Editor Ilkom News</p>
                <p className="text-sm text-gray-600">
                  Bergabung sebagai penulis untuk menyajikan berita dan informasi terupdate 
                  seputar dunia teknologi dan pendidikan di Fakultas Ilmu Komputer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related News - Tanpa NewsCard, langsung card sederhana */}
      {relatedNews && relatedNews.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-800">Berita Terkait</h2>
            </div>
            <Link 
              to="/news"
              className="text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1 text-sm font-medium group"
            >
              <span>Lihat Semua</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {relatedNews.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                to={`/news/${generateSlug(item.title)}`}
                className="group block"
              >
                <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-purple-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100">
                    <img 
                      src={item.image || `https://picsum.photos/seed/news-${item.id}/400/300`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar size={10} className="text-purple-400" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-3 flex-1">
                      {item.summary || item.content?.substring(0, 80) || 'Tidak ada deskripsi'}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Eye size={10} />
                        <span>{item.views || 0} dilihat</span>
                      </div>
                      <span className="text-purple-600 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Baca <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                  
                  {/* Hover Accent Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .prose-purple {
          --tw-prose-links: #7c3aed;
          --tw-prose-bold: #1f2937;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default NewsDetail
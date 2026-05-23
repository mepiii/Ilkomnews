import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, User, Eye, Share2, Bookmark, Heart, 
  ChevronLeft, ChevronRight, Link as LinkIcon, Check, Clock, Tag 
} from 'lucide-react'
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { formatDate, formatRelativeTime } from '../../utils/formatters'
import NewsCard from './NewsCard'  // Import NewsCard untuk related news

const NewsDetail = ({ news, relatedNews = [] }) => {
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  const handleShare = async (platform) => {
    const url = window.location.href
    const title = news.title
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
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
    // Save to localStorage or API
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
    <div className="max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-text-gray hover:text-primary transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Kembali</span>
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? 'text-red-500 bg-red-50' : 'text-text-gray hover:bg-gray-100'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked ? 'text-secondary bg-secondary/10' : 'text-text-gray hover:bg-gray-100'
            }`}
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 rounded-full text-text-gray hover:bg-gray-100 transition-colors"
            >
              <Share2 size={20} />
            </button>
            
            {showShareMenu && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10 min-w-[200px]">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                >
                  <FaFacebook size={18} className="text-blue-600" />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                >
                  <FaTwitter size={18} className="text-blue-400" />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                >
                  <FaLinkedin size={18} className="text-blue-700" />
                  <span>LinkedIn</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}
                  <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Container */}
      <article className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={news.image} 
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-accent text-primary px-3 py-1 rounded-md text-sm font-semibold">
                {news.category}
              </span>
              {news.tags?.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-md text-sm">
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {news.title}
            </h1>
          </div>
        </div>

        {/* Article Meta */}
        <div className="px-6 md:px-8 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(news.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>{formatRelativeTime(news.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{news.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye size={16} />
                <span>{news.views || 0} pembaca</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="px-6 md:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-medium text-primary/80">
              {news.summary}
            </p>
            
            <div className="whitespace-pre-line text-gray-700 leading-relaxed space-y-4">
              {news.content?.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={16} className="text-text-gray" />
                <span className="text-sm text-text-gray mr-2">Tags:</span>
                {news.tags.map((tag, index) => (
                  <button
                    key={index}
                    className="bg-bg-light hover:bg-secondary/10 text-primary px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-8 p-6 bg-bg-light rounded-xl">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                {news.author?.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-primary">{news.author}</h4>
                <p className="text-sm text-text-gray mb-2">Penulis & Editor Ilkom News</p>
                <p className="text-sm text-gray-600">
                  Bergabung sebagai penulis untuk menyajikan berita dan informasi terupdate 
                  seputar dunia teknologi dan pendidikan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related News */}
      {relatedNews && relatedNews.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Berita Terkait</h2>
            <button 
              onClick={() => navigate('/news')}
              className="text-secondary hover:text-accent transition-colors flex items-center space-x-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedNews.slice(0, 3).map((item) => (
              <NewsCard key={item.id} news={item} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsDetail
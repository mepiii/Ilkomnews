import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Calendar, User, Eye, Share2, Bookmark, Heart,
  ChevronRight, Link as LinkIcon, Check, Clock, Tag,
  ArrowLeft, TrendingUp, Building, Briefcase
} from 'lucide-react'
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { formatDate, formatRelativeTime, formatNumber, generateSlug } from '../../utils/formatters'
import { viewTracker } from '../../services/api'
import ImageWithFallback from '../ui/ImageWithFallback'

const NewsDetail = ({ news, relatedNews = [] }) => {
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [realViews, setRealViews] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setIsBookmarked(bookmarks.includes(news.id))
    viewTracker.increment('news', news.id, news.views || 0).then(setRealViews)
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
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
    setShowShareMenu(false)
  }

  // Get author image URL
  const authorImageUrl = news.author_image_url || news.author_image
  const authorInstitution = news.author_institution
  const authorPosition = news.author_position

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Back Button */}
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-70 transition-opacity" 
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={16} /> Kembali
      </motion.button>

      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden mb-8"
      >
        <div className="aspect-[16/7] bg-[#1A0533]">
          <ImageWithFallback
            src={news.image_url || news.image}
            alt={news.title}
            className="w-full h-full object-cover"
            fallbackText="No Image"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: 'var(--accent)' }}>
              <TrendingUp size={12} /> {news.category || 'Berita'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight font-heading">{news.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(news.date)}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {formatRelativeTime(news.date)}</span>
            {news.author && (
              <span className="flex items-center gap-1"><User size={12} /> {news.author}</span>
            )}
            <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(realViews)}</span>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl p-6 md:p-10" 
        style={{ background: 'var(--bg-card)' }}
      >
        {/* Summary */}
        {news.summary && (
          <div className="mb-8 border-l-4 rounded-r-xl p-5" style={{ borderColor: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 6%, transparent)' }}>
            <p className="text-sm leading-relaxed font-medium italic" style={{ color: 'var(--text-primary)' }}>
              "{news.summary}"
            </p>
          </div>
        )}

        {/* Content */}
        {news.content && (
          <div className="prose prose-sm max-w-none mb-8">
            <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
              {news.content}
            </div>
          </div>
        )}

        {/* Author Info - Enhanced with institution and position */}
        {news.author && (
          <div className="flex items-start gap-4 p-5 rounded-xl mb-6" style={{ background: 'var(--bg-secondary)' }}>
            {authorImageUrl ? (
              <img 
                src={authorImageUrl} 
                alt={news.author} 
                className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none'
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex'
                  }
                }}
              />
            ) : null}
            <div 
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0 ${authorImageUrl ? 'hidden' : 'flex'}`}
              style={{ background: 'var(--accent)' }}
            >
              {news.author.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{news.author}</p>
              {(authorInstitution || authorPosition) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  {authorInstitution && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Building size={12} /> {authorInstitution}
                    </span>
                  )}
                  {authorPosition && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Briefcase size={12} /> {authorPosition}
                    </span>
                  )}
                </div>
              )}
              {!authorInstitution && !authorPosition && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Penulis Ilkom News</p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <motion.button 
            onClick={() => setIsLiked(!isLiked)} 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl transition-all" 
            style={{ color: isLiked ? '#ef4444' : 'var(--text-muted)', background: isLiked ? 'rgba(239,68,68,0.1)' : 'transparent' }}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          </motion.button>
          <motion.button 
            onClick={() => setIsBookmarked(!isBookmarked)} 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl transition-all" 
            style={{ color: isBookmarked ? 'var(--accent)' : 'var(--text-muted)', background: isBookmarked ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent' }}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </motion.button>
          <div className="relative">
            <motion.button 
              onClick={() => setShowShareMenu(!showShareMenu)} 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl transition-all" 
              style={{ color: 'var(--text-muted)' }}
            >
              <Share2 size={18} />
            </motion.button>
            {showShareMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                <div className="absolute right-0 mt-2 rounded-xl shadow-xl py-1.5 z-20 min-w-[160px]" style={{ background: 'var(--bg-secondary)' }}>
                  {[
                    { icon: <FaFacebook size={14} className="text-blue-600" />, label: 'Facebook', key: 'facebook' },
                    { icon: <FaTwitter size={14} className="text-blue-400" />, label: 'Twitter', key: 'twitter' },
                    { icon: <FaLinkedin size={14} className="text-blue-700" />, label: 'LinkedIn', key: 'linkedin' },
                    { icon: <FaWhatsapp size={14} className="text-green-500" />, label: 'WhatsApp', key: 'whatsapp' },
                  ].map(item => (
                    <button key={item.key} onClick={() => handleShare(item.key)} className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {item.icon} {item.label}
                    </button>
                  ))}
                  <div className="my-1 border-t" style={{ borderColor: 'var(--border-color)' }} />
                  <button onClick={() => handleShare('copy')} className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {copied ? <Check size={14} className="text-green-500" /> : <LinkIcon size={14} />}
                    {copied ? 'Tersalin!' : 'Salin Tautan'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.article>

      {/* Related - Consistent card sizing */}
      {relatedNews?.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>Berita Terkait</h2>
            <Link to="/news" className="text-xs font-medium flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: 'var(--accent)' }}>
              Lihat Semua <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedNews.slice(0, 4).map(item => (
              <Link 
                key={item.id} 
                to={`/news/${generateSlug(item.title)}`} 
                className="group rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg" 
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={item.image_url || item.image || `https://picsum.photos/seed/news-${item.id}/400/300`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackText="No Image"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{formatDate(item.date)}</p>
                  <h3 className="text-sm font-bold line-clamp-2 mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{item.summary || 'Tidak ada deskripsi'}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default NewsDetail

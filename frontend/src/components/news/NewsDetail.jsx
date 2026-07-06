import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Calendar, User, Eye, Share2, Bookmark, Heart,
  ChevronRight, Link as LinkIcon, Check, Clock, Tag,
  ArrowLeft, TrendingUp
} from 'lucide-react'
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsBookmarked(bookmarks.includes(news.id))
    viewTracker.increment('news', news.id, news.views || 0).then(setRealViews)
  }, [news.id]) // eslint-disable-line react-hooks/exhaustive-deps

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
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* clipboard may be unavailable */ }
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
    setShowShareMenu(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-70 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      {/* Hero Image */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="aspect-[16/7] bg-gradient-to-br from-purple-900 to-indigo-900">
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
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight font-header">{news.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(news.date)}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {formatRelativeTime(news.date)}</span>
            <span className="flex items-center gap-1"><User size={12} /> {news.author || 'Admin'}</span>
            <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(realViews)}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="rounded-2xl p-6 md:p-10" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        {/* Summary */}
        {news.summary && (
          <div className="mb-8 p-5 rounded-xl border-l-4" style={{ background: 'color-mix(in srgb, var(--accent) 8%, transparent)', borderColor: 'var(--accent)' }}>
            <p className="text-base leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>{news.summary}</p>
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">
          {news.content?.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold mt-8 mb-3 font-header" style={{ color: 'var(--text-primary)' }}>{paragraph.substring(2)}</h1>
            if (paragraph.startsWith('## ')) return <h2 key={idx} className="text-xl font-bold mt-6 mb-2 font-header" style={{ color: 'var(--text-primary)' }}>{paragraph.substring(3)}</h2>
            if (paragraph.startsWith('### ')) return <h3 key={idx} className="text-lg font-semibold mt-5 mb-2 font-header" style={{ color: 'var(--text-primary)' }}>{paragraph.substring(4)}</h3>
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').filter(l => l.startsWith('- '))
              return <ul key={idx} className="list-disc pl-5 space-y-1.5 my-3">{items.map((item, i) => <li key={i} style={{ color: 'var(--text-secondary)' }}>{item.substring(2)}</li>)}</ul>
            }
            return <p key={idx} className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{paragraph}</p>
          })}
        </div>

        {/* Tags */}
        {news.tags?.length > 0 && (
          <div className="mt-8 pt-6 flex flex-wrap items-center gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Tag size={14} style={{ color: 'var(--text-muted)' }} />
            {news.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Author */}
        <div className="mt-8 p-5 rounded-xl flex items-start gap-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ background: 'var(--accent)' }}>
            {news.author?.charAt(0) || 'A'}
          </div>
          <div>
            <h4 className="font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{news.author || 'Admin Ilkom News'}</h4>
            <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Penulis & Editor Ilkom News</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Bergabung sebagai penulis untuk menyajikan berita dan informasi terupdate seputar dunia teknologi dan pendidikan di Fakultas Ilmu Komputer.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 flex items-center gap-3" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button onClick={() => setIsLiked(!isLiked)} className="p-2.5 rounded-xl transition-all" style={{ color: isLiked ? '#ef4444' : 'var(--text-muted)', background: isLiked ? 'rgba(239,68,68,0.1)' : 'transparent' }}>
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button onClick={() => setIsBookmarked(!isBookmarked)} className="p-2.5 rounded-xl transition-all" style={{ color: isBookmarked ? 'var(--accent)' : 'var(--text-muted)', background: isBookmarked ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent' }}>
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <div className="relative">
            <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2.5 rounded-xl transition-all" style={{ color: 'var(--text-muted)' }}>
              <Share2 size={18} />
            </button>
            {showShareMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                <div className="absolute right-0 mt-2 rounded-xl shadow-xl py-1.5 z-20 min-w-[180px]" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                  {[
                    { icon: <FaFacebook size={14} className="text-blue-600" />, label: 'Facebook', key: 'facebook' },
                    { icon: <FaTwitter size={14} className="text-blue-400" />, label: 'Twitter', key: 'twitter' },
                    { icon: <FaLinkedin size={14} className="text-blue-700" />, label: 'LinkedIn', key: 'linkedin' },
                    { icon: <FaWhatsapp size={14} className="text-green-500" />, label: 'WhatsApp', key: 'whatsapp' },
                  ].map(item => (
                    <button key={item.key} onClick={() => handleShare(item.key)} className="w-full px-4 py-2 text-left flex items-center gap-2.5 transition-colors text-xs" style={{ color: 'var(--text-primary)' }}>
                      {item.icon} {item.label}
                    </button>
                  ))}
                  <div className="my-1" style={{ borderTop: '1px solid var(--border-color)' }} />
                  <button onClick={() => handleShare('copy')} className="w-full px-4 py-2 text-left flex items-center gap-2.5 transition-colors text-xs" style={{ color: 'var(--text-primary)' }}>
                    {copied ? <Check size={14} className="text-green-500" /> : <LinkIcon size={14} />}
                    {copied ? 'Tersalin!' : 'Salin Tautan'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </article>

      {/* Related */}
      {relatedNews?.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-header" style={{ color: 'var(--text-primary)' }}>Berita Terkait</h2>
            <Link to="/news" className="text-xs font-medium flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: 'var(--accent)' }}>
              Lihat Semua <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedNews.slice(0, 3).map(item => (
              <Link key={item.id} to={`/news/${generateSlug(item.title)}`} className="group rounded-xl overflow-hidden transition-all hover:-translate-y-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
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
        </div>
      )}
    </div>
  )
}

export default NewsDetail

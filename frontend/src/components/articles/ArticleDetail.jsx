// src/components/articles/ArticleDetail.js
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar, User, Eye, Share2, Bookmark, Heart,
  ChevronRight, Link as LinkIcon, Check, Clock, Tag,
  ArrowLeft, Zap, Globe, Shield, Code, Cpu, Sparkles
} from 'lucide-react'
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { formatDate, formatRelativeTime, formatNumber, formatReadTime } from '../../utils/formatters'
import { viewTracker } from '../../services/api'

const ArticleDetail = ({ article, relatedArticles = [] }) => {
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [realViews, setRealViews] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    viewTracker.increment('article', article?.id, article?.views || 0).then(setRealViews)
  }, [article?.id, article?.views])

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsBookmarked(bookmarks.includes(article?.id))
  }, [article?.id])

  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Zap size={48} style={{ color: 'var(--accent)' }} className="mx-auto mb-4" />
          <p className="text-theme-muted">Artikel tidak ditemukan</p>
          <button
            onClick={() => navigate('/articles')}
            className="mt-4 px-4 py-2 text-white rounded-lg transition-colors" style={{ background: 'var(--accent)' }}
          >
            Kembali ke Artikel
          </button>
        </div>
      </div>
    )
  }

  const handleShare = async (platform) => {
    const url = window.location.href
    const title = article.title

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
      window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer')
    }

    setShowShareMenu(false)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    if (!isBookmarked) {
      bookmarks.push(article.id)
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    } else {
      const updated = bookmarks.filter(id => id !== article.id)
      localStorage.setItem('bookmarks', JSON.stringify(updated))
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2 text-theme-secondary hover:text-[var(--accent)] transition-all duration-300 rounded-xl hover:bg-[var(--accent)]/10"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isLiked
                ? 'text-red-500 bg-red-50 scale-110'
                : 'text-theme-muted hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleBookmark}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isBookmarked
                ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                : 'text-theme-muted hover:text-[var(--accent)] hover:bg-[var(--accent)]/10'
            }`}
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2.5 rounded-xl text-theme-muted hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all duration-300"
            >
              <Share2 size={20} />
            </button>

            {showShareMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                <div className="absolute right-0 mt-2 bg-theme rounded-2xl shadow-2xl border border-border py-2 z-20 min-w-[220px] animate-fade-in">
                  <div className="px-4 py-2 text-xs font-semibold text-theme-muted uppercase tracking-wider border-b border-border">Bagikan ke</div>
                  {[
                    { icon: <FaFacebook size={18} className="text-blue-600" />, label: 'Facebook', key: 'facebook' },
                    { icon: <FaTwitter size={18} className="text-blue-400" />, label: 'Twitter', key: 'twitter' },
                    { icon: <FaLinkedin size={18} className="text-blue-700" />, label: 'LinkedIn', key: 'linkedin' },
                    { icon: <FaWhatsapp size={18} className="text-green-500" />, label: 'WhatsApp', key: 'whatsapp' },
                  ].map(item => (
                    <button key={item.key} onClick={() => handleShare(item.key)} className="w-full px-4 py-2.5 text-left hover:bg-[var(--accent)]/10 flex items-center gap-3 transition-colors">
                      {item.icon}
                      <span className="text-sm font-medium text-theme-primary">{item.label}</span>
                    </button>
                  ))}
                  <div className="border-t border-border my-1"></div>
                  <button onClick={() => handleShare('copy')} className="w-full px-4 py-2.5 text-left hover:bg-[var(--accent)]/10 flex items-center gap-3 transition-colors">
                    {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}
                    <span className="text-sm font-medium text-theme-primary">{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <article className="bg-theme rounded-2xl shadow-xl overflow-hidden border border-border">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(48,11,85), rgb(20,10,50))' }}>
          {article.image ? (
            <>
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Cpu size={80} style={{ color: 'rgba(122,71,166,0.5)' }} />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg" style={{ background: 'var(--accent)' }}>
                <Sparkles size={12} />
                {article.category || 'Artikel Teknologi'}
              </span>
              {article.tags?.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">#{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2"><Calendar size={14} /><span>{formatDate(article.date)}</span></div>
              <div className="flex items-center gap-2"><Clock size={14} /><span>{formatRelativeTime(article.date)}</span></div>
              <div className="flex items-center gap-2"><User size={14} /><span>{article.author || 'Tim Penulis'}</span></div>
              <div className="flex items-center gap-2"><Eye size={14} /><span>{formatNumber(realViews)} dilihat</span></div>
              <div className="flex items-center gap-2"><Code size={14} /><span>{formatReadTime(article.content)}</span></div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 py-8">
          {article.summary && (
            <div className="mb-8 p-6 bg-[var(--accent)]/10 rounded-xl border-l-4" style={{ borderColor: 'var(--accent)' }}>
              <p className="text-theme-primary text-lg leading-relaxed font-medium">{article.summary}</p>
            </div>
          )}

          <div className="prose max-w-none prose-headings:text-theme-primary prose-p:text-theme-secondary prose-a:text-[var(--accent)] prose-strong:text-theme-primary prose-li:text-theme-secondary">
            {article.content?.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4">{paragraph.substring(2)}</h1>
              if (paragraph.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3">{paragraph.substring(3)}</h2>
              if (paragraph.startsWith('### ')) return <h3 key={idx} className="text-xl font-semibold mt-5 mb-2">{paragraph.substring(4)}</h3>
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '))
                return <ul key={idx} className="list-disc pl-6 my-4 space-y-2">{items.map((item, i) => <li key={i} className="text-theme-secondary">{item.substring(2)}</li>)}</ul>
              }
              if (paragraph.startsWith('1. ')) {
                const items = paragraph.split('\n').filter(line => /^\d+\./.test(line))
                return <ol key={idx} className="list-decimal pl-6 my-4 space-y-2">{items.map((item, i) => <li key={i} className="text-theme-secondary">{item.replace(/^\d+\. /, '')}</li>)}</ol>
              }
              return <p key={idx} className="text-theme-secondary leading-relaxed mb-4">{paragraph}</p>
            })}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={16} className="text-theme-muted" />
                <span className="text-sm text-theme-muted mr-2">Tags:</span>
                {article.tags.map((tag, index) => (
                  <button key={index} className="bg-theme-secondary hover:bg-[var(--accent)]/10 text-theme-secondary hover:text-[var(--accent)] px-3 py-1 rounded-full text-xs transition-colors">#{tag}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-6 bg-theme-secondary rounded-xl border border-border">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ background: 'linear-gradient(135deg, rgb(48,11,85), rgb(122,71,166))' }}>
                {article.author?.charAt(0) || 'A'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-theme-primary">{article.author || 'Tim Penulis Ilkom News'}</h4>
                  <Shield size={14} style={{ color: 'var(--accent)' }} />
                </div>
                <p className="text-sm text-theme-muted mb-2">Penulis & Editor Ilkom News</p>
                <p className="text-sm text-theme-secondary">Bergabung sebagai penulis untuk menyajikan artikel dan tutorial seputar dunia teknologi, programming, dan pengembangan software di Fakultas Ilmu Komputer.</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {relatedArticles && relatedArticles.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Globe size={20} style={{ color: 'var(--accent)' }} />
              <h2 className="text-2xl font-bold text-theme-primary">Artikel Terkait</h2>
            </div>
            <button onClick={() => navigate('/articles')} className="text-sm font-medium flex items-center gap-1 transition-colors" style={{ color: 'var(--accent)' }}>
              <span>Lihat Semua</span>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.slice(0, 3).map((item) => (
              <div key={item.id} onClick={() => navigate(`/articles/${item.id}`)} className="bg-theme rounded-xl shadow-md overflow-hidden border border-border hover:shadow-lg transition-all group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.image || `https://picsum.photos/id/${item.id}/400/300`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-theme-primary line-clamp-2 group-hover:text-[var(--accent)] transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-theme-muted"><Calendar size={12} /><span>{formatDate(item.date)}</span></div>
                  <div className="mt-3 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: 'var(--accent)' }}>Baca Artikel <ChevronRight size={14} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticleDetail

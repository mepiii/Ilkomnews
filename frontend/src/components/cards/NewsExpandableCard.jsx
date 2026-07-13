import { Link } from 'react-router-dom'
import { ExpandableCard } from '../ui/ExpandableCard'
import { generateSlug, formatDate } from '../../utils/formatters'
import { ArrowRight } from 'lucide-react'
import { WordBounce } from '../ui/WordBounce'

const categoryThemes = {
  Workshop: '220 60% 35%',
  Kompetisi: '0 60% 40%',
  Pelatihan: '150 50% 30%',
  Seminar: '280 50% 35%',
}

const NewsExpandableCard = ({ article }) => {
  const slug = generateSlug(article.title)
  const themeColor = categoryThemes[article.category] || '270 50% 40%'

  return (
    <ExpandableCard
      title={article.title}
      src={article.thumbnail_url || article.image_url || article.image || article.thumbnail || ''}
      description={article.summary || article.title}
      itemType="news"
      itemId={article.id}
      themeColor={themeColor}
      badge={
        article.category ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-[var(--accent)] text-white backdrop-blur-sm truncate max-w-full">
            {article.category}
          </span>
        ) : null
      }
      meta={
        <div className="flex items-center gap-1.5 text-xs overflow-hidden" style={{ color: 'var(--text-muted)' }}>
          {(article.author || article.author_image) && (
            <div className="flex items-center gap-1 min-w-0">
              {article.author_image ? (
                <img src={article.author_image_url || article.author_image} alt={article.author} className="w-7 h-7 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold bg-purple-600 shrink-0">
                  {(article.author || 'A').charAt(0)}
                </div>
              )}
              <span className="truncate">{article.author || 'Penulis'}</span>
            </div>
          )}
          {article.date && <><span className="shrink-0">·</span><span className="truncate">{formatDate(article.date)}</span></>}
        </div>
      }
    >
      <div className="w-full space-y-3 overflow-hidden">
        {(article.author || article.author_image) && (
          <div className="overflow-hidden">
            <h4 className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider mb-2"><WordBounce text="Penulis" /></h4>
            <div className="flex items-center gap-3">
              {article.author_image ? (
                <img src={article.author_image_url || article.author_image} alt={article.author} className="w-7 h-7 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold bg-purple-600 shrink-0">
                  {(article.author || 'A').charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{article.author || 'Penulis'}</span>
                {article.author_institution && (
                  <p className="text-xs text-[var(--text-muted)] truncate">{article.author_institution}</p>
                )}
              </div>
            </div>
          </div>
        )}
        {article.content && (
          <div className="overflow-hidden">
            <h4 className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider mb-1.5"><WordBounce text="Konten" /></h4>
            <p className="text-sm leading-relaxed break-words overflow-hidden" style={{ color: 'var(--text-secondary)' }}>
              {(article.content || '').substring(0, 400)}{article.content?.length > 400 ? '...' : ''}
            </p>
          </div>
        )}

        <Link
          to={`/news/${slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          Baca Selengkapnya
          <ArrowRight size={12} />
        </Link>
      </div>
    </ExpandableCard>
  )
}

export default NewsExpandableCard

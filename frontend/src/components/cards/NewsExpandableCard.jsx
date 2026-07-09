import { Link } from 'react-router-dom'
import { ExpandableCard } from '../ui/ExpandableCard'
import { generateSlug, formatDate } from '../../utils/formatters'
import { parseTags } from '../../utils/parsers'
import { ArrowRight } from 'lucide-react'

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
      src={article.image_url || article.image || 'https://placehold.co/600x800/8B5CF6/white?text=No+Image'}
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
                <img src={article.author_image_url || article.author_image} alt={article.author} className="w-4 h-4 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold bg-purple-600 shrink-0">
                  {(article.author || 'A').charAt(0)}
                </div>
              )}
              <span className="truncate max-w-[80px]">{article.author || 'Penulis'}</span>
            </div>
          )}
          {article.date && <><span className="shrink-0">·</span><span className="truncate">{formatDate(article.date)}</span></>}
        </div>
      }
    >
      <div className="w-full space-y-3 overflow-hidden">
        {article.content && (
          <div className="overflow-hidden">
            <h4 className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider mb-1.5">Konten</h4>
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

import { Link } from 'react-router-dom'
import { ExpandableCard } from '../ui/ExpandableCard'
import { generateSlug, formatDate } from '../../utils/formatters'
import { parseTags } from '../../utils/parsers'

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
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/40 text-white backdrop-blur-sm">
            {article.category}
          </span>
        ) : null
      }
      meta={
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {(article.author || article.author_image) && (
            <div className="flex items-center gap-1">
              {article.author_image ? (
                <img src={article.author_image_url || article.author_image} alt={article.author} className="w-4 h-4 rounded-full object-cover" />
              ) : (
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold bg-purple-600">
                  {(article.author || 'A').charAt(0)}
                </div>
              )}
              <span>{article.author || 'Penulis'}</span>
            </div>
          )}
          {article.date && <><span>·</span><span>{formatDate(article.date)}</span></>}
        </div>
      }
    >
      <div className="w-full space-y-3">
        {article.content && (
          <div>
            <h4 className="text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Konten</h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {(article.content || '').substring(0, 400)}{article.content?.length > 400 ? '...' : ''}
            </p>
          </div>
        )}

        <Link
          to={`/news/${slug}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[11px] font-medium hover:bg-[var(--accent)]/20 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Baca Selengkapnya
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>
    </ExpandableCard>
  )
}

export default NewsExpandableCard

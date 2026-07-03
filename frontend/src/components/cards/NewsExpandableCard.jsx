import { Link } from 'react-router-dom'
import { ExpandableCard } from '../ui/ExpandableCard'
import { generateSlug, formatDate } from '../../utils/formatters'

const parseTags = (tags) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags.map(t => String(t).trim()).filter(Boolean)
  if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean)
  return []
}

const NewsExpandableCard = ({ article }) => {
  const slug = generateSlug(article.title)
  const tagItems = parseTags(article.tags)

  return (
    <ExpandableCard
      title={article.title}
      src={article.image || 'https://via.placeholder.com/400x300'}
      description={article.summary || article.title}
      itemType="news"
      itemId={article.id}
      badge={
        article.category ? (
          <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-600/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25">
            {article.category}
          </span>
        ) : null
      }
      meta={
        <div className="space-y-2">
          {(article.author || article.author_image) && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50">
              {article.author_image ? (
                <img src={article.author_image} alt={article.author} className="w-3.5 h-3.5 rounded-full object-cover" />
              ) : null}
              <span className="font-medium">{article.author || 'Penulis'}</span>
              {article.date && <><span>•</span><span>{formatDate(article.date)}</span></>}
            </div>
          )}
          {tagItems.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tagItems.slice(0, 3).map((tag, i) => (
                <span key={i} className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-purple-100 dark:bg-purple-600/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25">
                  #{tag}
                </span>
              ))}
              {tagItems.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-purple-100 dark:bg-purple-600/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25">
                  +{tagItems.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      }
    >
      <div className="w-full space-y-4">
        {article.content && (
          <div>
            <h4 className="text-gray-700 dark:text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">Konten</h4>
            <div
              className="text-gray-600 dark:text-white/60 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: (article.content || '').replace(/<[^>]*>/g, '').substring(0, 500) + (article.content?.length > 500 ? '...' : '') }}
            />
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Link
            to={`/news/${slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-600/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25 text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-600/25 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Baca Selengkapnya
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </ExpandableCard>
  )
}

export default NewsExpandableCard

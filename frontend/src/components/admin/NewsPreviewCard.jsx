import { Eye } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return '—';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const AuthorAvatar = ({ authorImage, author }) => {
  const initial = (author || 'Nama Kreator').charAt(0).toUpperCase() || '?';
  if (authorImage) {
    return (
      <img
        src={authorImage}
        alt={author || 'Penulis'}
        className="w-7 h-7 rounded-full object-cover bg-gray-200 dark:bg-neutral-800"
      />
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
      {initial}
    </div>
  );
};

export default function NewsPreviewCard({
  image,
  authorImage,
  title,
  category,
  summary,
  author,
  date,
}) {
  const displayTitle = title || 'Judul Berita';
  const displaySummary = summary || '';
  const displayAuthor = author || 'Nama Kreator';
  const displayCategory = category || 'Kategori';
  const views = 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="relative">
        {image ? (
          <img
            src={image}
            alt={displayTitle}
            className="w-full aspect-video object-cover rounded-t-xl"
          />
        ) : (
          <div className="w-full aspect-video rounded-t-xl bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
            Tidak ada gambar
          </div>
        )}
        <span className="absolute top-3 left-3 bg-purple-600 text-white rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide">
          {displayCategory}
        </span>
      </div>

      <div className="p-4">
        <h4 className="font-extrabold uppercase text-lg md:text-xl tracking-tight text-gray-900 dark:text-gray-100 break-words">
          {displayTitle}
        </h4>
        {displaySummary && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {displaySummary}
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <AuthorAvatar authorImage={authorImage} author={displayAuthor} />
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {displayAuthor} • {formatDate(date)}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Eye size={14} className="text-gray-400" />
            <span className="text-xs text-gray-400">{views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

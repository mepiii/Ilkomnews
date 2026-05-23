import React from 'react'
import NewsCard from './NewsCard'
import EmptyState from '../common/EmptyState'
import LoadingSpinner from '../common/LoadingSpinner'

const NewsList = ({ news, loading, variant = 'default', columns = 3 }) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
            <div className="h-48 bg-gray-200 skeleton"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3 skeleton"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 skeleton"></div>
              <div className="h-4 bg-gray-200 rounded w-full skeleton"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 skeleton"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!news || news.length === 0) {
    return (
      <EmptyState 
        title="Tidak ada berita" 
        message="Belum ada berita yang tersedia saat ini. Silakan cek kembali nanti." 
      />
    )
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-6`}>
      {news.map((item) => (
        <NewsCard key={item.id} news={item} variant={variant} />
      ))}
    </div>
  )
}

export default NewsList
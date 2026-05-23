import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Clock } from 'lucide-react'
import { formatDate } from '../../utils/formatters'

const ArticleCard = ({ article }) => {
  return (
    <Link to={`/articles/${article.id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.image || 'https://via.placeholder.com/400x300'} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <span className="absolute top-4 left-4 bg-primary text-white px-2 py-1 rounded-md text-xs font-semibold">
            {article.category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {article.summary}
          </p>
          <div className="flex justify-between items-center text-xs text-text-gray">
            <div className="flex items-center space-x-2">
              <Calendar size={14} />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User size={14} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{article.readTime || '5 min read'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ArticleCard
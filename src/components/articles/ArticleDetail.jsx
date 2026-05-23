import React from 'react'
import { Calendar, User, Clock, Share2, Bookmark, Heart } from 'lucide-react'
import { formatDate } from '../../utils/formatters'

const ArticleDetail = ({ article }) => {
  return (
    <article className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className="inline-block bg-accent text-primary px-3 py-1 rounded-md text-sm font-semibold mb-3">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Article Meta */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-gray">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(article.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>{article.readTime || '5 min read'}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Heart size={20} className="text-text-gray hover:text-red-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bookmark size={20} className="text-text-gray hover:text-secondary" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 size={20} className="text-text-gray hover:text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="p-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {article.content}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">
              Pembahasan Lebih Lanjut
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <blockquote className="border-l-4 border-secondary pl-4 my-6 italic text-gray-600">
              "Ini adalah kutipan penting dari artikel yang memberikan wawasan mendalam tentang topik yang dibahas."
            </blockquote>
            <p className="text-gray-700 leading-relaxed">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-text-gray">Tags:</span>
              {article.tags?.map((tag, index) => (
                <span key={index} className="bg-bg-light text-primary px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
              {!article.tags && (
                <>
                  <span className="bg-bg-light text-primary px-3 py-1 rounded-full text-sm">#Teknologi</span>
                  <span className="bg-bg-light text-primary px-3 py-1 rounded-full text-sm">#Programming</span>
                  <span className="bg-bg-light text-primary px-3 py-1 rounded-full text-sm">#IlmuKomputer</span>
                </>
              )}
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-8 p-6 bg-bg-light rounded-lg">
            <div className="flex items-center space-x-4">
              <img 
                src={`https://randomuser.me/api/portraits/${article.author.includes('Dr.') ? 'men' : 'women'}/1.jpg`}
                alt={article.author}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-primary">{article.author}</h4>
                <p className="text-sm text-text-gray">Penulis dan Ahli di Bidang Teknologi</p>
                <p className="text-sm text-gray-600 mt-1">Membagikan pengetahuan dan pengalaman dalam dunia teknologi dan programming.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ArticleDetail
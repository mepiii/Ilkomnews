// src/components/home/IlkomGallery.js
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Globe, Smartphone, Palette, Gamepad2, Cpu, ArrowRight, ExternalLink, Layers, Zap } from 'lucide-react'

const IlkomGallery = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const categories = [
    { id: 'web', name: 'Web Development', icon: Globe, color: '#7C3AED', bg: 'bg-purple-50', text: 'text-purple-600' },
    { id: 'mobile', name: 'Mobile Apps', icon: Smartphone, color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { id: 'uiux', name: 'UI/UX Design', icon: Palette, color: '#EC4899', bg: 'bg-pink-50', text: 'text-pink-600' },
    { id: 'game', name: 'Game Development', icon: Gamepad2, color: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-600' },
    { id: 'ai', name: 'AI & Others', icon: Cpu, color: '#6366F1', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  ]

  // Fungsi untuk handle klik card
  const handleCategoryClick = (categoryId) => {
    // Simpan tab yang dipilih ke localStorage
    localStorage.setItem('lastGalleryTab', categoryId)
  }

  // Fungsi untuk handle klik tombol "Jelajahi Semua Project"
  const handleExploreClick = () => {
    // Bisa juga reset ke default atau biarkan yang terakhir
    // localStorage.removeItem('lastGalleryTab') // Uncomment jika ingin reset ke web
  }

  return (
    <section className="py-24 bg-white relative">
      {/* Clean Background - Minimalist */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50"></div>
      
      {/* Subtle Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Clean & Modern */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-4 py-1.5 mb-5 border border-purple-100">
            <Layers size={12} className="text-purple-500" />
            <span className="text-xs font-semibold text-purple-600 tracking-wide">STUDENT SHOWCASE</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            <span className="text-gray-900">ILKOM</span>
            <span className="text-purple-600"> Gallery</span>
          </h2>
          
          {/* Minimalist Underline */}
          <div className="w-16 h-0.5 bg-purple-200 mx-auto"></div>
          
          <p className="text-gray-500 text-sm max-w-md mx-auto mt-4">
            Galeri karya dan project mahasiswa Fakultas Ilmu Komputer
          </p>
        </div>

        {/* 5 Categories - Clean Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isHovered = hoveredCategory === cat.id
            
            return (
              <Link
                key={cat.id}
                to={`/ilkomgallery?tab=${cat.id}`}
                onClick={() => handleCategoryClick(cat.id)}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group"
              >
                <div className={`
                  relative bg-white rounded-xl p-5 text-center border transition-all duration-300
                  ${isHovered 
                    ? 'border-purple-300 shadow-md transform -translate-y-1' 
                    : 'border-gray-100 shadow-sm hover:border-gray-200'
                  }
                `}>
                  {/* Icon */}
                  <div className={`
                    inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 transition-all duration-300
                    ${isHovered ? cat.bg : 'bg-gray-50'}
                  `}>
                    <Icon size={20} className={isHovered ? cat.text : 'text-gray-400'} />
                  </div>
                  
                  {/* Text */}
                  <h3 className={`text-sm font-semibold mb-0.5 transition-colors duration-300 ${isHovered ? cat.text : 'text-gray-700'}`}>
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400">Explore →</p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Main CTA - Clean but Impactful */}
        <div className="text-center">
          {/* Preview Stats - Minimalist */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-xs text-gray-400 mt-0.5">Projects</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">100+</div>
              <div className="text-xs text-gray-400 mt-0.5">Students</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-xs text-gray-400 mt-0.5">Categories</div>
            </div>
          </div>

          {/* Tombol Utama - Modern Design */}
          <Link
            to="/ilkomgallery"
            onClick={handleExploreClick}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <span>Jelajahi Semua Project</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          
          {/* Alternative Link - Clean */}
          <div className="mt-4">
            <Link
              to="/ilkomgallery"
              onClick={handleExploreClick}
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-purple-500 transition-colors"
            >
              <span>Lihat detail gallery</span>
              <ExternalLink size={10} />
            </Link>
          </div>
        </div>
        
        {/* Decorative Line at Bottom */}
        <div className="mt-16 pt-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-300">
            <Zap size={10} />
            <span>Updated regularly with student projects</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IlkomGallery
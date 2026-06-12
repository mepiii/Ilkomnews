// components/ilkomgallery/shared/GameProjectCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Play, Gamepad2 } from 'lucide-react'

// Fungsi untuk membuat slug dari judul
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
}

const GameProjectCard = ({ project }) => {
  const slug = createSlug(project.title)

  return (
    <Link 
      to={`/ilkomgallery/game/${slug}`}
      className="group relative block rounded-xl overflow-hidden aspect-video cursor-pointer"
    >
      {/* Background Image - Full */}
      <div className="absolute inset-0">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-end p-5">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            <Gamepad2 size={12} />
            <span>Game Project</span>
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-white text-xl font-bold mb-1 line-clamp-1 group-hover:text-orange-300 transition-colors">
          {project.title}
        </h3>
        
        {/* Creator & Year */}
        <div className="flex items-center gap-3 text-white/70 text-xs mb-3">
          <span>{project.creator}</span>
          <span>•</span>
          <span>Angkatan {project.angkatan}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Gamepad2 size={10} />
            <span>{project.engine}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-white/80 text-sm mb-4 line-clamp-2 max-w-md">
          {project.description}
        </p>
        
        {/* Netflix Style Button */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-white/90 transition-all group-hover:gap-3">
            <Play size={16} fill="currentColor" />
            <span>Detail Game</span>
          </button>
        </div>
      </div>
      
      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </Link>
  )
}

export default GameProjectCard
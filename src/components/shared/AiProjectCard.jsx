// components/ilkomgallery/shared/AiProjectCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Play, Cpu } from 'lucide-react'

// Fungsi untuk membuat slug dari judul
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Hapus karakter spesial
    .replace(/\s+/g, '-')    // Ganti spasi dengan -
}

const AiProjectCard = ({ project }) => {
  const slug = createSlug(project.title)
  
  return (
    <Link 
      to={`/ilkomgallery/project/${slug}`}  // ← PAKE SLUG BUKAN ID
      className="group relative block rounded-xl overflow-hidden aspect-video cursor-pointer"
    >
      <div className="absolute inset-0">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
      </div>
      
      <div className="relative h-full flex flex-col justify-end p-5">
        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            <Cpu size={12} />
            <span>AI Project</span>
          </span>
        </div>
        
        <h3 className="text-white text-xl font-bold mb-1 line-clamp-1">
          {project.title}
        </h3>
        
        <div className="flex items-center gap-3 text-white/70 text-xs mb-3">
          <span>{project.creator}</span>
          <span>•</span>
          <span>Angkatan {project.angkatan}</span>
        </div>
        
        <p className="text-white/80 text-sm mb-4 line-clamp-2 max-w-md">
          {project.description}
        </p>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-white/90 transition-all group-hover:gap-3">
            <Play size={14} fill="currentColor" />
            <span>Detail Project</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </Link>
  )
}

export default AiProjectCard
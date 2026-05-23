// components/ilkomgallery/shared/UiUxProjectCard.jsx
import React from 'react'
import { FiFigma } from 'react-icons/fi'
import { Eye, User, Calendar, Palette } from 'lucide-react'

const UiUxProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="relative">
        <img src={project.thumbnail} alt={project.title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
            {project.platform}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1">{project.title}</h3>
        
        <div className="flex items-center text-sm text-text-gray mb-3 space-x-4">
          <div className="flex items-center space-x-1">
            <User size={14} />
            <span>{project.creator}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>Angkatan {project.angkatan}</span>
          </div>
        </div>
        
        <p className="text-text-gray text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="mb-4">
          <div className="text-xs font-semibold text-text-gray mb-2 flex items-center gap-1">
            <Palette size={12} />
            <span>Tools:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded-full">{tool}</span>
            ))}
          </div>
        </div>
        
        <a 
          href={project.figmaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
        >
          <FiFigma size={18} />
          <span>Lihat di Figma</span>
        </a>
      </div>
    </div>
  )
}

export default UiUxProjectCard
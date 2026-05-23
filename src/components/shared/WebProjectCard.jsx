// components/ilkomgallery/shared/WebProjectCard.jsx
import React, { useState } from 'react'
import { ExternalLink, Code2, User, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

const WebProjectCard = ({ project }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      <img 
        src={project.thumbnail} 
        alt={project.title}
        className="w-full h-48 object-cover"
      />
      
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
        
        <p className={`text-text-gray ${expanded ? '' : 'line-clamp-2'} mb-3`}>
          {project.description}
        </p>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-primary text-sm flex items-center space-x-1 mb-3 hover:underline"
        >
          {expanded ? (
            <>
              <ChevronUp size={14} />
              <span>Sembunyikan</span>
            </>
          ) : (
            <>
              <ChevronDown size={14} />
              <span>Baca Selengkapnya</span>
            </>
          )}
        </button>
        
        <div className="mb-4">
          <div className="text-xs font-semibold text-text-gray mb-2 flex items-center gap-1">
            <Code2 size={12} />
            <span>Tech Stack:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-700">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <a 
            href={project.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center space-x-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-opacity-90 transition"
          >
            <ExternalLink size={16} />
            <span>Live Demo</span>
          </a>
          <a 
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <FaGithub size={16} />
            <span>Repo</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default WebProjectCard
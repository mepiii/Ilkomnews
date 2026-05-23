// components/ilkomgallery/shared/AiProjectCard.jsx
import React from 'react'
import { Brain, ExternalLink, User, Calendar, Code2 } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

const AiProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="relative">
        <img src={project.thumbnail} alt={project.title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2">
          <div className="px-2 py-1 bg-cyan-100 text-cyan-600 text-xs rounded-full flex items-center gap-1">
            <Brain size={12} />
            <span>AI Project</span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-primary line-clamp-1 flex-1">{project.title}</h3>
        </div>
        
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
            <Code2 size={12} />
            <span>Tech Stack:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded-full">{tech}</span>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <a 
            href={project.demoLink}
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
            className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <FaGithub size={16} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default AiProjectCard
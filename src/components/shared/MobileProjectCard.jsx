// components/ilkomgallery/shared/MobileProjectCard.jsx
import React, { useState } from 'react'
import { Download, Smartphone, Play, User, Calendar, X } from 'lucide-react'

const MobileProjectCard = ({ project }) => {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
        <img src={project.thumbnail} alt={project.title} className="w-full h-48 object-cover" />
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-primary line-clamp-1">{project.title}</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full whitespace-nowrap ml-2">
              {project.platform}
            </span>
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
            <div className="text-xs font-semibold text-text-gray mb-2">Tech Stack:</div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded-full">{tech}</span>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            {project.previewVideo && (
              <button 
                onClick={() => setShowPreview(true)}
                className="flex-1 flex items-center justify-center space-x-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                <Play size={16} />
                <span>Preview</span>
              </button>
            )}
            <a 
              href={project.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <Download size={16} />
              <span>Download APK</span>
            </a>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">{project.title} - Preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <iframe 
                src={project.previewVideo} 
                className="w-full aspect-video rounded-lg"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileProjectCard
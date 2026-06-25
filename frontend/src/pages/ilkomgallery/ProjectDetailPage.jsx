// src/pages/ilkomgallery/ProjectDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Play, X, ExternalLink,
  User, Calendar, Code2, Brain, Award, Users,
  Mail, ArrowLeft, AlertCircle
} from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { BGPattern } from '../../components/ui/BGPattern'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Format text function (support markdown sederhana)
const formatText = (text) => {
  if (!text) return null
  return text.split('\n').map((line, idx) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <h3 key={idx} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(2, -2)}</h3>
    }
    if (line.startsWith('- ')) {
      return <li key={idx} className="text-theme-secondary ml-4 mb-1">{line.slice(2)}</li>
    }
    if (line.trim() === '') return <br key={idx} />
    return <p key={idx} className="text-theme-secondary mb-2">{line}</p>
  })
}

const ProjectDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try to parse slug as ID first
        const id = parseInt(slug)
        if (!isNaN(id)) {
          // Fetch by ID directly
          const response = await fetch(`${API_BASE}/projects/${id}`)
          if (response.ok) {
            const data = await response.json()
            setProject(data)
          } else {
            throw new Error('Project not found')
          }
        } else {
          // Fetch all projects and find by slug/title
          const response = await fetch(`${API_BASE}/projects`)
          if (!response.ok) {
            throw new Error('Failed to fetch projects')
          }

          const data = await response.json()
          const projects = data.data || data // Handle both paginated and array responses

          // Find project by matching slug
          const foundProject = projects.find(p => {
            // Generate slug from title and compare
            const projectSlug = generateSlug(p.title)
            return projectSlug === slug
          })

          if (foundProject) {
            setProject(foundProject)
          } else {
            // Also check if any project has matching ID as string
            const idMatch = projects.find(p => p.id.toString() === slug)
            if (idMatch) {
              setProject(idMatch)
            } else {
              throw new Error('Project not found')
            }
          }
        }
      } catch (err) {
        setError(err.message)
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Memuat proyek...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-theme-muted mb-4">{error}</p>
          <button
            onClick={() => navigate('/ilkomgallery')}
            className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali ke Gallery
          </button>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Project tidak ditemukan</p>
          <Link to="/ilkomgallery" className="text-purple-500 hover:text-purple-400">
            Kembali ke Gallery
          </Link>
        </div>
      </div>
    )
  }

  // Map API fields to display values
  const displayCreator = project.creator_name || 'Unknown'
  const displayMajor = project.creator_major || 'Unknown'
  const displayNim = project.creator_nim || 'Unknown'
  const displayYear = project.creator_year || 'Unknown'
  const displayThumbnail = project.thumbnail_url || project.thumbnail || 'https://placehold.co/1200x600/3B82F6/white?text=Project+Image'
  const displayDescription = project.description || 'No description available'
  const displayTechStack = project.tech_stack || []
  const displayLiveDemo = project.live_demo
  const displayGithub = project.github_link
  const displayCollaborators = project.collaborators || []

  // Get category display name
  const getCategoryDisplay = (category) => {
    const categories = {
      web: 'Web Development',
      mobile: 'Mobile App',
      uiux: 'UI/UX Design',
      game: 'Game Development',
      ai: 'AI Project'
    }
    return categories[category] || category
  }

  return (
    <div className="min-h-screen bg-theme pb-16 relative">
      <BGPattern variant="grid" fill="var(--pattern-color)" size={24} className="fixed inset-0" />
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden pt-16 md:pt-0">
        <img
          src={displayThumbnail}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/ilkomgallery')}
          className="absolute top-24 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-300 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Kembali ke Gallery</span>
        </button>

        {/* Close Button */}
        <button
          onClick={() => navigate('/ilkomgallery')}
          className="absolute top-24 right-6 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition"
        >
          <X size={20} className="text-white" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                <Brain size={12} />
                <span>{getCategoryDisplay(project.category).toUpperCase()}</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 max-w-4xl font-header">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="text-white/70">Oleh {displayCreator}</div>
              <div className="text-white/70">•</div>
              <div className="text-white/70">Angkatan {displayYear}</div>
            </div>

            {displayLiveDemo && (
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <a
                  href={displayLiveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition"
                >
                  <Play size={18} fill="currentColor" />
                  <span>Demo Project</span>
                </a>
              </div>
            )}

            <p className="text-white/80 text-base md:text-lg max-w-3xl">
              {displayDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-white text-2xl font-bold mb-4">About This Project</h2>
              <div className="text-theme-secondary leading-relaxed">
                {formatText(displayDescription)}
              </div>
            </section>

            {displayTechStack.length > 0 && (
              <section>
                <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                  <Code2 size={24} />
                  <span>Tech Stack</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  {displayTechStack.map((tech, idx) => (
                    <span key={idx} className="px-4 py-2 bg-theme-secondary text-theme-primary rounded-lg text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">Links & Resources</h2>
              <div className="flex flex-wrap gap-4">
                {displayLiveDemo && (
                  <a href={displayLiveDemo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    <ExternalLink size={18} />
                    <span>Live Demo</span>
                  </a>
                )}
                {displayGithub && (
                  <a href={displayGithub} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                    <FaGithub size={18} />
                    <span>GitHub Repository</span>
                  </a>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-theme-secondary rounded-xl p-6 border border-theme">
              <h3 className="text-theme-primary font-bold text-lg mb-4 flex items-center gap-2">
                <User size={18} />
                <span>Creator</span>
              </h3>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                  {displayCreator.charAt(0)}
                </div>
                <div>
                  <h4 className="text-theme-primary font-semibold text-lg">{displayCreator}</h4>
                  <p className="text-theme-muted text-sm">{displayMajor}</p>
                  <p className="text-theme-muted text-xs">NIM: {displayNim}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-theme-muted">
                  <Calendar size={14} />
                  <span>Angkatan {displayYear}</span>
                </div>
              </div>
            </div>

            {displayCollaborators.length > 0 && (
              <div className="bg-theme-secondary rounded-xl p-6 border border-theme">
                <h3 className="text-theme-primary font-bold text-lg mb-3 flex items-center gap-2">
                  <Users size={18} />
                  <span>Collaborators</span>
                </h3>
                <div className="space-y-2">
                  {displayCollaborators.map((collab, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-theme rounded-lg transition">
                      <div className="w-8 h-8 rounded-full bg-theme-secondary flex items-center justify-center text-xs font-bold">
                        {collab.charAt(0)}
                      </div>
                      <span className="text-theme-primary">{collab}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage
// pages/IlkomGalleryPage.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Globe, Smartphone, Palette, Gamepad2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'

// Import komponen untuk setiap kategori
import WebProjectsTab from '../components/ilkomgallery/WebProjectsTab'
import MobileProjectsTab from '../components/ilkomgallery/MobileProjectsTab'
import UiUxProjectsTab from '../components/ilkomgallery/UiUxProjectsTab'
import GameProjectsTab from '../components/ilkomgallery/GameProjectsTab'
import AiProjectsTab from '../components/ilkomgallery/AiProjectsTab'

const tabs = [
  { id: 'web', name: 'Web Development', icon: Globe, component: WebProjectsTab },
  { id: 'mobile', name: 'Mobile Apps', icon: Smartphone, component: MobileProjectsTab },
  { id: 'uiux', name: 'UI/UX Design', icon: Palette, component: UiUxProjectsTab },
  { id: 'game', name: 'Game Development', icon: Gamepad2, component: GameProjectsTab },
  { id: 'ai', name: 'AI / Other', icon: Sparkles, component: AiProjectsTab },
]

const IlkomGalleryPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('web')
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // ⭐ Ambil tab dari URL atau localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')
    
    if (tabParam && tabs.some(tab => tab.id === tabParam)) {
      // Jika ada tab di URL, pakai itu
      setActiveTab(tabParam)
      // Simpan ke localStorage
      localStorage.setItem('lastGalleryTab', tabParam)
    } else {
      // Jika tidak ada tab di URL, cek localStorage
      const savedTab = localStorage.getItem('lastGalleryTab')
      if (savedTab && tabs.some(tab => tab.id === savedTab)) {
        setActiveTab(savedTab)
        // Update URL tanpa reload
        navigate(`/ilkomgallery?tab=${savedTab}`, { replace: true })
      } else {
        // Default ke web
        setActiveTab('web')
      }
    }
  }, [location.search])

  // ⭐ Scroll ke atas saat halaman di-load atau tab berubah
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })
  }, [location.pathname, activeTab])

  // ⭐ Update URL saat tab berubah (tanpa reload)
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    localStorage.setItem('lastGalleryTab', tabId)
    navigate(`/ilkomgallery?tab=${tabId}`, { replace: true })
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || tabs[0].component

  // Scroll handlers untuk mobile
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-10">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Breadcrumb />
        
        {/* Header Section - Modern & Clean */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
              Student Projects
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a0533] mb-4">
            ILKOM <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Gallery</span>
          </h1>
          <div className="w-20 h-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mx-auto mb-5"></div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Galeri karya dan project mahasiswa Fakultas Ilmu Komputer
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-purple-100">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />
                  <span className="text-sm whitespace-nowrap">{tab.name}</span>
                </button>
              )
            })}
          </div>

          {/* Mobile Tabs - Horizontal Scroll */}
          <div className="md:hidden relative">
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-white/90 border border-purple-200 rounded-full shadow-md flex items-center justify-center hover:bg-purple-50 transition-all"
              >
                <ChevronLeft size={16} className="text-purple-600" />
              </button>
            )}
            
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-white/90 border border-purple-200 rounded-full shadow-md flex items-center justify-center hover:bg-purple-50 transition-all"
              >
                <ChevronRight size={16} className="text-purple-600" />
              </button>
            )}
            
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="overflow-x-auto scrollbar-hide pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-2 px-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-white/80 text-gray-600 hover:text-purple-600 hover:bg-purple-50 border border-purple-100'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                      <span className="text-xs whitespace-nowrap">{tab.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content - With Animation */}
        <div className="animate-fade-in">
          <ActiveComponent />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default IlkomGalleryPage
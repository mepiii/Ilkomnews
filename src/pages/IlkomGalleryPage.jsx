// pages/IlkomGalleryPage.jsx
import React, { useState } from 'react'
import { Globe, Smartphone, Palette, Gamepad2, Sparkles } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState('web')

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || tabs[0].component

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

        {/* Tab Navigation - Modern Pills Design */}
        <div className="mb-8">
          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-purple-100">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />
                  <span className="text-sm">{tab.name}</span>
                </button>
              )
            })}
          </div>

          {/* Mobile Tabs - Dropdown Style */}
          <div className="md:hidden">
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 font-semibold transition-all duration-300 border-b border-purple-100 last:border-b-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-purple-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isActive ? 'bg-white/20' : 'bg-purple-100'
                    }`}>
                      <Icon size={18} className={isActive ? 'text-white' : 'text-purple-600'} />
                    </div>
                    <span className="text-sm">{tab.name}</span>
                  </button>
                )
              })}
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
      `}</style>
    </div>
  )
}

export default IlkomGalleryPage
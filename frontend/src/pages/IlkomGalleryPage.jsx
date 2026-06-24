import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Globe, Smartphone, Palette, Gamepad2, Sparkles } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import { BGPattern } from '../components/ui/BGPattern'
import { AnimatedTabs } from '../components/ui/AnimatedTabs'
import WebProjectsTab from '../components/ilkomgallery/WebProjectsTab'
import MobileProjectsTab from '../components/ilkomgallery/MobileProjectsTab'
import UiUxProjectsTab from '../components/ilkomgallery/UiUxProjectsTab'
import GameProjectsTab from '../components/ilkomgallery/GameProjectsTab'
import AiProjectsTab from '../components/ilkomgallery/AiProjectsTab'

const tabs = [
  { id: 'web', label: 'Web Development', icon: Globe, component: WebProjectsTab },
  { id: 'mobile', label: 'Aplikasi Mobile', icon: Smartphone, component: MobileProjectsTab },
  { id: 'uiux', label: 'Desain UI/UX', icon: Palette, component: UiUxProjectsTab },
  { id: 'game', label: 'Game Development', icon: Gamepad2, component: GameProjectsTab },
  { id: 'ai', label: 'AI / Lainnya', icon: Sparkles, component: AiProjectsTab },
]

const IlkomGalleryPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('web')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')
    if (tabParam && tabs.some(t => t.id === tabParam)) {
      setActiveTab(tabParam)
      localStorage.setItem('lastGalleryTab', tabParam)
    } else {
      const saved = localStorage.getItem('lastGalleryTab')
      if (saved && tabs.some(t => t.id === saved)) {
        setActiveTab(saved)
        navigate(`/ilkomgallery?tab=${saved}`, { replace: true })
      }
    }
  }, [location.search])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, activeTab])

  const handleTabChange = (id) => {
    setActiveTab(id)
    localStorage.setItem('lastGalleryTab', id)
    navigate(`/ilkomgallery?tab=${id}`, { replace: true })
  }

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || tabs[0].component

  return (
    <div className="min-h-screen bg-theme relative pt-10">
      <BGPattern variant="grid" fill="#252525" size={24} className="fixed inset-0" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Breadcrumb />

        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary mb-4">
            <div className="bg-card border border-theme rounded-2xl px-3 py-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Proyek Mahasiswa</span>
            </div>
            <p className="pr-3 text-xs text-theme-muted">Galeri</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-theme-primary mb-4 font-header">
            <span>ILKOM </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Gallery</span>
          </h1>
          <div className="w-12 h-0.5 mx-auto rounded-full mb-4 bg-accent" />
          <p className="text-theme-muted text-base md:text-lg max-w-2xl mx-auto">
            Galeri karya dan proyek mahasiswa Fakultas Ilmu Komputer
          </p>
        </div>

        {/* Animated Tabs */}
        <div className="mb-8 flex justify-center">
          <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        <div className="animate-fade-in">
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}

export default IlkomGalleryPage

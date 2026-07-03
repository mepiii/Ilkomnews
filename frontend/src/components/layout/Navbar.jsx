import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Newspaper, Image, ExternalLink, Users, ChevronDown, Send, Search, Bookmark } from 'lucide-react'
import { AnimatedThemeToggle } from '../ui/AnimatedThemeToggle'
import NotificationPopover from '../ui/NotificationPopover'
import logo from '../../assets/BEM.png'

const LampNavbar = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('Beranda')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  const navItems = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Berita', path: '/news', icon: Newspaper },
    { name: 'Ilkom Gallery', path: '/ilkomgallery', icon: Image },
    { name: 'Submit', path: '/submit', icon: Send },
    { name: 'Track', path: '/track', icon: Search },
    { name: 'Saved', path: '/saved', icon: Bookmark },
  ]

  const bemApps = [
    { name: 'SAPA', url: 'https://sapa.bemfasilkomunsri.org/', icon: Users },
    { name: 'BEM Official', url: 'https://bemfasilkomunsri.org/', icon: ExternalLink },
  ]

  useEffect(() => {
    const current = navItems.find(item => item.path === location.pathname)
    if (current) setActiveTab(current.name)
  }, [location.pathname])

  const handleScroll = useCallback(() => {
    const y = window.scrollY
    if (y < 50) { setIsVisible(true) }
    else if (y > lastScrollY.current && y > 100) { setIsVisible(false); setDropdownOpen(false); setMobileOpen(false) }
    else if (y < lastScrollY.current - 10) { setIsVisible(true) }
    lastScrollY.current = y
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const handleClick = (e) => { if (dropdownOpen && !e.target.closest('[data-dropdown]')) setDropdownOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4"
        >
          {/* Desktop — solid navbar */}
          <div className="hidden md:flex items-center justify-center gap-1 bg-white dark:bg-black py-1.5 px-2 rounded-full border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
            <Link to="/" className="flex items-center gap-2 px-3 py-1.5 mr-1 shrink-0" onClick={() => setActiveTab('Beranda')}>
              <img src={logo} alt="ILKOM" className="h-7 w-auto" />
              <span className="text-sm font-bold tracking-tight text-black dark:text-white hidden min-[800px]:inline">ILKOM NEWS</span>
            </Link>

            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setActiveTab(item.name)}
                  className={`relative cursor-pointer px-4 py-2 rounded-full transition-all duration-300 text-[13px] font-semibold tracking-wide uppercase ${
                    isActive
                      ? 'bg-black/[0.06] dark:bg-white/[0.12] text-black dark:text-white'
                      : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-black dark:bg-white rounded-full" />
                  )}
                </Link>
              )
            })}

            <div className="relative" data-dropdown>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 cursor-pointer px-4 py-2 rounded-full transition-all text-[13px] font-semibold tracking-wide uppercase text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                <span className="hidden md:inline">BEM Apps</span>
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden p-1.5"
                >
                  {bemApps.map((app) => {
                    const Icon = app.icon
                    return (
                      <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Icon size={16} />
                        <span>{app.name}</span>
                        <ExternalLink size={12} className="ml-auto opacity-40" />
                      </a>
                    )
                  })}
                </motion.div>
              )}
            </div>

            <div className="ml-1 pl-2 border-l border-black/[0.08] dark:border-white/[0.12] flex items-center gap-1">
              <NotificationPopover />
              <AnimatedThemeToggle />
            </div>
          </div>

          {/* Mobile — solid navbar */}
          <div className="md:hidden flex items-center justify-between w-full bg-white dark:bg-black py-2 px-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src={logo} alt="ILKOM" className="h-7 w-auto" />
              <span className="text-sm font-bold text-black dark:text-white hidden min-[360px]:inline">ILKOM NEWS</span>
            </Link>
            <div className="flex items-center gap-2">
              <NotificationPopover />
              <AnimatedThemeToggle />
              <button onClick={() => setMobileOpen(!mobileOpen)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.1] transition-colors">
                {mobileOpen ? <X size={20} className="text-black dark:text-white" /> : <Menu size={20} className="text-black dark:text-white" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl overflow-hidden p-2"
            >
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.name} to={item.path}
                    onClick={() => { setActiveTab(item.name); setMobileOpen(false) }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      activeTab === item.name
                        ? 'bg-black/[0.06] dark:bg-white/[0.12] text-black dark:text-white'
                        : 'text-black/70 dark:text-white/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <div className="border-t border-neutral-200 dark:border-neutral-700 mt-1 pt-1">
                {bemApps.map((app) => {
                  const Icon = app.icon
                  return (
                    <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-black/70 dark:text-white/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                    >
                      <Icon size={18} />
                      <span>{app.name}</span>
                      <ExternalLink size={14} className="ml-auto opacity-30" />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LampNavbar

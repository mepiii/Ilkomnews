import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Newspaper, Image, ExternalLink, Users, ChevronDown, Send, Search, Bookmark } from 'lucide-react'
import { AnimatedThemeToggle } from '../ui/AnimatedThemeToggle'
import NotificationPopover from '../ui/NotificationPopover'
import logo from '../../assets/BEM.png'

const navItems = [
  { name: 'Beranda', path: '/', icon: Home },
  { name: 'Berita', path: '/news', icon: Newspaper },
  { name: 'Ilkom Gallery', path: '/ilkomgallery', icon: Image },
]

const activityItems = [
  { name: 'Submit Proyek', path: '/submit', icon: Send },
  { name: 'Lacak Status', path: '/track', icon: Search },
  { name: 'Koleksi Saya', path: '/koleksi', icon: Bookmark },
]

const bemApps = [
  { name: 'SAPA', url: 'https://sapa.bemfasilkomunsri.org/', icon: Users },
  { name: 'BEM Official', url: 'https://bemfasilkomunsri.org/', icon: ExternalLink },
]

const LampNavbar = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('Beranda')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [bemDropdownOpen, setBemDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const current = navItems.find(item => item.path === location.pathname)
    const currentActivity = activityItems.find(item => item.path === location.pathname)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (current) setActiveTab(current.name)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (currentActivity) setActiveTab('Aktivitas')
  }, [location.pathname])

  const handleScroll = useCallback(() => {
    const y = window.scrollY
    if (y < 50) { setIsVisible(true) }
    else if (y > lastScrollY.current && y > 100) { setIsVisible(false); setDropdownOpen(false); setBemDropdownOpen(false); setMobileOpen(false) }
    else if (y < lastScrollY.current - 10) { setIsVisible(true) }
    lastScrollY.current = y
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownOpen && !e.target.closest('[data-dropdown]')) setDropdownOpen(false)
      if (bemDropdownOpen && !e.target.closest('[data-dropdown-bem]')) setBemDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen, bemDropdownOpen])

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
          <div className="hidden md:flex items-center justify-center gap-1 bg-white/70 dark:bg-black/70 backdrop-blur-xl py-1.5 px-2 rounded-full border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
            <Link to="/" className="flex items-center gap-2 px-3 py-1.5 mr-1 shrink-0" onClick={() => setActiveTab('Beranda')}>
              <img src={logo} alt="ILKOM" className="h-7 w-auto" />
              <span className="text-sm font-bold tracking-tight text-black dark:text-white hidden min-[800px]:inline">ILKOM NEWS</span>
            </Link>

            {navItems.map((item) => {
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

            {/* Aktivitas Dropdown */}
            <div className="relative" data-dropdown>
              <motion.button
                onClick={() => { setDropdownOpen(!dropdownOpen); setBemDropdownOpen(false) }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-1.5 cursor-pointer px-4 py-2 rounded-full transition-all text-[13px] font-semibold tracking-wide uppercase ${
                  activeTab === 'Aktivitas'
                    ? 'bg-purple-100/80 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                    : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <span className="hidden md:inline">Aktivitas</span>
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, scale: 0.95, filter: 'blur(4px)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="absolute top-full left-0 mt-2 w-60 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden p-1.5"
                  >
                    {activityItems.map((item, index) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Link
                            to={item.path}
                            onClick={() => { setActiveTab('Aktivitas'); setDropdownOpen(false) }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-900/20 text-purple-700 dark:text-purple-300 shadow-sm'
                                : 'text-neutral-700 dark:text-neutral-200 hover:bg-purple-50/70 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300'
                            }`}
                          >
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            >
                              <Icon size={16} className={isActive ? 'text-purple-600 dark:text-purple-400' : ''} />
                            </motion.div>
                            <span>{item.name}</span>
                            {isActive && (
                              <motion.div
                                layoutId="aktivitas-active"
                                className="ml-auto w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BEM Apps Dropdown */}
            <div className="relative" data-dropdown-bem>
              <motion.button
                onClick={() => { setBemDropdownOpen(!bemDropdownOpen); setDropdownOpen(false) }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 cursor-pointer px-4 py-2 rounded-full transition-all text-[13px] font-semibold tracking-wide uppercase text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                <span className="hidden md:inline">BEM Apps</span>
                <motion.div
                  animate={{ rotate: bemDropdownOpen ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {bemDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, scale: 0.95, filter: 'blur(4px)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden p-1.5"
                  >
                    {bemApps.map((app, index) => {
                      const Icon = app.icon
                      return (
                        <motion.div
                          key={app.name}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-purple-50/70 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200"
                          >
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: -5 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            >
                              <Icon size={16} />
                            </motion.div>
                            <span>{app.name}</span>
                            <ExternalLink size={12} className="ml-auto opacity-40" />
                          </a>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="ml-1 pl-2 border-l border-black/[0.08] dark:border-white/[0.12] flex items-center gap-1">
              <NotificationPopover />
              <AnimatedThemeToggle />
            </div>
          </div>

          {/* Mobile — solid navbar */}
          <div className="md:hidden flex items-center justify-between w-full bg-white/70 dark:bg-black/70 backdrop-blur-xl py-2 px-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
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
                <div className="px-4 py-2 text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider">Aktivitas</div>
                {activityItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.name} to={item.path}
                      onClick={() => { setActiveTab('Aktivitas'); setMobileOpen(false) }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-black/70 dark:text-white/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
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

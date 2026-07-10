import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X, Home, Newspaper, Image, ExternalLink, Users, ChevronDown, Send, Search, Bookmark } from 'lucide-react'
import { AnimatedThemeToggle } from '../ui/AnimatedThemeToggle'
import NotificationPopover from '../ui/NotificationPopover'
import logo from '../../assets/BEM.png'

const navItems = [
  { name: 'Beranda', path: '/', icon: Home },
  { name: 'Berita', path: '/news', icon: Newspaper },
  { name: 'Ilkom Gallery', path: '/ilkomgallery', icon: Image },
]

const MotionLink = motion.create(Link)

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
  const reduce = useReducedMotion()
  const [activeTab, setActiveTab] = useState('Beranda')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [bemDropdownOpen, setBemDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const current = navItems.find(item => item.path === location.pathname)
    const currentActivity = activityItems.find(item => item.path === location.pathname)
    if (current) setActiveTab(current.name)
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
          className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
        >
          {/* Desktop — sleek compact navbar */}
          <div className="hidden md:flex items-center justify-center gap-1 bg-white/80 dark:bg-black/80 backdrop-blur-xl py-2 px-2 rounded-full border border-black/[0.06] dark:border-white/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
            <Link to="/" className="flex items-center gap-2 px-2.5 py-1.5 mr-0.5 shrink-0 group" onClick={() => setActiveTab('Beranda')}>
              <motion.img 
                src={logo} 
                alt="ILKOM" 
                className="h-5 w-auto transition-transform duration-200 group-hover:scale-105" 
              />
            </Link>

            {navItems.map((item, index) => {
              const isActive = activeTab === item.name
              return (
                <MotionLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setActiveTab(item.name)}
                  onMouseEnter={() => setHovered(item.name)}
                  onMouseLeave={() => setHovered(null)}
                  whileHover={reduce ? undefined : { scale: 1.06 }}
                  whileTap={reduce ? undefined : { scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`relative cursor-pointer px-4 py-2 rounded-full transition-all duration-200 text-xs font-semibold tracking-wide uppercase hover-underline ${
                    isActive
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)] dark:text-[var(--accent)]'
                      : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  {(hovered === item.name || activeTab === item.name) && (
                    <motion.span
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 mx-auto w-3 h-[2px] bg-[var(--accent)] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </MotionLink>
              )
            })}

            {/* Aktivitas Dropdown */}
            <div className="relative" data-dropdown>
              <motion.button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setHovered('Aktivitas')}
                onMouseLeave={() => setHovered(null)}
                whileHover={reduce ? undefined : { scale: 1.06 }}
                whileTap={reduce ? undefined : { scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`relative cursor-pointer px-3 py-1.5 rounded-full transition-all duration-200 text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1 hover-underline ${
                  activeTab === 'Aktivitas'
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)] dark:text-[var(--accent)]'
                    : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
                }`}
              >
                Aktivitas
                <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={12} />
                </motion.span>
                {(hovered === 'Aktivitas' || activeTab === 'Aktivitas') && (
                  <motion.span
                    layoutId="navIndicator"
                    className="absolute bottom-0 left-0 right-0 mx-auto w-3 h-[2px] bg-[var(--accent)] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
               </motion.button>

               <AnimatePresence>
                 {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 min-w-[180px] bg-white dark:bg-neutral-900 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] shadow-xl overflow-hidden p-1.5"
                  >
                    {activityItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link 
                          key={item.name} 
                          to={item.path}
                          onClick={() => { setActiveTab('Aktivitas'); setDropdownOpen(false) }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-black/70 dark:text-white/70 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] hover-underline transition-colors duration-100"
                        >
                          <Icon size={16} />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BEM Apps Dropdown */}
            <div className="relative" data-dropdown-bem>
              <motion.button
                onClick={() => setBemDropdownOpen(!bemDropdownOpen)}
                whileHover={reduce ? undefined : { scale: 1.06 }}
                whileTap={reduce ? undefined : { scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative cursor-pointer px-3 py-1.5 rounded-full transition-all duration-200 text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
              >
                BEM Apps
                <motion.span animate={{ rotate: bemDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={12} />
                 </motion.span>
               </motion.button>

               <AnimatePresence>
                 {bemDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 min-w-[180px] bg-white dark:bg-neutral-900 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] shadow-xl overflow-hidden p-1.5"
                  >
                    {bemApps.map((app) => {
                      const Icon = app.icon
                      return (
                        <a 
                          key={app.name} 
                          href={app.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => setBemDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-black/70 dark:text-white/70 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] hover-underline transition-colors duration-100"
                        >
                          <Icon size={16} />
                          <span>{app.name}</span>
                          <ExternalLink size={12} className="ml-auto opacity-30" />
                        </a>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="ml-0.5 pl-1.5 border-l border-black/[0.06] dark:border-white/[0.06] flex items-center gap-0.5">
              <NotificationPopover />
              <AnimatedThemeToggle />
            </div>
          </div>

          {/* Mobile — compact navbar */}
          <div className="md:hidden flex items-center justify-between w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl py-2.5 px-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <motion.img 
                src={logo} 
                alt="ILKOM" 
                className="h-5 w-auto transition-transform duration-200 group-hover:scale-105" 
              />
            </Link>
            <div className="flex items-center gap-1.5">
              <NotificationPopover />
              <AnimatedThemeToggle />
              <motion.button 
                onClick={() => setMobileOpen(!mobileOpen)} 
                whileHover={reduce ? undefined : { scale: 1.06 }}
                whileTap={reduce ? undefined : { scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors"
              >
                <motion.div
                  animate={{ rotate: mobileOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                 {mobileOpen ? <X size={18} className="text-black dark:text-white" /> : <Menu size={18} className="text-black dark:text-white" />}
                 </motion.div>
               </motion.button>
            </div>
          </div>

          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white dark:bg-neutral-900 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] shadow-2xl overflow-hidden p-1.5"
            >
              {navItems.map((item, idx) => {
                const Icon = item.icon
                return (
              <MotionLink 
                key={item.name} 
                to={item.path}
                onClick={() => { setActiveTab(item.name); setMobileOpen(false) }}
                whileHover={reduce ? undefined : { scale: 1.06 }}
                whileTap={reduce ? undefined : { scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-100 hover-underline ${
                  activeTab === item.name
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'text-black/70 dark:text-white/70 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]'
                }`}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </MotionLink>
                )
              })}
              <div className="border-t border-black/[0.06] dark:border-white/[0.06] mt-1 pt-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider">Aktivitas</div>
                {activityItems.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <MotionLink 
                      key={item.name} 
                      to={item.path}
                      onClick={() => { setActiveTab('Aktivitas'); setMobileOpen(false) }}
                      whileHover={reduce ? undefined : { scale: 1.06 }}
                      whileTap={reduce ? undefined : { scale: 0.94 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-black/70 dark:text-white/70 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] hover-underline transition-colors duration-100"
                      style={{ animationDelay: `${(idx + 3) * 30}ms` }}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </MotionLink>
                  )
                })}
              </div>
              <div className="border-t border-black/[0.06] dark:border-white/[0.06] mt-1 pt-1">
                {bemApps.map((app, idx) => {
                  const Icon = app.icon
                  return (
                    <a 
                      key={app.name} 
                      href={app.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-black/70 dark:text-white/70 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] hover-underline transition-colors duration-100"
                      style={{ animationDelay: `${(idx + 6) * 30}ms` }}
                    >
                      <Icon size={16} />
                      <span>{app.name}</span>
                      <ExternalLink size={12} className="ml-auto opacity-30" />
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

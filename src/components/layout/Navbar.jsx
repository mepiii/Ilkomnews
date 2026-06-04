import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, Newspaper, BookOpen, Calendar, Image, Info, ChevronRight, ChevronDown, ExternalLink, Users } from 'lucide-react'
import logo from '../../assets/BEM.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAtTop, setIsAtTop] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const location = useLocation()
  const mobileMenuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const dropdownRef = useRef(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 20)
      setIsAtTop(scrollY < 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }

      // Close dropdown if click outside
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false)
      }
    }

    const handleEscKey = (event) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false)
      }
      if (dropdownOpen && event.key === 'Escape') {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscKey)
    
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, dropdownOpen])

  const isHomePage = location.pathname === '/'
  const isHeroSection = isHomePage && isAtTop

  const navItems = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Berita', path: '/news', icon: Newspaper },
    { name: 'Artikel', path: '/articles', icon: BookOpen },
    { name: 'Event', path: '/events', icon: Calendar },
    { name: 'Ilkom Gallery', path: '/ilkomgallery', icon: Image },
    { name: 'Tentang', path: '/about', icon: Info },
  ]

  const bemAppsDropdown = [
    { 
      name: 'SAPA', 
      url: 'https://sapa.bemfasilkomunsri.org/', // Ganti dengan URL yang sesuai
      icon: Users 
    },
    { 
      name: 'BEM Official', 
      url: 'https://bemfasilkomunsri.org/', // Ganti dengan URL yang sesuai
      icon: ExternalLink 
    },
  ]

  const isActive = (path) => location.pathname === path

  // Fungsi untuk navigasi tanpa membuka tab baru
  const handleNavigation = (url) => {
    window.location.href = url // Ini akan mengganti halaman di tab yang sama
  }

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled || !isHeroSection
          ? 'bg-[#1A0533]/95 backdrop-blur-md shadow-2xl py-2' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="ILKOM NEWS Logo" 
                  className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-[#C084FC]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
              
              <div className="flex flex-col">
                <span className={`text-xl font-bold leading-tight transition-colors duration-300 ${
                  !scrolled && isHeroSection 
                    ? 'text-white drop-shadow-md' 
                    : 'text-white'
                }`}>
                  ILKOM NEWS
                </span>
                <span className={`text-[10px] font-medium tracking-wider transition-colors duration-300 ${
                  !scrolled && isHeroSection ? 'text-white/70' : 'text-[#FFC148]'
                }`}>
                  FAKULTAS ILMU KOMPUTER
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative group px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      active 
                        ? 'bg-white text-[#7C3AED] shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={18} className={`transition-all duration-300 ${
                      active 
                        ? 'text-[#7C3AED]' 
                        : 'text-white/80 group-hover:text-white group-hover:scale-110 group-hover:rotate-6'
                    }`} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              {/* BEM Apps Dropdown - Desktop */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="relative group px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <ExternalLink size={18} className="text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  <span>BEM Apps</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#1A0533] backdrop-blur-md rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-slide-down">
                    {bemAppsDropdown.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={index}
                          onClick={() => handleNavigation(item.url)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 group"
                        >
                          <Icon size={16} className="group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-sm font-medium">{item.name}</span>
                          <ExternalLink size={12} className="ml-auto opacity-50 group-hover:opacity-100" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                ref={menuButtonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none group ${
                  !scrolled && isHeroSection
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {isOpen ? (
                  <X size={22} className="text-white group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Menu size={22} className="text-white group-hover:scale-110 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay & Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          <div 
            ref={mobileMenuRef}
            className="md:hidden fixed top-16 left-0 right-0 bg-[#1A0533] backdrop-blur-md shadow-2xl z-40 animate-slide-down max-h-[calc(100vh-4rem)] overflow-y-auto"
            style={{
              borderImage: 'linear-gradient(90deg, #1A0533, #A855F7, #C084FC, #A855F7, #1A0533) 1',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderImageSlice: 1
            }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 ${
                        active
                          ? 'bg-white text-[#7C3AED] shadow-lg'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                          active 
                            ? 'bg-[#7C3AED]/10' 
                            : 'bg-white/10 group-hover:bg-white/20'
                        }`}>
                          <Icon size={18} className={active ? 'text-[#7C3AED]' : 'text-white/70'} />
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <ChevronRight size={16} className={`transition-all duration-300 ${
                        active 
                          ? 'translate-x-1 text-[#7C3AED]' 
                          : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                      }`} />
                    </Link>
                  )
                })}

                {/* BEM Apps Dropdown - Mobile */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className="group flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                        <ExternalLink size={18} className="text-white/70" />
                      </div>
                      <span className="font-medium">BEM Apps</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mobile Dropdown Content */}
                  {mobileDropdownOpen && (
                    <div className="ml-4 flex flex-col gap-2 animate-slide-down">
                      {bemAppsDropdown.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              handleNavigation(item.url)
                              setIsOpen(false)
                            }}
                            className="group flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-300 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 w-full"
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={16} className="text-white/70" />
                              <span className="font-medium text-sm">{item.name}</span>
                            </div>
                            <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>ILKOM NEWS v1.0</span>
                  <span>© 2024 UNIKOM</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  )
}

export default Navbar
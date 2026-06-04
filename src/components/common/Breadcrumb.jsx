// src/components/common/Breadcrumb.js
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { getTitleFromSlug, hasIdInSlug, getIdFromSlug } from '../../utils/formatters'
import logo from '../../assets/BEM.png'

const Breadcrumb = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)
  const [detailTitle, setDetailTitle] = useState(null)

  useEffect(() => {
    const lastPath = pathnames[pathnames.length - 1]
    
    // Cek apakah ini halaman detail
    const isDetailPage = pathnames.length >= 2 && 
      ['news', 'articles', 'events', 'career'].includes(pathnames[pathnames.length - 2])
    
    if (isDetailPage && lastPath) {
      // Jika slug memiliki ID di akhir, ambil title dari slug
      if (hasIdInSlug(lastPath)) {
        const titleFromSlug = getTitleFromSlug(lastPath)
        // Capitalize title
        const capitalized = titleFromSlug.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
        setDetailTitle(capitalized)
      } 
      // Jika slug adalah ID numeric, tampilkan "Detail"
      else if (/^\d+$/.test(lastPath)) {
        setDetailTitle('Detail Berita')
      }
      // Jika slug murni tanpa ID
      else {
        const titleFromSlug = getTitleFromSlug(lastPath)
        const capitalized = titleFromSlug.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
        setDetailTitle(capitalized)
      }
    } else {
      setDetailTitle(null)
    }
  }, [location.pathname])

  const getPathName = (path, isLast = false) => {
    if (isLast && detailTitle) {
      return detailTitle
    }
    
    const names = {
      'news': 'Berita',
      'articles': 'Artikel',
      'events': 'Event',
      'career': 'Karir',
      'ilkom-gallery': 'ILKOM Gallery',
      'ilkomgallery': 'ILKOM Gallery',
      'about': 'Tentang',
      'detail': 'Detail'
    }
    
    // Untuk slug di tengah path (bukan last)
    if (path.includes('-') && !isLast) {
      return getTitleFromSlug(path)
    }
    
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
  }

  return (
    <nav className="mb-8">
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-2xl border border-purple-200 px-6 py-4">
        {/* Diagonal Stripes Pattern */}
        <div className="absolute inset-0 opacity-[0.13]">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagonalStripes" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="30" stroke="#7c3aed" strokeWidth="1.2" />
                <line x1="15" y1="0" x2="15" y2="30" stroke="#a855f7" strokeWidth="0.8" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonalStripes)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <ol className="flex items-center flex-wrap gap-2">
            <li>
              <Link 
                to="/" 
                className="flex items-center gap-2 px-1 py-1 text-purple-600 hover:text-purple-800 transition-all duration-300 group"
              >
                <div className="p-1.5 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                  <Home size={16} className="text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-purple-700">Beranda</span>
              </Link>
            </li>

            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
              const isLast = index === pathnames.length - 1
              const displayName = getPathName(name, isLast)
              
              return (
                <React.Fragment key={`${name}-${index}`}>
                  <li className="text-purple-300 opacity-60">
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </li>

                  <li>
                    {isLast ? (
                      <div className="flex items-center gap-2 px-3 py-1.5">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700"></div>
                        <span className="text-purple-700 font-bold text-sm tracking-wide line-clamp-1 max-w-md">
                          {displayName}
                        </span>
                      </div>
                    ) : (
                      <Link 
                        to={routeTo} 
                        className="group relative px-3 py-1.5 text-gray-600 hover:text-purple-600 text-sm font-medium transition-all duration-300"
                      >
                        {displayName}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-700 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    )}
                  </li>
                </React.Fragment>
              )
            })}
          </ol>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-purple-300 to-transparent"></div>
            <img 
              src={logo} 
              alt="ILKOM NEWS Logo" 
              className="h-8 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-purple-700 leading-tight">ILKOM</p>
              <p className="text-[8px] text-purple-500">NEWS</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </nav>
  )
}

export default Breadcrumb
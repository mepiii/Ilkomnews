import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumb = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  const getPathName = (path) => {
    const names = {
      'news': 'Berita',
      'articles': 'Artikel',
      'events': 'Event',
      'ilkom-gallery': 'ILKOM Gallery',
      'ilkomgallery': 'ILKOM Gallery',
      'about': 'Tentang',
      'detail': 'Detail'
    }
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1)
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
        <ol className="relative z-10 flex items-center flex-wrap gap-2">
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
            
            return (
              <React.Fragment key={name}>
                <li className="text-purple-300 opacity-60">
                  <ChevronRight size={18} strokeWidth={2.5} />
                </li>

                <li>
                  {isLast ? (
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700"></div>
                      <span className="text-purple-700 font-bold text-sm tracking-wide">
                        {getPathName(name)}
                      </span>
                    </div>
                  ) : (
                    <Link 
                      to={routeTo} 
                      className="group relative px-3 py-1.5 text-gray-600 hover:text-purple-600 text-sm font-medium transition-all duration-300"
                    >
                      {getPathName(name)}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-700 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  )}
                </li>
              </React.Fragment>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumb
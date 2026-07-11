import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { getTitleFromSlug } from '../../utils/formatters'

const capitalize = str => str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')

const Breadcrumb = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)
  const lastPath = pathnames[pathnames.length - 1]
  const isDetailPage = pathnames.length >= 2 &&
    ['news', 'articles'].includes(pathnames[pathnames.length - 2])

  // ponytail: derived from pathname — no state/effect needed
  const detailTitle = isDetailPage && lastPath
    ? (/^\d+$/.test(lastPath) ? 'Detail Berita' : capitalize(getTitleFromSlug(lastPath)))
    : null

  const getPathName = (path, isLast = false) => {
    if (isLast && detailTitle) return detailTitle
    const names = { 'news': 'Berita', 'articles': 'Artikel', 'ilkom-gallery': 'ILKOM Gallery', 'ilkomgallery': 'ILKOM Gallery', 'about': 'Tentang', 'detail': 'Detail' }
    if (path.includes('-') && !isLast) return getTitleFromSlug(path)
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
  }

  if (pathnames.length === 0) return null

  return (
    <nav className="mb-8 min-h-[20px]">
      <div className="flex items-center gap-2 flex-wrap min-h-[20px]">
        <Link to="/" className="flex items-center gap-1.5 text-theme-muted hover:text-theme-primary transition-colors text-sm">
          <Home size={14} />
          <span className="font-medium">Beranda</span>
        </Link>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1
          const displayName = getPathName(name, isLast)

          return (
            <div key={`${name}-${index}`} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-theme-muted/50" />
              {isLast ? (
                <span className="text-sm font-semibold text-theme-primary">{displayName}</span>
              ) : (
                <Link to={routeTo} className="text-sm text-theme-muted hover:text-theme-primary transition-colors font-medium">
                  {displayName}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

export default Breadcrumb

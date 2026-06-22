import { ArrowRight } from 'lucide-react'

const DestinationCard = ({ imageUrl, title, subtitle, stats, href, themeColor = '280 60% 50%', className = '' }) => {
  return (
    <div
      style={{ '--theme-color': themeColor }}
      className={`group w-full h-full ${className}`}
    >
      <a
        href={href}
        className="relative block w-full h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-in-out group-hover:scale-[1.03] group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)]"
        style={{ boxShadow: '0 0 40px -15px hsl(var(--theme-color) / 0.4)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, hsl(var(--theme-color) / 0.9), hsl(var(--theme-color) / 0.5) 40%, transparent 70%)` }}
        />
        <div className="relative flex flex-col justify-end h-full p-6 text-white min-h-[280px]">
          <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
          {subtitle && <p className="text-sm text-white/80 mt-1 font-medium">{subtitle}</p>}
          {stats && <p className="text-xs text-white/60 mt-1">{stats}</p>}
          <div className="mt-6 flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/30">
            <span className="text-sm font-semibold tracking-wide">Explore Now</span>
            <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </a>
    </div>
  )
}

export { DestinationCard }

import { ChevronRight, Newspaper, Radio, Bell } from 'lucide-react'

const MarqueeContent = ({ children }) => (
  <>
    <div className="flex items-center gap-4 px-6">{children}</div>
    <div className="flex items-center gap-4 px-6">{children}</div>
    <div className="flex items-center gap-4 px-6">{children}</div>
  </>
)

const AnimatedSeparator = ({ variant = 'purple' }) => {
  const textStyle = { fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }

  if (variant === 'purple') {
    const text = (
      <>
        <Newspaper size={12} className="text-purple-300 inline" />
        <span className="font-custom" style={textStyle}>ILKOM NEWS</span>
        <ChevronRight size={10} className="text-purple-300/50" />
        <span className="font-custom" style={textStyle}>BERITA TERKINI</span>
        <ChevronRight size={10} className="text-purple-300/50" />
        <span className="font-custom" style={textStyle}>FAKULTAS ILMU KOMPUTER</span>
        <ChevronRight size={10} className="text-purple-300/50" />
        <span className="font-custom" style={textStyle}>UNIKOM</span>
        <Radio size={12} className="text-purple-300 inline" />
      </>
    )

    return (
      <div className="relative w-full py-2.5 border-y border-theme">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/30 via-transparent to-purple-50/30 animate-shine" />
        </div>
        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'fit-content' }}>
            <MarqueeContent>{text}</MarqueeContent>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'gallery') {
    const text = (
      <>
        <Bell size={12} className="text-purple-300" />
        <span className="font-custom" style={textStyle}>ILKOM GALLERY</span>
        <ChevronRight size={10} className="text-purple-300/50" />
        <span className="font-custom" style={textStyle}>MOMENT TERBAIK</span>
        <ChevronRight size={10} className="text-purple-300/50" />
        <span className="font-custom" style={textStyle}>DOKUMENTASI KEGIATAN</span>
        <Bell size={12} className="text-purple-300" />
      </>
    )

    return (
      <div className="relative w-full py-2.5 border-y border-theme">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/20 via-transparent to-purple-50/20 animate-shine-slow" />
        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee-reverse whitespace-nowrap" style={{ width: 'fit-content' }}>
            <MarqueeContent>{text}</MarqueeContent>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'line') {
    return (
      <div className="relative w-full py-3">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      </div>
    )
  }

  if (variant === 'double-line') {
    return (
      <div className="relative w-full py-4">
        <div className="flex flex-col gap-2">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-600 to-transparent" />
        </div>
      </div>
    )
  }

  // Default purple variant
  const text = (
    <>
      <Newspaper size={12} className="text-purple-500" />
      <span className="font-custom" style={textStyle}>ILKOM NEWS</span>
      <ChevronRight size={10} className="text-purple-300/50" />
      <span className="font-custom" style={textStyle}>BERITA TERKINI</span>
      <ChevronRight size={10} className="text-purple-300/50" />
      <span className="font-custom" style={textStyle}>FAKULTAS ILMU KOMPUTER</span>
      <Radio size={12} className="text-purple-500" />
    </>
  )

  return (
    <div className="relative w-full overflow-hidden bg-theme-secondary py-2.5 border-y border-theme">        <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'fit-content' }}>
          <MarqueeContent>{text}</MarqueeContent>
        </div>
      </div>
    </div>
  )
}

export default AnimatedSeparator

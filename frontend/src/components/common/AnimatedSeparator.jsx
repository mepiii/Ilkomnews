import { ChevronRight, Newspaper, Radio, Bell } from 'lucide-react'

const MarqueeContent = ({ children, hidden = false }) => (
  <>
    <div className="flex items-center gap-4 px-6">{children}</div>
    {/* ponytail: duplicate track for seamless loop; hidden from SR to avoid double-read */}
    <div className="flex items-center gap-4 px-6" aria-hidden="true">{children}</div>
    <div className="flex items-center gap-4 px-6" aria-hidden="true">{children}</div>
  </>
)

const AnimatedSeparator = ({ variant = 'purple' }) => {
  const textStyle = { fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }
  const iconColor = 'rgb(72, 22, 120)'
  const fadeColor = 'rgba(72, 22, 120, 0.5)'

  if (variant === 'purple') {
    const text = (
      <>
        <Newspaper size={12} style={{ color: iconColor }} className="inline" />
        <span className="font-custom" style={textStyle}>ILKOM NEWS</span>
        <ChevronRight size={10} style={{ color: fadeColor }} />
        <span className="font-custom" style={textStyle}>BERITA TERKINI</span>
        <ChevronRight size={10} style={{ color: fadeColor }} />
        <span className="font-custom" style={textStyle}>FAKULTAS ILMU KOMPUTER</span>
        <ChevronRight size={10} style={{ color: fadeColor }} />
        <span className="font-custom" style={textStyle}>UNIKOM</span>
        <Radio size={12} style={{ color: iconColor }} className="inline" />
      </>
    )

    return (
      <div className="relative w-full h-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 py-2 border-y border-theme">
          <div className="relative flex overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'fit-content' }}>
              <MarqueeContent>{text}</MarqueeContent>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'gallery') {
    const text = (
      <>
        <Bell size={12} style={{ color: iconColor }} />
        <span className="font-custom" style={textStyle}>ILKOM GALLERY</span>
        <ChevronRight size={10} style={{ color: fadeColor }} />
        <span className="font-custom" style={textStyle}>MOMENT TERBAIK</span>
        <ChevronRight size={10} style={{ color: fadeColor }} />
        <span className="font-custom" style={textStyle}>DOKUMENTASI KEGIATAN</span>
        <Bell size={12} style={{ color: iconColor }} />
      </>
    )

    return (
      <div className="relative w-full py-2.5 border-y border-theme">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(122,71,166,0.06)] via-transparent to-[rgba(122,71,166,0.06)] animate-shine-slow" />
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
      <div className="relative w-full h-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[rgb(122,71,166)] to-transparent" />
      </div>
    )
  }

  if (variant === 'double-line') {
    return (
      <div className="relative w-full py-4">
        <div className="flex flex-col gap-2">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(122,71,166)]/60 to-transparent" />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(48,11,85)] to-transparent" />
        </div>
      </div>
    )
  }

  // Default purple variant
  const text = (
    <>
      <Newspaper size={12} style={{ color: iconColor }} />
      <span className="font-custom" style={textStyle}>ILKOM NEWS</span>
      <ChevronRight size={10} style={{ color: fadeColor }} />
      <span className="font-custom" style={textStyle}>BERITA TERKINI</span>
      <ChevronRight size={10} style={{ color: fadeColor }} />
      <span className="font-custom" style={textStyle}>FAKULTAS ILMU KOMPUTER</span>
      <Radio size={12} style={{ color: iconColor }} />
    </>
  )

  return (
    <div className="relative w-full overflow-hidden bg-theme-secondary py-2.5 border-y border-theme">
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'fit-content' }}>
          <MarqueeContent>{text}</MarqueeContent>
        </div>
      </div>
    </div>
  )
}

export default AnimatedSeparator

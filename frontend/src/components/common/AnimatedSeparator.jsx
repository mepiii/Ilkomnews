import { ChevronRight, Newspaper, Radio, Bell } from 'lucide-react'

const AnimatedSeparator = ({ variant = "purple" }) => {
  
  // Purple & White Style - TEKS BERJALAN SEAMLESS
  if (variant === "purple") {
    const textContent = (
      <>
        <Newspaper size={12} className="text-purple-300 inline" />
        <span className="font-custom" style={{ fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }}>ILKOM NEWS</span>
        <ChevronRight size={10} className="text-purple-300/50" />
        <span className="font-custom" style={{ fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }}>BERITA TERKINI</span>
        <ChevronRight size={10} className="text-purple-300/50" />
        <span className="font-custom" style={{ fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }}>FAKULTAS ILMU KOMPUTER</span>
        <ChevronRight size={10} className="text-purple-300/50" />
        <span className="font-custom" style={{ fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }}>UNIKOM</span>
        <Radio size={12} className="text-purple-300 inline" />
      </>
    )
    
    return (
      <div className="relative w-full bg-theme-secondary py-2.5 border-y border-theme">
        {/* Subtle Shine Effect */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/30 via-transparent to-purple-50/30 animate-shine"></div>
        </div>

        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {/* Copy 1 */}
            <div className="flex items-center gap-4 px-6">
              {textContent}
            </div>
            {/* Copy 2 - Untuk seamless */}
            <div className="flex items-center gap-4 px-6">
              {textContent}
            </div>
            {/* Copy 3 - Untuk memastikan seamless di semua ukuran layar */}
            <div className="flex items-center gap-4 px-6">
              {textContent}
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.33%);
            }
          }
          
          .animate-marquee {
            animation: marquee 25s linear infinite;
            width: fit-content;
          }
          
          @keyframes shine {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          .animate-shine {
            animation: shine 8s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }
  
  // White & Purple variant untuk Gallery (teks berjalan arah berbeda)
  if (variant === "gallery") {
    const textContent = (
      <>
        <Bell size={12} className="text-purple-300" />
        <span className="font-custom" style={{ fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }}>ILKOM GALLERY</span>
        <ChevronRight size={10} className="text-purple-300/50" />
        <span className="font-custom" style={{ fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }}>MOMENT TERBAIK</span>
        <ChevronRight size={10} className="text-purple-300/50" />
        <span className="font-custom" style={{ fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }}>DOKUMENTASI KEGIATAN</span>
        <Bell size={12} className="text-purple-300" />
      </>
    )
    
    return (
      <div className="relative w-full bg-theme-secondary py-2.5 border-y border-theme">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/20 via-transparent to-purple-50/20 animate-shine-slow"></div>

        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee-reverse whitespace-nowrap">
            <div className="flex items-center gap-4 px-6">
              {textContent}
            </div>
            <div className="flex items-center gap-4 px-6">
              {textContent}
            </div>
            <div className="flex items-center gap-4 px-6">
              {textContent}
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes marquee-reverse {
            0% {
              transform: translateX(-33.33%);
            }
            100% {
              transform: translateX(0);
            }
          }
          
          .animate-marquee-reverse {
            animation: marquee-reverse 25s linear infinite;
            width: fit-content;
          }
          
          @keyframes shine-slow {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          .animate-shine-slow {
            animation: shine-slow 12s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }
  
  // Purple Gradient Line (pembatas tebal)
  if (variant === "line") {
    return (
      <div className="relative w-full py-3">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
      </div>
    )
  }
  
  // Double Line (pembatas lebih tebal)
  if (variant === "double-line") {
    return (
      <div className="relative w-full py-4">
        <div className="flex flex-col gap-2">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
        </div>
      </div>
    )
  }
  
  // Default Purple
  const textContent = (
    <>
      <Newspaper size={12} className="text-purple-500" />
      <span className="font-custom" style={{ fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }}>ILKOM NEWS</span>
      <ChevronRight size={10} className="text-purple-300/50" />
      <span className="font-custom" style={{ fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }}>BERITA TERKINI</span>
      <ChevronRight size={10} className="text-purple-300/50" />
      <span className="font-custom" style={{ fontFamily: 'CustomFont, sans-serif', letterSpacing: '1px' }}>FAKULTAS ILMU KOMPUTER</span>
      <Radio size={12} className="text-purple-500" />
    </>
  )
  
  return (
    <div className="relative w-full overflow-hidden bg-theme-secondary py-2.5 border-y border-theme">
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-4 px-6">
            {textContent}
          </div>
          <div className="flex items-center gap-4 px-6">
            {textContent}
          </div>
          <div className="flex items-center gap-4 px-6">
            {textContent}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: fit-content;
        }
      `}</style>
    </div>
  )
}

export default AnimatedSeparator
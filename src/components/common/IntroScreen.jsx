import React, { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import gedungFasilkom from '../../assets/gedungfasilkom.jpg'

const IntroScreen = () => {
  const [fadeOut, setFadeOut] = useState(false)
  const [progress, setProgress] = useState(0)

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 35)

    return () => clearInterval(interval)
  }, [])

  // Fade out setelah progress selesai
  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setFadeOut(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [progress])

  // Style untuk custom font
  const customFontStyle = {
    fontFamily: 'CustomFont, sans-serif'
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-700 ${fadeOut ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Background Image dengan Blur */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${gedungFasilkom})`,
            filter: 'blur(16px) scale(1.1)',
          }}
        >
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/95"></div>
        </div>

        {/* Background Image Tanpa Blur untuk texture */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-15"
          style={{ 
            backgroundImage: `url(${gedungFasilkom})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-black/50"></div>
        </div>

        {/* Kotak-kotak Pattern (Grid) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(168, 85, 247, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(168, 85, 247, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}></div>
        </div>

        {/* Decorative Blur Circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-600 rounded-full opacity-30 blur-[100px]"></div>
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-500 rounded-full opacity-30 blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-700 rounded-full opacity-10 blur-[120px]"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        
        {/* Badge */}
        <div className="mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 backdrop-blur-md border border-purple-500/30 rounded-full px-6 py-2.5">
            <span className="text-purple-300 text-sm font-medium tracking-wide">FASILKOM UNSRI</span>
          </div>
        </div>

        {/* Main Title dengan Custom Font */}
        <div className="mb-6 animate-fade-up animation-delay-100">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-4">
            <span 
              className="inline-block bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent"
              style={customFontStyle}
            >
              ILKOM NEWS
            </span>
          </h1>
        </div>

        {/* Garis dekoratif */}
        <div className="animate-fade-up animation-delay-200">
          <div className="h-0.5 w-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full"></div>
        </div>

        {/* Deskripsi */}
        <div className="animate-fade-up animation-delay-300">
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Informasi terkini untuk mahasiswa Ilmu Komputer
            <br />
            FASILKOM Universitas Sriwijaya
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mt-8 animate-fade-up animation-delay-400">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3 backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-white/50 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
              Memuat konten...
            </span>
            <span className="font-mono text-purple-400 font-semibold">{progress}%</span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="mt-8 flex justify-center gap-2 animate-fade-up animation-delay-500">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"
              style={{ animationDelay: `${dot * 0.2}s` }}
            ></div>
          ))}
        </div>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default IntroScreen
import { useEffect, useState } from 'react'
import { AnimatedText } from '../ui/AnimatedText'
import gedungFasilkom from '../../assets/gedungfasilkom.jpg'

const IntroScreen = () => {
  const [fadeOut, setFadeOut] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100 }
        return prev + 2
      })
    }, 35)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setFadeOut(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [progress])

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-700 ${fadeOut ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${gedungFasilkom})`, filter: 'blur(16px) scale(1.1)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/95" />
        </div>
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: `url(${gedungFasilkom})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-black/50" />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(to right, rgba(168, 85, 247, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 85, 247, 0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2.5 border border-white/15 rounded-full bg-white/5 backdrop-blur-sm p-1 text-sm text-white mb-8">
            <div className="bg-white/10 border border-white/15 rounded-2xl px-3 py-1">
              <p className="text-xs font-semibold tracking-wide uppercase">Fakultas Ilmu Komputer</p>
            </div>
            <p className="pr-3 text-xs text-white/50">Universitas Sriwijaya</p>
          </div>
        </div>

        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-4">
            <span
              className="inline-block bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent"
              style={{ fontFamily: 'CustomFont, sans-serif' }}
            >
              <AnimatedText>ILKOM NEWS</AnimatedText>
            </span>
          </h1>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="h-0.5 w-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full" />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Informasi terkini untuk mahasiswa Ilmu Komputer<br />FASILKOM Universitas Sriwijaya
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="w-full h-1.5 glass-card rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-white/50 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
              Memuat konten...
            </span>
            <span className="font-mono text-purple-400 font-semibold">{progress}%</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"
              style={{ animationDelay: `${dot * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default IntroScreen

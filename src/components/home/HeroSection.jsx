import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Zap } from 'lucide-react'
import heroImage from '../../assets/gedungfasilkom.jpg'

const HeroSection = () => {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            entry.target.classList.remove('out-view')
          } else {
            entry.target.classList.add('out-view')
            entry.target.classList.remove('in-view')
          }
        })
      },
      { threshold: 0.2 }
    )

    const elements = document.querySelectorAll('.hero-animate')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  // Style untuk custom font
  const customFontStyle = {
    fontFamily: 'CustomFont, sans-serif'
  }

  return (
    <div ref={sectionRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      
      {/* Background Image dengan Blur Lebih Kuat */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          filter: 'blur(16px) scale(1.1)',
        }}
      >
        {/* Dark Gradient Overlay - Lebih Gelap untuk menutupi burik */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/95"></div>
      </div>

      {/* Background Image Tanpa Blur dengan opacity sangat rendah untuk texture */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-15"
        style={{ 
          backgroundImage: `url(${heroImage})`,
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

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center">
          
          {/* Badge - Tanpa Icon */}
          <div className="hero-animate transition-all duration-700 translate-y-10 opacity-0">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 backdrop-blur-md border border-purple-500/30 rounded-full px-6 py-2.5 mb-8 hover:bg-purple-500/20 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 cursor-default group">
              <span className="text-purple-300 text-sm font-medium tracking-wide group-hover:text-purple-200 group-hover:tracking-wider transition-all duration-300">FAKULTAS ILMU KOMPUTER</span>
            </div>
          </div>

          {/* Main Title - ILKOM UNGU, NEWS KUNING dengan CUSTOM FONT */}
          <div className="hero-animate transition-all duration-700 delay-100 translate-y-10 opacity-0">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="text-white/80 hover:text-purple-200 hover:drop-shadow-lg transition-all duration-300 cursor-default inline-block hover:scale-105">
                Selamat Datang Di
              </span>
              <br />
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 items-center">
                {/* ILKOM - Warna UNGU dengan Custom Font */}
                <span 
                  className="inline-block bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent hover:scale-110 transition-all duration-300 cursor-default"
                  style={customFontStyle}
                >
                  ILKOM
                </span>
                {/* NEWS - Warna KUNING dengan Custom Font dan hover shape */}
                <span className="relative inline-block group">
                  <span className="absolute inset-2 bg-yellow-500/0 rounded-full blur-md transition-all duration-300 group-hover:bg-yellow-500/30 group-hover:scale-110"></span>
                  <span 
                    className="relative inline-block bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-200 bg-clip-text text-transparent hover:scale-110 transition-all duration-300 cursor-default"
                    style={customFontStyle}
                  >
                    NEWS
                  </span>
                </span>
              </div>
            </h1>
          </div>

          {/* Description - Huruf naik turun seperti gelombang */}
          <div className="hero-animate transition-all duration-700 delay-200 translate-y-10 opacity-0">
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed cursor-default group">
              <span className="inline-flex flex-wrap justify-center gap-0">
                {"Informasi terkini untuk mahasiswa FASILKOM Universitas Sriwijaya.".split("").map((char, idx) => (
                  <span 
                    key={idx} 
                    className="inline-block transition-all duration-200 group-hover:-translate-y-1 group-hover:text-purple-400"
                    style={{ transitionDelay: `${idx * 15}ms` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
              <br />
              <span className="inline-flex flex-wrap justify-center gap-0">
                {"Temukan berita terbaru, event keren, dan informasi menarik lainnya.".split("").map((char, idx) => (
                  <span 
                    key={idx} 
                    className="inline-block transition-all duration-200 group-hover:-translate-y-1 group-hover:text-purple-400"
                    style={{ transitionDelay: `${idx * 15}ms` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            </p>
          </div>

          {/* CTA Buttons - Hover efek unik */}
          <div className="hero-animate transition-all duration-700 delay-300 translate-y-10 opacity-0">
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link 
                to="/news" 
                className="group relative bg-purple-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-purple-600 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">Jelajahi Berita</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Link>
              
              <Link 
                to="/events" 
                className="group relative bg-white/10 backdrop-blur-md border border-purple-500/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-purple-500/20 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">Lihat Event</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator - Hover efek unik */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 group cursor-default">
          <span className="text-purple-400/60 text-xs tracking-wider group-hover:text-purple-300 group-hover:tracking-widest group-hover:scale-110 transition-all duration-300">SCROLL</span>
          <ChevronDown size={20} className="text-purple-400/60 group-hover:text-purple-300 group-hover:translate-y-1 transition-all duration-300" />
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(10px);
          }
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }

        /* Animasi masuk dan keluar */
        .hero-animate {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .in-view {
          transform: translateY(0) !important;
          opacity: 1 !important;
        }

        .out-view {
          transform: translateY(30px) !important;
          opacity: 0 !important;
        }
      `}</style>
    </div>
  )
}

export default HeroSection
import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ChevronRight } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import logo from '../../assets/BEM.png'

const Footer = () => {
  const footerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.footer-animate')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const socialLinks = [
    { icon: faFacebookF, href: '#', color: 'hover:bg-[#1877F2]', name: 'Facebook' },
    { icon: faTwitter, href: '#', color: 'hover:bg-[#1DA1F2]', name: 'Twitter' },
    { icon: faInstagram, href: '#', color: 'hover:bg-gradient-to-tr from-[#FCAF45] via-[#F77737] to-[#E1306C]', name: 'Instagram' },
    { icon: faYoutube, href: '#', color: 'hover:bg-[#FF0000]', name: 'YouTube' },
  ]

  // Updated navigation links - hanya Beranda, Berita, Ilkom Gallery
  const navLinks = [
    { name: 'BERANDA', path: '/' },
    { name: 'BERITA', path: '/news' },
    { name: 'ILKOM GALLERY', path: '/ilkomgallery' },
  ]

  const contactItems = [
    {
      icon: MapPin,
      label: 'ALAMAT',
      value: 'Jl. Srijaya Negara, Bukit Besar, Kec. Ilir Barat I, Kota Palembang, Sumatera Selatan 30128.'
    },
    {
      icon: Phone,
      label: 'TELEPON',
      value: '(0711) 581125'
    },
    {
      icon: Mail,
      label: 'EMAIL',
      value: 'bemfasilkomunsri@gmail.com'
    }
  ]

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-gradient-to-br from-[#0a0418] via-[#120a2a] to-[#1a0533]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(0deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Dot Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:25px_25px]"></div>
        
        {/* Diagonal Lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(115deg, rgba(139,92,246,0.03) 0px, rgba(139,92,246,0.03) 1px, transparent 1px, transparent 40px)`
        }}></div>
      </div>

      {/* Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-pulse-slow animation-delay-1500"></div>
      </div>

      {/* Top Border Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* Brand Section - Left */}
          <div className="lg:col-span-5 footer-animate transition-all duration-700 translate-y-10 opacity-0">
            <div className="flex items-center gap-3 mb-5 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="ILKOM NEWS Logo" 
                  className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                  ILKOM NEWS
                </h3>
                <p className="text-[10px] md:text-[11px] tracking-wider text-[#FFC148] font-semibold">
                  BEM FASILKOM UNSRI
                </p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm md:text-[15px] leading-relaxed mb-6 max-w-md">
              Pusat informasi dan berita terkini mahasiswa Fasilkom UNSRI. Modern, cepat, dan selalu informatif.
            </p>
            
            {/* Social Media */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-9 h-9 rounded-full bg-purple-500/10 border border-purple-400/20 flex items-center justify-center text-purple-300 transition-all duration-300 hover:-translate-y-1 hover:scale-110 ${social.color}`}
                >
                  <FontAwesomeIcon icon={social.icon} className="text-sm transition-transform duration-300 hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Section - Center */}
          <div className="lg:col-span-3 footer-animate transition-all duration-700 delay-100 translate-y-10 opacity-0">
            <h3 className="text-base md:text-lg font-semibold text-white mb-5 tracking-wide">
              NAVIGASI
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center justify-between py-2 text-gray-400 hover:text-purple-300 text-sm font-medium transition-all duration-300"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-purple-300 group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section - Right */}
          <div className="lg:col-span-4 footer-animate transition-all duration-700 delay-200 translate-y-10 opacity-0">
            <h3 className="text-base md:text-lg font-semibold text-white mb-5 tracking-wide">
              KONTAK
            </h3>
            <div className="space-y-3">
              {contactItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-400/20 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:scale-105 transition-all duration-300">
                      <Icon size={14} className="text-purple-300" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-purple-300/60 mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                        {item.value}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Watermark */}
        <div className="footer-animate transition-all duration-700 delay-300 translate-y-10 opacity-0 mt-10 pt-8 border-t border-purple-500/20">
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Decorative Line */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-500/40"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500/60"></div>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-purple-500/40"></div>
            </div>
            
            {/* Watermark Text */}
            <p className="text-gray-500 text-[11px] tracking-[0.3em] font-mono">
              DEVELOPED BY RISET PTI 2026
            </p>
            
            {/* Copyright */}
            <p className="text-gray-600 text-[10px] tracking-wide">
              &copy; {new Date().getFullYear()} ILKOM NEWS. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .footer-animate {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .in-view {
          transform: translateY(0) !important;
          opacity: 1 !important;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
        
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
      `}</style>
    </footer>
  )
}

export default Footer
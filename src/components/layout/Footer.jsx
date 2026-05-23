import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Send, ChevronRight, Link as LinkIcon, MessageCircle, Bell } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import logo from '../../assets/logo.png'

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

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const socialLinks = [
    { icon: faFacebookF, href: '#', color: 'hover:bg-[#1877F2]', name: 'Facebook' },
    { icon: faTwitter, href: '#', color: 'hover:bg-[#1DA1F2]', name: 'Twitter' },
    { icon: faInstagram, href: '#', color: 'hover:bg-gradient-to-tr from-[#FCAF45] via-[#F77737] to-[#E1306C]', name: 'Instagram' },
    { icon: faYoutube, href: '#', color: 'hover:bg-[#FF0000]', name: 'YouTube' },
  ]

  const quickLinks = [
    { name: 'Beranda', path: '/', icon: ChevronRight },
    { name: 'Berita', path: '/news', icon: ChevronRight },
    { name: 'Artikel', path: '/articles', icon: ChevronRight },
    { name: 'Event', path: '/events', icon: ChevronRight },
    { name: 'Ilkom Star', path: '/ilkom-star', icon: ChevronRight },
    { name: 'Tentang', path: '/about', icon: ChevronRight },
  ]

  return (
    <footer ref={footerRef} className="bg-gradient-to-br from-[#1a0630] to-[#300B55] text-white mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* About Section - Dengan Logo */}
          <div className="footer-animate transition-all duration-700 translate-y-10 opacity-0">
            <div className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="ILKOM NEWS Logo" 
                  className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-[#FFC148]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div>
                {/* ILKOM NEWS - Warna PUTIH */}
                <h3 className="text-xl font-bold text-white group-hover:text-[#FFC148] transition-colors duration-300">
                  ILKOM NEWS
                </h3>
                {/* FAKULTAS ILMU KOMPUTER - Warna GOLD */}
                <p className="text-[#FFC148] text-[10px] font-medium tracking-wider">
                  FAKULTAS ILMU KOMPUTER
                </p>
              </div>
            </div>
            
            <p className="text-white text-sm leading-relaxed mb-4">
              Portal berita dan informasi terkini untuk mahasiswa Ilmu Komputer UNIKOM.
            </p>
            
            {/* Social Media Icons dengan Font Awesome */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${social.color} group overflow-hidden relative`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <FontAwesomeIcon icon={social.icon} className="text-white text-sm transition-transform duration-300 group-hover:scale-110" />
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Icon Link/Chain */}
          <div className="footer-animate transition-all duration-700 delay-100 translate-y-10 opacity-0">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon size={18} className="text-[#FFC148]" />
              <h3 className="text-lg font-semibold text-white">Link Cepat</h3>
            </div>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="group flex items-center gap-2 text-white hover:text-[#FFC148] transition-all duration-300 hover:translate-x-2"
                    >
                      <Icon size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact Info - Icon MessageCircle */}
          <div className="footer-animate transition-all duration-700 delay-200 translate-y-10 opacity-0">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={18} className="text-[#FFC148]" />
              <h3 className="text-lg font-semibold text-white">Kontak Kami</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white group hover:text-[#FFC148] transition-colors duration-300">
                <MapPin size={18} className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm leading-relaxed">Jl. Dipati Ukur No.116, Bandung</span>
              </li>
              <li className="flex items-center gap-3 text-white group hover:text-[#FFC148] transition-colors duration-300">
                <Phone size={16} className="group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">(022) 1234567</span>
              </li>
              <li className="flex items-center gap-3 text-white group hover:text-[#FFC148] transition-colors duration-300">
                <Mail size={16} className="group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">info@ilkomnews.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter - Icon Bell */}
          <div className="footer-animate transition-all duration-700 delay-300 translate-y-10 opacity-0">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} className="text-[#FFC148]" />
              <h3 className="text-lg font-semibold text-white">Newsletter</h3>
            </div>
            <p className="text-white text-sm mb-4">Dapatkan update terbaru dari kami langsung ke email Anda.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#FFC148] transition-all duration-300 group-hover:bg-white/20"
                  required
                />
              </div>
              <button 
                type="submit"
                className="group relative bg-gradient-to-r from-[#FFC148] to-[#FFD580] text-[#300B55] px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden hover:shadow-lg hover:shadow-[#FFC148]/30 hover:-translate-y-0.5"
              >
                <span className="relative z-10">Subscribe</span>
                <Send size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <span className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-animate transition-all duration-700 delay-400 translate-y-10 opacity-0">
          <div className="border-t border-white/20 mt-10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white text-sm">
                &copy; {new Date().getFullYear()} ILKOM NEWS. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="/about" className="text-white text-sm hover:text-[#FFC148] transition-colors duration-300">Tentang Kami</Link>
                <Link to="/privacy" className="text-white text-sm hover:text-[#FFC148] transition-colors duration-300">Kebijakan Privasi</Link>
                <Link to="/terms" className="text-white text-sm hover:text-[#FFC148] transition-colors duration-300">Syarat & Ketentuan</Link>
              </div>
            </div>
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
      `}</style>
    </footer>
  )
}

export default Footer
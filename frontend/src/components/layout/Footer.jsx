import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { itemVariant } from '../../lib/animations'
import { FaInstagram, FaYoutube, FaTiktok, FaLine } from 'react-icons/fa'
import { ArrowUpRight, Heart, Mail, Phone } from 'lucide-react'
import logo from '../../assets/BEM.png'

const socialLinks = [
  { icon: FaInstagram, href: 'https://www.instagram.com/bemilkomunsri', label: 'Instagram', color: 'hover:bg-pink-500/20 hover:border-pink-400/40 hover:text-pink-400' },
  { icon: FaYoutube, href: 'https://youtube.com/@bemkmfasilkomunsri8050', label: 'YouTube', color: 'hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-400' },
  { icon: FaTiktok, href: 'https://www.tiktok.com/@bemfasilkomunsri', label: 'TikTok', color: 'hover:bg-neutral-400/20 hover:border-neutral-300/40 hover:text-neutral-300' },
  { icon: FaLine, href: 'https://line.me/ti/p/~@bemilkomunsri', label: 'LINE', color: 'hover:bg-green-500/20 hover:border-green-400/40 hover:text-green-400' },
]

const contactInfo = [
  { icon: Mail, href: 'mailto:bemfasilkomunsri@gmail.com', label: 'bemfasilkomunsri@gmail.com' },
  { icon: Phone, href: 'tel:083177228380', label: '083177228380 (Tasya Thalita Nabila)' },
  { icon: Phone, href: 'tel:081271415284', label: '081271415284 (M. Zaki Al Fattah)' },
]

const mainLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/news', label: 'Berita' },
  { href: '/ilkomgallery', label: 'Ilkom Gallery' },
]

const legalLinks = [
  { href: 'https://sapa.bemfasilkomunsri.org/', label: 'SAPA BEM' },
  { href: 'https://bemfasilkomunsri.org/', label: 'BEM Website' },
  { href: 'https://unsri.ac.id/', label: 'Universitas Sriwijaya' },
]



export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0533] via-[#300B55] to-[#1a0533]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(122,71,166,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(191,148,255,0.08),transparent_60%)]" />

      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 px-4 lg:px-8 pt-10 pb-6 lg:pt-14 lg:pb-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Top row */}
          <motion.div variants={itemVariant} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <Link to="/" className="flex items-center gap-x-3 group" aria-label="ILKOM NEWS">
              <img src={logo} alt="ILKOM" className="h-8 w-auto group-hover:scale-105 transition-transform" />
              <span className="font-bold text-lg font-header text-white">ILKOM NEWS</span>
            </Link>
            <ul className="flex list-none gap-2">
              {socialLinks.map((link, i) => (
                <motion.li key={i} variants={itemVariant}>
                  <motion.a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                    className={`inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg ${link.color}`}
                  >
                    <link.icon className="text-base" />
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact info */}
          <motion.div variants={itemVariant} className="mb-5">
            <ul className="flex flex-col gap-1.5">
              {contactInfo.map((c, i) => (
                <li key={i}>
                  <a
                    href={c.href}
                    className="inline-flex items-center gap-2.5 text-xs text-white/45 hover:text-white/80 hover-underline transition-colors py-0.5"
                  >
                    <c.icon size={13} className="shrink-0 opacity-70" />
                    <span className="break-all">{c.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariant} className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

          {/* Bottom row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <motion.div variants={itemVariant} className="text-white/30 text-xs leading-5">
              <div>© {new Date().getFullYear()} ILKOM NEWS</div>
              <div className="text-white/20 text-[11px] mt-0.5">BEM FASILKOM UNSRI — Hak cipta dilindungi</div>
            </motion.div>

            <motion.nav variants={itemVariant} className="md:mt-0">
              <ul className="list-none flex flex-col gap-0.5 md:flex-row md:items-center md:flex-wrap md:gap-4">
                {mainLinks.map((link, i) => (
                  <li key={i}>
                    <motion.div whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}>
                      <Link
                        to={link.href}
                        className="text-xs text-white/55 hover:text-white hover-underline transition-colors duration-200 inline-flex items-center gap-1 group py-1 md:py-0"
                      >
                        {link.label}
                        <ArrowUpRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </motion.div>
                  </li>
                ))}
                <li className="hidden md:block text-white/15">|</li>
                {legalLinks.map((link, i) => (
                  <li key={i}>
                    <motion.div whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/35 hover:text-white/80 hover-underline transition-colors duration-200 py-1 md:py-0"
                      >
                        {link.label}
                      </a>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </div>

          {/* Bottom accent line */}
          <motion.div variants={itemVariant} className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center gap-1.5 text-white/20 text-[11px]">
            <span>Dibuat dengan</span>
            <Heart size={9} className="text-pink-400/60 fill-pink-400/60" />
            <span>oleh FASILKOM UNSRI</span>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  )
}

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
        className="relative z-10 px-4 lg:px-8 pt-16 pb-8 lg:pt-24 lg:pb-10"
      >
        <div className="max-w-7xl mx-auto">
          {/* Top row */}
          <motion.div variants={itemVariant} className="md:flex md:items-start md:justify-between mb-10">
            <Link to="/" className="flex items-center gap-x-3 group" aria-label="ILKOM NEWS">
              <img src={logo} alt="ILKOM" className="h-9 w-auto group-hover:scale-105 transition-transform" />
              <span className="font-bold text-xl font-header text-white">ILKOM NEWS</span>
            </Link>
            <ul className="flex list-none mt-6 md:mt-0 gap-2">
              {socialLinks.map((link, i) => (
                <motion.li key={i} variants={itemVariant}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={`inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg ${link.color}`}
                  >
                    <link.icon className="text-sm" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact info */}
          <motion.div variants={itemVariant} className="mb-8">
            <ul className="flex flex-col gap-1.5">
              {contactInfo.map((c, i) => (
                <li key={i}>
                  <a
                    href={c.href}
                    className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    <c.icon size={12} />
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariant} className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

          {/* Bottom row */}
          <div className="md:flex md:items-center md:justify-between gap-6">
            <motion.div variants={itemVariant} className="text-white/30 text-sm leading-6">
              <div>© {new Date().getFullYear()} ILKOM NEWS</div>
              <div className="text-white/20 text-xs mt-0.5">BEM FASILKOM UNSRI — Hak cipta dilindungi</div>
            </motion.div>

            <motion.nav variants={itemVariant} className="mt-4 md:mt-0">
              <ul className="list-none flex flex-wrap gap-4">
                {mainLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
                <li className="text-white/15">|</li>
                {legalLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/30 hover:text-white/70 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </div>

          {/* Bottom accent line */}
          <motion.div variants={itemVariant} className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-1.5 text-white/20 text-xs">
            <span>Dibuat dengan</span>
            <Heart size={10} className="text-pink-400/60 fill-pink-400/60" />
            <span>oleh FASILKOM UNSRI</span>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  )
}

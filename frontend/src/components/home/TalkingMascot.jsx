import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, GraduationCap, Trophy, Bot, Sparkles, BookOpen, Code2, Lightbulb, Zap, Star, Brain } from 'lucide-react'
import { Text_03 } from '../ui/Text03'
import { Tiles } from '../ui/Tiles'
import mascotIdle from '../../assets/mascot/mascot-idle.png'
import mascotTalking from '../../assets/mascot/mascot-talking.png'

const TalkingMascot = () => {
  const welcomeMessage = "Halo! Aku Wolfy, maskot Fasilkom Unsri! Klik aku untuk dengar fakta seru!"
  const [currentMascot, setCurrentMascot] = useState(mascotIdle)
  const [isTalking, setIsTalking] = useState(false)
  const [showBubble, setShowBubble] = useState(true)
  const [bubbleMessage, setBubbleMessage] = useState(welcomeMessage)
  const [isTyping, setIsTyping] = useState(false)
  const talkTimeoutRef = useRef(null)
  const typingIntervalRef = useRef(null)
  const idleResetRef = useRef(null)
  const facts = [
    "Fasilkom Unsri merupakan salah satu fakultas dengan jumlah peminat tertinggi di rumpun saintek Universitas Sriwijaya",
    "Perkuliahan Fasilkom Unsri tersebar di dua lokasi: Kampus Utama Indralaya dan Kampus Bukit Besar",
    "Fasilkom Unsri awalnya berdiri sebagai program diploma (D3) pada tahun 1993 sebelum menjadi fakultas mandiri pada tahun 2006",
    "Fakultas ini memiliki laboratorium komputer lengkap untuk riset AI, jaringan, dan software engineering",
    "Mahasiswa Fasilkom Unsri aktif menjuarai kompetisi IT tingkat nasional seperti Gemastik",
    "Alumni Fasilkom Unsri telah tersebar di berbagai perusahaan teknologi nasional dan instansi pemerintahan",
    "Fakultas ini menawarkan jenjang pendidikan dari D3, S1, hingga S2 Ilmu Komputer",
    "Mahasiswa aktif dalam program MBKM termasuk magang di tech company raksasa",
    "Kurikulum selalu diperbarui agar selaras dengan kebutuhan industri teknologi modern",
    "Fasilkom Unsri sering menjadi tuan rumah seminar serta konferensi internasional bidang TI",
  ]
  const calculateDuration = (text) => Math.min(Math.max(text.length * 28, 4000), 8000)
  useEffect(() => {
    if (idleResetRef.current) clearTimeout(idleResetRef.current)
    idleResetRef.current = setTimeout(() => { if (!isTalking) { setBubbleMessage(welcomeMessage); setCurrentMascot(mascotIdle); setShowBubble(true) } }, 12000)
    return () => { if (idleResetRef.current) clearTimeout(idleResetRef.current) }
  }, [isTalking, bubbleMessage])
  const typeText = (fullText, duration) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    setIsTyping(true); setBubbleMessage(fullText[0] || "")
    if (fullText.length <= 1) { setIsTyping(false); return }
    let idx = 1; const speed = duration / fullText.length
    typingIntervalRef.current = setInterval(() => { if (idx < fullText.length) { setBubbleMessage(fullText.substring(0, idx + 1)); idx++ } else { clearInterval(typingIntervalRef.current); setIsTyping(false) } }, speed)
  }
  const startTalking = (duration) => {
    if (talkTimeoutRef.current) clearTimeout(talkTimeoutRef.current)
    setIsTalking(true); setCurrentMascot(mascotTalking)
    talkTimeoutRef.current = setTimeout(() => { setIsTalking(false); setCurrentMascot(mascotIdle) }, duration)
  }
  useEffect(() => () => { [talkTimeoutRef, typingIntervalRef, idleResetRef].forEach(r => { if (r.current) clearTimeout(r.current) }) }, [])
  const handleClick = () => {
    const text = facts[Math.floor(Math.random() * facts.length)]; const dur = calculateDuration(text)
    ;[talkTimeoutRef, typingIntervalRef, idleResetRef].forEach(r => { if (r.current) clearTimeout(r.current) })
    setShowBubble(true); typeText(text, dur); startTalking(dur)
  }
  return (
    <section className="py-12 md:py-20 relative z-0 overflow-hidden bg-theme">
      <Tiles rows={10} cols={16} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[5%] md:top-20 md:left-[10%] text-purple-600/30 dark:text-purple-400/20 animate-idle-float" style={{ animationDuration: '3s' }}><GraduationCap size={28} strokeWidth={1.5} /></div>
        <div className="absolute top-20 right-[8%] md:top-32 md:right-[15%] text-purple-500/30 dark:text-purple-300/20 animate-idle-float" style={{ animationDuration: '4s', animationDelay: '0.5s' }}><Bot size={26} strokeWidth={1.5} /></div>
        <div className="absolute bottom-20 left-[8%] md:bottom-32 md:left-[18%] text-purple-700/30 dark:text-purple-500/20 animate-idle-float" style={{ animationDuration: '3.5s', animationDelay: '1s' }}><Trophy size={24} strokeWidth={1.5} /></div>
        <div className="absolute top-32 left-[20%] md:top-48 md:left-[25%] text-indigo-500/25 dark:text-indigo-400/15 animate-idle-float" style={{ animationDuration: '4.5s', animationDelay: '0.8s' }}><BookOpen size={22} strokeWidth={1.5} /></div>
        <div className="absolute top-16 right-[25%] md:top-24 md:right-[30%] text-violet-500/25 dark:text-violet-400/15 animate-idle-float" style={{ animationDuration: '3.8s', animationDelay: '1.2s' }}><Code2 size={24} strokeWidth={1.5} /></div>
        <div className="absolute bottom-32 right-[10%] md:bottom-40 md:right-[20%] text-purple-400/25 dark:text-purple-300/15 animate-idle-float" style={{ animationDuration: '4.2s', animationDelay: '0.3s' }}><Lightbulb size={23} strokeWidth={1.5} /></div>
        <div className="absolute top-40 right-[35%] md:top-56 md:right-[40%] text-indigo-400/25 dark:text-indigo-300/15 animate-idle-float" style={{ animationDuration: '3.2s', animationDelay: '1.5s' }}><Zap size={22} strokeWidth={1.5} /></div>
        <div className="absolute bottom-40 left-[30%] md:bottom-48 md:left-[35%] text-violet-400/25 dark:text-violet-300/15 animate-idle-float" style={{ animationDuration: '4.8s', animationDelay: '0.6s' }}><Star size={20} strokeWidth={1.5} /></div>
        <div className="absolute top-24 left-[45%] md:top-36 md:left-[50%] text-purple-600/25 dark:text-purple-400/15 animate-idle-float" style={{ animationDuration: '5s', animationDelay: '2s' }}><Brain size={22} strokeWidth={1.5} /></div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-8 md:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary mb-4">
            <div className="bg-theme-card border border-theme rounded-2xl px-3 py-1"><span className="text-xs font-semibold uppercase tracking-wider">Kenali Maskot Kami</span></div>
            <p className="pr-3 text-xs text-theme-muted">Wolfy</p>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-3 font-header">
            <Text_03 text="Sapa " className="section-gradient-text" /><Text_03 text="ArkaWolf" className="section-gradient-text" />
          </h2>
          <div className="w-12 h-[2px] bg-gray-300 dark:bg-gray-700 mx-auto rounded-full mb-4" />
          <p className="text-theme-muted text-sm lg:text-base max-w-md mx-auto">Klik ArkaWolf untuk mendengar fakta menarik tentang Fasilkom Unsri!</p>
        </motion.div>
        <div className="relative flex flex-col items-center justify-center">
          <div className={`relative mb-4 md:mb-8 transition-all duration-500 w-full ${showBubble ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-5'}`}>
            <div className="relative glass-card rounded-2xl p-4 md:p-6 max-w-[280px] md:max-w-lg mx-auto">
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 glass-card rotate-45 border-r border-b border-[var(--border-glass)]" />
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center"><MessageCircle size={16} className="text-accent" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-theme-primary text-sm lg:text-base font-medium leading-relaxed">{bubbleMessage}{isTyping && <span className="inline-block w-[2px] h-4 bg-accent ml-0.5 animate-pulse align-middle" />}</p>
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleClick} className="group relative focus:outline-none rounded-full transition-all">
            <div className="absolute inset-0 rounded-full bg-accent/10 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64"><img src={currentMascot} alt="Fasilkom Unsri Mascot - Wolfy" className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105 group-active:scale-95 cursor-pointer drop-shadow-2xl" /></div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all shadow-md ${isTalking ? 'bg-purple-600 dark:bg-purple-500 text-white' : 'glass-card text-accent group-hover:shadow-lg'}`}>{isTalking ? '🗣️ Berbicara...' : '👆 Klik Aku!'}</span>
            </div>
          </button>
        </div>
        <div className="text-center mt-8 md:mt-16"><p className="text-sm text-theme-muted flex items-center justify-center gap-2"><Sparkles size={14} className="text-accent/50" /><span>Klik Wolfy berulang kali untuk fakta berbeda!</span><Sparkles size={14} className="text-accent/50" /></p></div>
      </div>
    </section>
  )
}
export default TalkingMascot

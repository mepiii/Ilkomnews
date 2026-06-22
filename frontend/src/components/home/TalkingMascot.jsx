import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Heart, Smile, GraduationCap, Trophy, Bot, Globe, Sparkles } from 'lucide-react'
import { AnimatedText } from '../ui/AnimatedText'
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

  const resetToDefault = () => {
    if (!isTalking) {
      setBubbleMessage(welcomeMessage)
      setCurrentMascot(mascotIdle)
      setShowBubble(true)
    }
  }

  useEffect(() => {
    if (idleResetRef.current) clearTimeout(idleResetRef.current)
    idleResetRef.current = setTimeout(() => { if (!isTalking) resetToDefault() }, 12000)
    return () => { if (idleResetRef.current) clearTimeout(idleResetRef.current) }
  }, [isTalking, bubbleMessage])

  const typeText = (fullText, duration) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    setIsTyping(true)
    setBubbleMessage(fullText[0] || "")
    if (fullText.length <= 1) { setIsTyping(false); return }
    let idx = 1
    const speed = duration / fullText.length
    typingIntervalRef.current = setInterval(() => {
      if (idx < fullText.length) { setBubbleMessage(fullText.substring(0, idx + 1)); idx++ }
      else { clearInterval(typingIntervalRef.current); setIsTyping(false) }
    }, speed)
  }

  const startTalking = (duration) => {
    if (talkTimeoutRef.current) clearTimeout(talkTimeoutRef.current)
    setIsTalking(true)
    setCurrentMascot(mascotTalking)
    talkTimeoutRef.current = setTimeout(() => { setIsTalking(false); setCurrentMascot(mascotIdle) }, duration)
  }

  useEffect(() => () => {
    [talkTimeoutRef, typingIntervalRef, idleResetRef].forEach(r => { if (r.current) clearTimeout(r.current) })
  }, [])

  const handleClick = () => {
    const text = facts[Math.floor(Math.random() * facts.length)]
    const dur = calculateDuration(text)
    ;[talkTimeoutRef, typingIntervalRef, idleResetRef].forEach(r => { if (r.current) clearTimeout(r.current) })
    setShowBubble(true)
    typeText(text, dur)
    startTalking(dur)
  }

  return (
    <section className="py-12 md:py-20 bg-theme-secondary relative overflow-hidden">
      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[5%] md:top-20 md:left-[10%] text-theme-muted/30 animate-float">
          <GraduationCap size={16} />
        </div>
        <div className="absolute top-20 right-[8%] md:top-40 md:right-[15%] text-theme-muted/30 animate-float-slow">
          <Bot size={16} />
        </div>
        <div className="absolute bottom-16 left-[10%] md:bottom-32 md:left-[20%] text-theme-muted/30 animate-float" style={{ animationDelay: '1s' }}>
          <Trophy size={16} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary mb-4">
            <div className="bg-card border border-theme rounded-2xl px-3 py-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Kenali Maskot Kami</span>
            </div>
            <p className="pr-3 text-xs text-theme-muted">Wolfy</p>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            <AnimatedText>Sapa </AnimatedText>
            <AnimatedText className="text-accent" delay={0.1}>ArkaWolf</AnimatedText>
          </h2>
          <div className="w-12 h-[2px] bg-gray-300 dark:bg-gray-700 mx-auto rounded-full mb-4" />
          <p className="text-theme-muted text-sm lg:text-base max-w-md mx-auto">
            Klik ArkaWolf untuk mendengar fakta menarik tentang Fasilkom Unsri!
          </p>
        </motion.div>

        <div className="relative flex flex-col items-center justify-center">
          {/* Speech Bubble */}
          <div className={`relative mb-4 md:mb-8 transition-all duration-500 w-full ${showBubble ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-5'}`}>
            <div className="relative glass-card rounded-2xl p-4 md:p-6 max-w-[280px] md:max-w-lg mx-auto">
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 glass-card rotate-45 border-r border-b border-[var(--border-glass)]" />
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <MessageCircle size={16} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-theme-primary text-sm lg:text-base font-medium leading-relaxed">
                    {bubbleMessage}
                    {isTyping && <span className="inline-block w-[2px] h-4 bg-accent ml-0.5 animate-pulse align-middle" />}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mascot Button */}
          <button onClick={handleClick} className="group relative focus:outline-none rounded-full transition-all">
            <div className="absolute inset-0 rounded-full bg-accent/10 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64">
              <img
                src={currentMascot}
                alt="Fasilkom Unsri Mascot - Wolfy"
                className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105 group-active:scale-95 cursor-pointer drop-shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all shadow-md ${
                isTalking
                  ? 'bg-accent text-white'
                  : 'glass-card text-accent group-hover:shadow-lg'
              }`}>
                {isTalking ? '🗣️ Berbicara...' : '👆 Klik Aku!'}
              </span>
            </div>
          </button>
        </div>

        <div className="text-center mt-8 md:mt-16">
          <p className="text-sm text-theme-muted flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-accent/50" />
            <span>Klik Wolfy berulang kali untuk fakta berbeda!</span>
            <Sparkles size={14} className="text-accent/50" />
          </p>
        </div>
      </div>
    </section>
  )
}

export default TalkingMascot

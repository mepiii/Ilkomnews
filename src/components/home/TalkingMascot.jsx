// src/components/home/TalkingMascot.js
import React, { useState, useEffect, useRef } from 'react'
import { 
  MessageCircle, Heart, Smile, 
  GraduationCap, Trophy, Bot, 
  Globe, Sparkles
} from 'lucide-react'

// Import asset maskot serigala
import mascotIdle from '../../assets/mascot/mascot-idle.png'
import mascotTalking from '../../assets/mascot/mascot-talking.png'

const TalkingMascot = () => {
  // Default welcome message
  const welcomeMessage = "Halo! Aku Wolfy, maskot Fasilkom Unsri! Klik aku untuk dengar fakta seru!"
  
  const [currentMascot, setCurrentMascot] = useState(mascotIdle)
  const [isTalking, setIsTalking] = useState(false)
  const [showBubble, setShowBubble] = useState(true)
  const [bubbleMessage, setBubbleMessage] = useState(welcomeMessage)
  const [isTyping, setIsTyping] = useState(false)
  const [currentDisplayText, setCurrentDisplayText] = useState(welcomeMessage)
  
  const talkTimeoutRef = useRef(null)
  const bubbleTimeoutRef = useRef(null)
  const typingIntervalRef = useRef(null)
  const idleResetRef = useRef(null)

  // 10 Funfact tentang Fasilkom Unsri
  const facts = [
    "Fasilkom Unsri merupakan salah satu fakultas dengan jumlah peminat tertinggi dan persaingan paling ketat di rumpun saintek Universitas Sriwijaya",
    "Perkuliahan Fasilkom Unsri tersebar di dua lokasi strategis, yaitu Kampus Utama Indralaya (Ogan Ilir) dan Kampus Bukit Besar (Palembang)",
    "Fasilkom Unsri awalnya berdiri sebagai program diploma (D3) pada tahun 1993 sebelum akhirnya resmi menjadi fakultas mandiri pada tahun 2006",
    "Fakultas ini memiliki fasilitas laboratorium komputer yang sangat lengkap untuk mendukung riset kecerdasan buatan (AI), jaringan, hingga software engineering",
    "Fasilkom Unsri memiliki komunitas mahasiswa (tech community) yang aktif dan sering menjuarai kompetisi IT tingkat nasional seperti Gemastik",
    "Alumni Fasilkom Unsri telah tersebar luas di berbagai perusahaan teknologi nasional, unicorn, hingga instansi pemerintahan besar",
    "Fakultas ini menawarkan jenjang pendidikan yang sangat lengkap, mulai dari program Diploma (D3), Sarjana (S1), hingga Program Magister (S2) Ilmu Komputer",
    "Mahasiswa Fasilkom Unsri aktif terlibat dalam program Merdeka Belajar Kampus Merdeka (MBKM), termasuk magang di tech company raksasa dan studi independen",
    "Kurikulum di Fasilkom Unsri selalu diperbarui secara berkala agar selaras dengan kebutuhan industri teknologi modern dan tren global",
    "Fasilkom Unsri sering menjadi tuan rumah dan penyelenggara seminar serta konferensi internasional bidang teknologi informasi yang diakui secara global",
  ]

  // Hitung durasi berdasarkan panjang teks
  const calculateDuration = (text) => {
    const baseDuration = text.length * 28
    return Math.min(Math.max(baseDuration, 4000), 8000)
  }

  // Reset ke default welcome message setelah idle
  const resetToDefault = () => {
    if (!isTalking) {
      setBubbleMessage(welcomeMessage)
      setCurrentDisplayText(welcomeMessage)
      setCurrentMascot(mascotIdle)
      setShowBubble(true)
    }
  }

  // Idle timer - kembali ke default setelah 12 detik tidak ada interaksi
  useEffect(() => {
    if (idleResetRef.current) clearTimeout(idleResetRef.current)
    
    idleResetRef.current = setTimeout(() => {
      if (!isTalking) {
        resetToDefault()
      }
    }, 12000)
    
    return () => {
      if (idleResetRef.current) clearTimeout(idleResetRef.current)
    }
  }, [isTalking, bubbleMessage])

  // Typing effect yang lebih smooth - tanpa jeda awal
  const typeText = (fullText, duration) => {
    // Clear any existing typing
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
    }
    
    setIsTyping(true)
    
    // Tampilkan huruf pertama IMMEDIATELY (tanpa delay)
    setBubbleMessage(fullText[0] || "")
    setCurrentDisplayText(fullText[0] || "")
    
    // Jika hanya 1 huruf, langsung selesai
    if (fullText.length <= 1) {
      setIsTyping(false)
      return
    }
    
    let currentIndex = 1
    const typingSpeed = duration / fullText.length
    
    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        const newText = fullText.substring(0, currentIndex + 1)
        setBubbleMessage(newText)
        setCurrentDisplayText(newText)
        currentIndex++
      } else {
        clearInterval(typingIntervalRef.current)
        setIsTyping(false)
      }
    }, typingSpeed)
  }

  // Animasi bicara
  const startTalking = (duration) => {
    if (talkTimeoutRef.current) clearTimeout(talkTimeoutRef.current)
    
    setIsTalking(true)
    setCurrentMascot(mascotTalking)
    
    talkTimeoutRef.current = setTimeout(() => {
      setIsTalking(false)
      setCurrentMascot(mascotIdle)
    }, duration)
  }

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (talkTimeoutRef.current) clearTimeout(talkTimeoutRef.current)
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current)
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
      if (idleResetRef.current) clearTimeout(idleResetRef.current)
    }
  }, [])

  const handleClick = () => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)]
    const textDuration = calculateDuration(randomFact)
    
    // Reset semua timers
    if (talkTimeoutRef.current) clearTimeout(talkTimeoutRef.current)
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current)
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    if (idleResetRef.current) clearTimeout(idleResetRef.current)
    
    setShowBubble(true)
    
    // Mulai typing dan talking
    typeText(randomFact, textDuration)
    startTalking(textDuration)
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorative elements - hidden on mobile, visible on desktop */}
      <div className="absolute inset-0 opacity-20 hidden md:block">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating icons - lebih kecil dan lebih sedikit di mobile */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[5%] md:top-20 md:left-[10%] text-purple-300 animate-float-slow">
          <GraduationCap size={16} className="md:w-5 md:h-5" />
        </div>
        <div className="absolute top-20 right-[8%] md:top-40 md:right-[15%] text-purple-400 animate-float-medium">
          <Bot size={16} className="md:w-5 md:h-5" />
        </div>
        <div className="absolute bottom-16 left-[10%] md:bottom-32 md:left-[20%] text-indigo-300 animate-float-fast">
          <Trophy size={16} className="md:w-5 md:h-5" />
        </div>
        <div className="absolute bottom-24 right-[15%] md:bottom-48 md:right-[25%] text-purple-400 animate-float-slow delay-1000 hidden md:block">
          <Globe size={20} />
        </div>
        <div className="absolute top-1/3 right-[20%] md:right-[30%] text-purple-500 animate-float-medium delay-500 hidden md:block">
          <Sparkles size={18} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Lebih compact di mobile */}
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center gap-1.5 md:gap-2 bg-purple-100 rounded-full px-3 py-1.5 md:px-5 md:py-2 mb-3 md:mb-4">
            <Heart size={12} className="text-purple-600 md:w-3.5 md:h-3.5" />
            <span className="text-[10px] md:text-xs font-semibold text-purple-700 uppercase tracking-wider">Meet Our Mascot</span>
            <Smile size={12} className="text-purple-600 md:w-3.5 md:h-3.5" />
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 md:mb-3">
            Sapa <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">ArkaWolf</span>
          </h2>
          <div className="w-16 h-0.5 md:w-20 md:h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full mb-3 md:mb-4"></div>
          <p className="text-gray-600 text-xs md:text-sm lg:text-base max-w-md mx-auto px-4">
            Klik ArkaWolf untuk mendengar fakta menarik tentang Fasilkom Unsri!
          </p>
        </div>

        {/* Mascot Container */}
        <div className="relative flex flex-col items-center justify-center">
          
          {/* Speech Bubble - Responsif */}
          <div className={`relative mb-4 md:mb-8 transition-all duration-500 transform w-full ${showBubble ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-5'}`}>
            <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-6 lg:p-8 max-w-[280px] md:max-w-lg lg:max-w-xl mx-auto border-2 border-purple-200">
              {/* Bubble tail */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rotate-45 border-r-2 border-b-2 border-purple-200"></div>
              
              <div className="flex items-start gap-2 md:gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle size={14} className="text-white md:w-4 md:h-4 lg:w-5 lg:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 text-xs md:text-sm lg:text-base font-medium leading-relaxed break-words max-h-32 md:max-h-none overflow-y-auto">
                    {bubbleMessage}
                    {isTyping && (
                      <span className="inline-block w-1 h-3 md:w-1.5 md:h-4 bg-purple-500 ml-0.5 animate-blink align-middle"></span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mascot Image Button */}
          <button
            onClick={handleClick}
            className="group relative focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 rounded-full transition-all"
            aria-label="Klik Wolfy untuk bicara"
          >
            {/* Outer glow rings - lebih subtle di mobile */}
            <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="absolute -inset-2 md:-inset-4 rounded-full border-2 border-purple-300/30 animate-ping-slow opacity-0 group-hover:opacity-100"></div>
            
            {/* Mascot Image - Responsif */}
            <div className="relative w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64">
              <img 
                src={currentMascot}
                alt="Fasilkom Unsri Mascot - Wolfy"
                className="w-full h-full object-contain transform transition-all duration-300 group-hover:scale-105 group-active:scale-95 cursor-pointer drop-shadow-xl md:drop-shadow-2xl"
              />
            </div>
            
            {/* Status indicator - Responsif */}
            <div className="absolute -bottom-1 md:-bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className={`text-[10px] md:text-xs font-semibold px-2 py-1 md:px-3 md:py-1.5 rounded-full transition-all shadow-md ${
                isTalking 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                  : 'bg-white text-purple-600 border border-purple-200 md:border-2 group-hover:border-purple-400 group-hover:shadow-lg'
              }`}>
                {isTalking ? '🗣️ Berbicara...' : '👆 Klik Aku!'}
              </span>
            </div>
          </button>
        </div>

        {/* Bottom Hint - Responsif */}
        <div className="text-center mt-8 md:mt-16">
          <p className="text-[11px] md:text-sm text-gray-500 flex items-center justify-center gap-1 md:gap-2">
            <Sparkles size={12} className="text-purple-400 md:w-4 md:h-4" />
            <span>Klik Wolfy berulang kali untuk fakta berbeda!</span>
            <Sparkles size={12} className="text-purple-400 md:w-4 md:h-4" />
          </p>
        </div>
      </div>

      <style>{`
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.6; }
          75%, 100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.8s step-end infinite;
        }
        
        .delay-500 { animation-delay: 0.5s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </section>
  )
}

export default TalkingMascot
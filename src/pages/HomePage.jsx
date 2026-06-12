// src/pages/HomePage.js
import React from 'react'
import HeroSection from '../components/home/HeroSection'
import LatestNews from '../components/home/LatestNews'
import TalkingMascot from '../components/home/TalkingMascot'  // ← Import
import IlkomGallery from '../components/home/IlkomGallery'
import AnimatedSeparator from '../components/common/AnimatedSeparator'

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      
      <AnimatedSeparator variant="purple" />
      <LatestNews />
      
      <AnimatedSeparator variant="gallery" />
      <TalkingMascot />  {/* ← Taruh di sini */}
      
      <AnimatedSeparator variant="line" />
      <IlkomGallery />
    </div>
  )
}

export default HomePage
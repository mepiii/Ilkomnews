import React from 'react'
import HeroSection from '../components/home/HeroSection'
import LatestNews from '../components/home/LatestNews'
import UpcomingEvents from '../components/home/UpcomingEvents'
import TechArticles from '../components/home/TechArticles'

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <LatestNews />
      <TechArticles />
      <UpcomingEvents />
    </div>
  )
}

export default HomePage
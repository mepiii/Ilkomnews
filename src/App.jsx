import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NewsPage from './pages/NewsPage'
import ArticlesPage from './pages/ArticlesPage'
import EventsPage from './pages/EventsPage'
import AboutPage from './pages/AboutPage'
import DetailPage from './pages/DetailPage'
import IlkomGalleryPage from './pages/IlkomGalleryPage'
import IntroScreen from './components/common/IntroScreen'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

function App() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    // Intro screen akan muncul setiap kali aplikasi dibuka
    // Tampilkan intro selama 3.5 detik
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Tampilkan intro screen
  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />
  }

  // Tampilkan aplikasi utama
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<DetailPage type="news" />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<DetailPage type="event" />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<DetailPage type="article" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ilkomgallery" element={<IlkomGalleryPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
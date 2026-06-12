import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NewsPage from './pages/NewsPage'
import IlkomGalleryPage from './pages/IlkomGalleryPage'
import DetailPage from './pages/DetailPage'
import IntroScreen from './components/common/IntroScreen'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProjectDetailPage from './pages/ilkomgallery/ProjectDetailPage'
import GameDetailPage from './pages/ilkomgallery/GameDetailPage' 
import MobileDetailPage from './pages/ilkomgallery/MobileDetailPage'
import UiUxDetailPage from './pages/ilkomgallery/UiUxDetailPage'
import WebDetailPage from './pages/ilkomgallery/WebDetailPage'

function App() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    // Intro screen akan muncul setiap kali aplikasi dibuka
    // Tampilkan intro selama 2 detik
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
          {/* Home */}
          <Route path="/" element={<HomePage />} />
          
          {/* News */}
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<DetailPage type="news" />} />
          
          {/* Ilkom Gallery */}
          <Route path="/ilkomgallery" element={<IlkomGalleryPage />} />
          <Route path="/ilkomgallery/project/:slug" element={<ProjectDetailPage />} />
          <Route path="/ilkomgallery/game/:slug" element={<GameDetailPage />} />
          <Route path="/ilkomgallery/mobile/:slug" element={<MobileDetailPage />} />
          <Route path="/ilkomgallery/uiux/:slug" element={<UiUxDetailPage />} />
          <Route path="/ilkomgallery/web/:slug" element={<WebDetailPage />} />
          
          {/* Redirect / fallback - optional */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
// src/pages/DetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NewsDetail from '../components/news/NewsDetail'
import ArticleDetail from '../components/articles/ArticleDetail'
import EventDetail from '../components/events/EventDetail'
import Breadcrumb from '../components/common/Breadcrumb'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { mockNews, mockArticles, mockEvents, mockCareers } from '../services/api'
import { getIdFromSlug, hasIdInSlug, isNumericId, generateSlug } from '../utils/formatters'

const DetailPage = ({ type }) => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedNews, setRelatedNews] = useState([])
  const [relatedArticles, setRelatedArticles] = useState([])
  const [relatedEvents, setRelatedEvents] = useState([])

  // Validasi type di awal
  const validTypes = ['news', 'articles', 'events', 'career']
  
  if (!type || !validTypes.includes(type)) {
    console.error('Invalid type prop:', type)
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <Breadcrumb />
        <ErrorMessage 
          message={`Tipe konten "${type}" tidak valid`} 
          onRetry={() => navigate('/')} 
        />
      </div>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        let service
        switch (type) {
          case 'news':
            service = mockNews
            break
          case 'articles':
            service = mockArticles
            break
          case 'events':
            service = mockEvents
            break
          case 'career':
            service = mockCareers
            break
          default:
            throw new Error(`Invalid content type: ${type}`)
        }
        
        let result = null
        
        console.log('Fetching detail for type:', type, 'slug:', slug)
        
        // CASE 1: Slug adalah ID numeric (contoh: /articles/1)
        if (isNumericId(slug)) {
          console.log('Case: Numeric ID ->', slug)
          const id = parseInt(slug)
          result = await service.getById(id)
          
          if (result && result.title) {
            const newSlug = generateSlug(result.title)
            console.log('Redirecting to slug:', newSlug)
            navigate(`/${type}/${newSlug}`, { replace: true })
            return
          }
        } 
        // CASE 2 & 3: Coba cari berdasarkan title/slug
        else {
          console.log('Case: Searching by slug/title ->', slug)
          
          // Dapatkan semua data
          const allData = await service.getAll()
          console.log('Total data:', allData.length)
          
          // Pertama, coba cari berdasarkan title match (pure slug)
          let foundItem = allData.find(item => {
            const itemSlug = generateSlug(item.title)
            return itemSlug === slug
          })
          
          if (foundItem) {
            console.log('Found by title match:', foundItem.title)
            result = foundItem
          } else {
            // Kedua, coba cari berdasarkan ID di akhir slug
            // Periksa apakah slug memiliki ID di akhir (angka 1-999)
            const lastPart = slug.split('-').pop()
            const possibleId = parseInt(lastPart)
            console.log('Last part:', lastPart, 'Possible ID:', possibleId)
            
            // ID harus antara 1-999 (bukan tahun seperti 2024)
            if (!isNaN(possibleId) && possibleId >= 1 && possibleId <= 999) {
              console.log('Trying to find by ID:', possibleId)
              result = await service.getById(possibleId)
              if (result) {
                console.log('Found by ID:', result.title)
              }
            }
          }
        }
        
        if (result) {
          console.log('Setting data:', result.title)
          setData(result)
          
          // Fetch related content berdasarkan type
          if (type === 'news') {
            const allNews = await mockNews.getAll()
            const filtered = allNews.filter(item => item.id !== result.id)
            setRelatedNews(filtered.slice(0, 3))
          } else if (type === 'articles') {
            const allArticles = await mockArticles.getAll()
            const filtered = allArticles.filter(item => item.id !== result.id)
            setRelatedArticles(filtered.slice(0, 3))
          } else if (type === 'events') {
            const allEvents = await mockEvents.getAll()
            const filtered = allEvents.filter(item => item.id !== result.id)
            setRelatedEvents(filtered.slice(0, 3))
          }
        } else {
          console.log('No result found for slug:', slug)
          setError('Konten tidak ditemukan')
        }
      } catch (err) {
        console.error('Error fetching detail:', err)
        setError(err.message || 'Gagal memuat data. Silakan coba lagi.')
      } finally {
        setLoading(false)
      }
    }
    
    if (slug) {
      fetchData()
    }
  }, [type, slug, navigate])

  // Scroll ke atas saat data berubah
  useEffect(() => {
    if (data) {
      window.scrollTo(0, 0)
    }
  }, [data])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <Breadcrumb />
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <Breadcrumb />
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <Breadcrumb />
        <ErrorMessage message="Konten tidak ditemukan" onRetry={() => navigate(`/${type}`)} />
      </div>
    )
  }

  const renderDetail = () => {
    switch (type) {
      case 'news':
        return <NewsDetail news={data} relatedNews={relatedNews} />
      case 'articles':
        return <ArticleDetail article={data} relatedArticles={relatedArticles} />
      case 'events':
        return <EventDetail event={data} relatedEvents={relatedEvents} />
      case 'career':
        return <EventDetail event={data} relatedEvents={relatedEvents} />
      default:
        return <ErrorMessage message="Tipe konten tidak valid" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
      <Breadcrumb />
      {renderDetail()}
    </div>
  )
}

export default DetailPage
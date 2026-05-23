import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import NewsDetail from '../components/news/NewsDetail'
import ArticleDetail from '../components/articles/ArticleDetail'
import EventDetail from '../components/events/EventDetail'
import Breadcrumb from '../components/common/Breadcrumb'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { mockNews, mockArticles, mockEvents, mockCareers } from '../services/api'

const DetailPage = ({ type }) => {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        let result
        switch (type) {
          case 'news':
            result = await mockNews.getById(id)
            break
          case 'articles':
            result = await mockArticles.getById(id)
            break
          case 'events':
            result = await mockEvents.getById(id)
            break
          case 'career':
            result = await mockCareers.getById(id)
            break
          default:
            throw new Error('Invalid content type')
        }
        
        if (result) {
          setData(result)
        } else {
          setError('Konten tidak ditemukan')
        }
      } catch (err) {
        setError('Gagal memuat data. Silakan coba lagi.')
        console.error('Error fetching detail:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [type, id])

  const handleRegister = async (eventId, formData) => {
    try {
      await mockEvents.register(eventId, formData)
      alert('Pendaftaran berhasil! Silakan cek email Anda.')
    } catch (error) {
      alert('Pendaftaran gagal. Silakan coba lagi.')
    }
  }

  const handleApply = async (jobId, application) => {
    try {
      await mockCareers.apply(jobId, application)
      alert('Lamaran berhasil dikirim!')
    } catch (error) {
      alert('Gagal mengirim lamaran. Silakan coba lagi.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-8">
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

  const renderDetail = () => {
    switch (type) {
      case 'news':
        return <NewsDetail news={data} />
      case 'articles':
        return <ArticleDetail article={data} />
      case 'events':
        return <EventDetail event={data} onRegister={handleRegister} />
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
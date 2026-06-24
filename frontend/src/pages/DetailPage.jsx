import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NewsDetail from '../components/news/NewsDetail'
import ArticleDetail from '../components/articles/ArticleDetail'
import EventDetail from '../components/events/EventDetail'
import Breadcrumb from '../components/common/Breadcrumb'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { mockNews, mockArticles, mockEvents } from '../services/api'
import { getIdFromSlug, isNumericId, generateSlug } from '../utils/formatters'

const DetailPage = ({ type }) => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [related, setRelated] = useState([])

  const validTypes = ['news', 'articles', 'events', 'career']
  if (!type || !validTypes.includes(type)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        <ErrorMessage message={`Tipe konten "${type}" tidak valid`} onRetry={() => navigate('/')} />
      </div>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const service = type === 'news' ? mockNews : type === 'articles' ? mockArticles : mockEvents
        let result = null

        if (isNumericId(slug)) {
          result = await service.getById(parseInt(slug))
          if (result?.title) {
            navigate(`/${type}/${generateSlug(result.title)}`, { replace: true })
            return
          }
        } else {
          const allDataResponse = await service.getAll()
          // Handle both array responses and object responses with data property
          const allData = Array.isArray(allDataResponse)
            ? allDataResponse
            : allDataResponse?.data || []

          result = allData.find(item => generateSlug(item.title) === slug)
          if (!result) {
            const lastPart = slug.split('-').pop()
            const possibleId = parseInt(lastPart)
            if (!isNaN(possibleId) && possibleId >= 1 && possibleId <= 999) {
              result = await service.getById(possibleId)
            }
          }
        }

        if (result) {
          setData(result)
          const allDataResponse = await service.getAll()
          // Handle both array responses and object responses with data property
          const allData = Array.isArray(allDataResponse)
            ? allDataResponse
            : allDataResponse?.data || []
          setRelated(allData.filter(item => item.id !== result.id).slice(0, 3))
        } else {
          setError('Konten tidak ditemukan')
        }
      } catch (err) {
        setError(err.message || 'Gagal memuat data')
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, slug])

  useEffect(() => { if (data) window.scrollTo(0, 0) }, [data])

  if (loading) return <div className="max-w-7xl mx-auto px-4 pt-24 pb-8"><Breadcrumb /><LoadingSpinner /></div>
  if (error) return <div className="max-w-7xl mx-auto px-4 pt-24 pb-8"><Breadcrumb /><ErrorMessage message={error} onRetry={() => window.location.reload()} /></div>
  if (!data) return <div className="max-w-7xl mx-auto px-4 pt-24 pb-8"><Breadcrumb /><ErrorMessage message="Konten tidak ditemukan" onRetry={() => navigate(`/${type}`)} /></div>

  const renderDetail = () => {
    switch (type) {
      case 'news': return <NewsDetail news={data} relatedNews={related} />
      case 'articles': return <ArticleDetail article={data} relatedArticles={related} />
      case 'events': return <EventDetail event={data} relatedEvents={related} />
      case 'career': return <EventDetail event={data} relatedEvents={related} />
      default: return <ErrorMessage message="Tipe konten tidak valid" />
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

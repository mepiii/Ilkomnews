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
import { Tiles } from '../components/ui/Tiles'
import { FlickeringGrid } from '../components/ui/FlickeringGrid'

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
      <div className="min-h-screen bg-transparent relative z-0">
        <FlickeringGrid squareSize={4} gridGap={6} flickerChance={0.3} color="rgb(139, 92, 246)" />
        <Tiles rows={10} cols={16} />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8 relative z-10">
          <Breadcrumb />
          <ErrorMessage message={`Tipe konten "${type}" tidak valid`} onRetry={() => navigate('/')} />
        </div>
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

  if (loading) return <div className="min-h-screen bg-transparent relative z-0 pt-24 pb-8"><FlickeringGrid squareSize={4} gridGap={6} flickerChance={0.3} color="rgb(139, 92, 246)" /><Tiles rows={10} cols={16} /><div className="max-w-7xl mx-auto px-4 relative z-10"><Breadcrumb /><LoadingSpinner /></div></div>
  if (error) return <div className="min-h-screen bg-transparent relative z-0 pt-24 pb-8"><FlickeringGrid squareSize={4} gridGap={6} flickerChance={0.3} color="rgb(139, 92, 246)" /><Tiles rows={10} cols={16} /><div className="max-w-7xl mx-auto px-4 relative z-10"><Breadcrumb /><ErrorMessage message={error} onRetry={() => window.location.reload()} /></div></div>
  if (!data) return <div className="min-h-screen bg-transparent relative z-0 pt-24 pb-8"><FlickeringGrid squareSize={4} gridGap={6} flickerChance={0.3} color="rgb(139, 92, 246)" /><Tiles rows={10} cols={16} /><div className="max-w-7xl mx-auto px-4 relative z-10"><Breadcrumb /><ErrorMessage message="Konten tidak ditemukan" onRetry={() => navigate(`/${type}`)} /></div></div>

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
    <div className="min-h-screen bg-transparent relative z-0 pt-24 pb-8">
      <FlickeringGrid squareSize={4} gridGap={6} flickerChance={0.3} color="rgb(139, 92, 246)" />
      <Tiles rows={10} cols={16} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <Breadcrumb />
        {renderDetail()}
      </div>
    </div>
  )
}

export default DetailPage

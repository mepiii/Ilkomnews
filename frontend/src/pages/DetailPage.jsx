import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NewsDetail from '../components/news/NewsDetail'
import ArticleDetail from '../components/articles/ArticleDetail'
import EventDetail from '../components/events/EventDetail'
import Breadcrumb from '../components/common/Breadcrumb'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { PageBackground } from '../components/ui/PageBackground'
import { api } from '../services/api'
import { isNumericId, generateSlug } from '../utils/formatters'

const VALID_TYPES = ['news', 'articles', 'events', 'career']

const DetailPage = ({ type }) => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [related, setRelated] = useState([])

  // NOTE: all hooks must be called before any conditional return (Rules of Hooks)
  const isValidType = Boolean(type && VALID_TYPES.includes(type))

  useEffect(() => {
    if (!isValidType) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const service = type === 'news' ? api.news : type === 'articles' ? api.articles : api.events
        let result = null
        let allData = []

        if (isNumericId(slug)) {
          result = await service.getById(parseInt(slug))
          if (result?.title) {
            navigate(`/${type}/${generateSlug(result.title)}`, { replace: true })
            return
          }
        }

        // Always fetch full list for related items and slug fallback
        const allDataResponse = await service.getAll()
        allData = Array.isArray(allDataResponse)
          ? allDataResponse
          : allDataResponse?.data || []

        if (!result) {
          result = allData.find(item => generateSlug(item.title) === slug)
        }
        if (!result) {
          const lastPart = slug.split('-').pop()
          const possibleId = parseInt(lastPart)
          if (!isNaN(possibleId) && possibleId >= 1 && possibleId <= 999) {
            result = allData.find(item => item.id === possibleId)
          }
        }

        if (result) {
          setData(result)
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
  }, [type, slug, navigate, isValidType])

  useEffect(() => { if (data) window.scrollTo(0, 0) }, [data])

  if (!isValidType) {
    return (
      <div className="min-h-screen bg-transparent relative z-0">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8 relative z-10">
          <Breadcrumb />
          <ErrorMessage message={`Tipe konten "${type}" tidak valid`} onRetry={() => navigate('/')} />
        </div>
      </div>
    )
  }

  if (loading) return <div className="min-h-screen bg-transparent relative z-0 pt-24 pb-8"><div className="max-w-7xl mx-auto px-4 relative z-10"><Breadcrumb /><LoadingSpinner /></div></div>
  if (error) return <div className="min-h-screen bg-transparent relative z-0 pt-24 pb-8"><div className="max-w-7xl mx-auto px-4 relative z-10"><Breadcrumb /><ErrorMessage message={error} onRetry={() => window.location.reload()} /></div></div>
  if (!data) return <div className="min-h-screen bg-transparent relative z-0 pt-24 pb-8"><div className="max-w-7xl mx-auto px-4 relative z-10"><Breadcrumb /><ErrorMessage message="Konten tidak ditemukan" onRetry={() => navigate(`/${type}`)} /></div></div>

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
    <PageBackground>
      <div className="min-h-screen bg-transparent relative z-0 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Breadcrumb />
          {renderDetail()}
        </div>
      </div>
    </PageBackground>
  )
}

export default DetailPage

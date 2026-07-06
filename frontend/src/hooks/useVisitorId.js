import { useEffect, useState } from 'react'

const VISITOR_ID_KEY = 'ilkom_visitor_id'

function generateVisitorId() {
  const timestamp = Date.now().toString(36)
  const randomPart = crypto.randomUUID ? crypto.randomUUID() : crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
  return `visitor_${timestamp}_${randomPart}`
}

export function useVisitorId() {
  const [visitorId, setVisitorId] = useState(null)

  useEffect(() => {
    let storedId = localStorage.getItem(VISITOR_ID_KEY)
    if (!storedId) {
      storedId = generateVisitorId()
      localStorage.setItem(VISITOR_ID_KEY, storedId)
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisitorId(storedId)
  }, [])

  return visitorId
}

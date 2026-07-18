import { useEffect, useRef, useState } from 'react'

const DeferredRender = ({ children, rootMargin = '160px', className = '', placeholder = null }) => {
  const hostRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host || visible) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin })

    observer.observe(host)
    return () => observer.disconnect()
  }, [visible, rootMargin])

  return (
    <div ref={hostRef} className={className}>
      {visible ? children : placeholder}
    </div>
  )
}

export default DeferredRender

import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useThemeMode } from '../../hooks/useThemeMode'

const MAX_VISIBLE = 3

const SmoothTabs = ({ tabs, activeTab, onTabChange, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({ left: '0px', width: '0px' })
  const [isSmall, setIsSmall] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const tabRefs = useRef([])
  const moreRef = useRef(null)
  const isDark = useThemeMode()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsSmall(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (hoveredIndex !== null) {
      const el = tabRefs.current[hoveredIndex]
      if (el) {
        setHoverStyle({ left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` })
      }
    }
  }, [hoveredIndex, isSmall])

  useEffect(() => {
    const el = tabRefs.current[activeIndex]
    if (el) {
      setActiveStyle({ left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` })
    } else {
      setActiveStyle({ left: '0px', width: '0px' })
    }
  }, [activeIndex, isSmall])

  useEffect(() => {
    const idx = tabs.findIndex(t => t.id === activeTab)
    if (idx >= 0 && idx !== activeIndex) {
      setActiveIndex(idx)
    }
  }, [activeTab, tabs, activeIndex])

  useEffect(() => {
    if (!moreOpen) return
    const handle = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [moreOpen])

  const entries = tabs.map((tab, index) => ({ tab, index }))
  const visibleEntries = isSmall ? entries.slice(0, MAX_VISIBLE) : entries
  const overflowEntries = isSmall ? entries.slice(MAX_VISIBLE) : []
  const isOverflowActive = isSmall && activeIndex >= MAX_VISIBLE

  const handleSelect = (index, id) => {
    setActiveIndex(index)
    onTabChange?.(id)
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <div
          className="absolute h-[30px] transition-all duration-300 ease-out rounded-[6px]"
          style={{
            ...hoverStyle,
            opacity: hoveredIndex !== null ? 1 : 0,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
          }}
        />
        <div
          className="absolute bottom-[-6px] h-[2px] transition-all duration-300 ease-out"
          style={{
            ...activeStyle,
            backgroundColor: isDark ? '#fff' : '#1a1a2e',
          }}
        />
        <div className="relative flex space-x-[6px] items-center overflow-x-auto scrollbar-hide pb-2 -mb-2">
          {visibleEntries.map(({ tab, index }) => (
            <div
              key={tab.id}
              ref={el => (tabRefs.current[index] = el)}
              className="px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] flex-shrink-0"
              style={{
                color: index === activeIndex
                  ? (isDark ? '#ffffff' : '#1a1a2e')
                  : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(26,26,46,0.5)'),
                fontWeight: index === activeIndex ? 600 : 500,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleSelect(index, tab.id)}
            >
              <div className="text-sm leading-5 whitespace-nowrap flex items-center justify-center h-full gap-2">
                {tab.icon && <tab.icon size={14} />}
                <span className="hidden lg:inline">{tab.label}</span>
              </div>
            </div>
          ))}

          {overflowEntries.length > 0 && (
            <div ref={moreRef} className="relative flex-shrink-0">
              <div
                className="px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] flex items-center justify-center"
                style={{
                  color: isOverflowActive
                    ? (isDark ? '#ffffff' : '#1a1a2e')
                    : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(26,26,46,0.5)'),
                  fontWeight: isOverflowActive ? 600 : 500,
                }}
                onClick={() => setMoreOpen(o => !o)}
              >
                <MoreHorizontal size={14} />
              </div>
              {moreOpen && (
                <div
                  className={cn(
                    'absolute right-0 top-[36px] z-20 min-w-[160px] rounded-md shadow-lg border py-1',
                    isDark
                      ? 'bg-[#1a1a2e] border-white/10'
                      : 'bg-white border-black/10'
                  )}
                >
                  {overflowEntries.map(({ tab, index }) => (
                    <div
                      key={tab.id}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 cursor-pointer text-sm whitespace-nowrap transition-colors duration-200',
                        index === activeIndex
                          ? (isDark ? 'text-white bg-white/10' : 'text-[#1a1a2e] bg-black/5')
                          : (isDark ? 'text-white/60 hover:text-white' : 'text-[#1a1a2e]/60 hover:text-[#1a1a2e]')
                      )}
                      style={{ fontWeight: index === activeIndex ? 600 : 500 }}
                      onClick={() => {
                        handleSelect(index, tab.id)
                        setMoreOpen(false)
                      }}
                    >
                      {tab.icon && <tab.icon size={14} />}
                      <span>{tab.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { SmoothTabs }

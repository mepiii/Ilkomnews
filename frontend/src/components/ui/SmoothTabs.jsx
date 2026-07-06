import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { useThemeMode } from '../../hooks/useThemeMode'

const SmoothTabs = ({ tabs, activeTab, onTabChange, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({ left: '0px', width: '0px' })
  const tabRefs = useRef([])
  const isDark = useThemeMode()

  useEffect(() => {
    if (hoveredIndex !== null) {
      const el = tabRefs.current[hoveredIndex]
      if (el) {
        setHoverStyle({ left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` })
      }
    }
  }, [hoveredIndex])

  useEffect(() => {
    const el = tabRefs.current[activeIndex]
    if (el) {
      setActiveStyle({ left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` })
    }
  }, [activeIndex])

  useEffect(() => {
    const idx = tabs.findIndex(t => t.id === activeTab)
    if (idx >= 0 && idx !== activeIndex) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveIndex(idx)
    }
  }, [activeTab, tabs])

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
        <div className="relative flex space-x-[6px] items-center">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              ref={el => (tabRefs.current[index] = el)}
              className="px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px]"
              style={{
                color: index === activeIndex
                  ? (isDark ? '#ffffff' : '#1a1a2e')
                  : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(26,26,46,0.5)'),
                fontWeight: index === activeIndex ? 600 : 500,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                setActiveIndex(index)
                onTabChange?.(tab.id)
              }}
            >
              <div className="text-sm leading-5 whitespace-nowrap flex items-center justify-center h-full gap-2">
                {tab.icon && <tab.icon size={14} />}
                {tab.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { SmoothTabs }

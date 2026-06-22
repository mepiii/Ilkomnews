import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

const AnimatedTabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({ left: '0px', width: '0px' })
  const tabRefs = useRef([])

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
    requestAnimationFrame(() => {
      const el = tabRefs.current[0]
      if (el) {
        setActiveStyle({ left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` })
      }
    })
  }, [])

  // Sync activeIndex with external activeTab
  useEffect(() => {
    const idx = tabs.findIndex(t => t.id === activeTab)
    if (idx >= 0) setActiveIndex(idx)
  }, [activeTab, tabs])

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        {/* Hover Highlight */}
        <div
          className="absolute h-[34px] transition-all duration-300 ease-out bg-black/[0.06] dark:bg-white/[0.1] rounded-lg flex items-center"
          style={{ ...hoverStyle, opacity: hoveredIndex !== null ? 1 : 0 }}
        />
        {/* Active Indicator */}
        <div
          className="absolute bottom-[-6px] h-[2px] bg-black dark:bg-white transition-all duration-300 ease-out"
          style={activeStyle}
        />
        {/* Tabs */}
        <div className="relative flex items-center gap-1">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              ref={(el) => (tabRefs.current[index] = el)}
              className={cn(
                'px-4 py-2 cursor-pointer transition-colors duration-300 h-[34px]',
                index === activeIndex
                  ? 'text-black dark:text-white font-semibold'
                  : 'text-black/50 dark:text-white/50 font-medium'
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                setActiveIndex(index)
                onTabChange?.(tab.id)
              }}
            >
              <div className="text-sm whitespace-nowrap flex items-center justify-center h-full gap-2">
                {tab.icon && <tab.icon size={16} />}
                {tab.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { AnimatedTabs }

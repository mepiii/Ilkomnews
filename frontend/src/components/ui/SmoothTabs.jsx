import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { useThemeMode } from '../../hooks/useThemeMode'

// ponytail: all tabs always render in the scroll strip (icon-only below lg),
// no mobile dropdown — fits every tab on small screens without hiding any.

const SmoothTabs = ({ tabs, activeTab, onTabChange, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({ left: '0px', width: '0px' })
  const isDark = useThemeMode()

  useEffect(() => {
    const el = tabRefs.current[activeIndex]
    if (el) {
      setActiveStyle({ left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` })
    } else {
      setActiveStyle({ left: '0px', width: '0px' })
    }
  }, [activeIndex])

  useEffect(() => {
    if (hoveredIndex !== null) {
      const el = tabRefs.current[hoveredIndex]
      if (el) {
        setHoverStyle({ left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` })
      }
    }
  }, [hoveredIndex])

  useEffect(() => {
    const idx = tabs.findIndex(t => t.id === activeTab)
    if (idx >= 0 && idx !== activeIndex) {
      setActiveIndex(idx)
    }
  }, [activeTab, tabs, activeIndex])

  const tabRefs = useRef([])

  const handleSelect = (index, id) => {
    setActiveIndex(index)
    onTabChange?.(id)
  }

  const entries = tabs.map((tab, index) => ({ tab, index }))

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
            backgroundColor: isDark ? 'var(--accent)' : 'var(--accent)',
          }}
        />
        <div className="relative flex space-x-[6px] items-center overflow-x-auto scrollbar-hide pb-2 -mb-2">
          {entries.map(({ tab, index }) => (
            <div
              key={tab.id}
              ref={el => (tabRefs.current[index] = el)}
              className="px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] flex-shrink-0"
              style={{
                color: index === activeIndex
                  ? (isDark ? 'var(--accent)' : 'var(--accent)')
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
        </div>
      </div>
    </div>
  )
}

export { SmoothTabs }

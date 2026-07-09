import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, Bookmark, Share2, X } from "lucide-react"
import { cn } from "../../lib/utils"
import { toggleLike, toggleSave, recordShare, recordView, getInteractionCounts, toggleGlobalLike, toggleGlobalSave } from "../../services/interactions"
import { lockScroll, unlockScroll, resetScrollLock } from "../../lib/scrollLock"

const InteractionBar = React.memo(function InteractionBar({
  compact = false,
  liked,
  saved,
  counts,
  onLike,
  onSave,
  onShare,
}) {
  return (
    <div className={cn("flex items-center", compact ? "gap-1" : "gap-2")}>
      <motion.button 
        onClick={onLike} 
        aria-label={liked ? 'Unlike' : 'Like'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn("p-2 rounded-lg transition-colors duration-150",
          liked ? "text-red-500" : "text-[var(--text-muted)] hover:text-red-400"
        )}
      >
        <Heart size={compact ? 14 : 18} fill={liked ? "currentColor" : "none"} />
      </motion.button>
      <motion.button 
        onClick={onSave} 
        aria-label={saved ? 'Unsave' : 'Save'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn("p-2 rounded-lg transition-colors duration-150",
          saved ? "text-blue-500" : "text-[var(--text-muted)] hover:text-blue-400"
        )}
      >
        <Bookmark size={compact ? 14 : 18} fill={saved ? "currentColor" : "none"} />
      </motion.button>
      <motion.button 
        onClick={onShare} 
        aria-label="Share"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-green-500 transition-colors duration-150"
      >
        <Share2 size={compact ? 14 : 18} />
      </motion.button>
      {!compact && counts.likes > 0 && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs ml-1 font-medium" 
          style={{ color: 'var(--text-muted)' }}
        >
          {counts.likes}
        </motion.span>
      )}
    </div>
  )
})

function ExpandableCard({
  title,
  src,
  description,
  children,
  className,
  classNameExpanded,
  badge,
  meta,
  itemType = "project",
  itemId,
  themeColor = "270 50% 40%",
  ...props
}) {
  const [active, setActive] = React.useState(false)
  const collapsedCardRef = React.useRef(null)
  const expandedCloseRef = React.useRef(null)
  const id = React.useId()

  const [liked, setLiked] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [counts, setCounts] = React.useState({ likes: 0, saves: 0, shares: 0 })

  React.useEffect(() => {
    if (itemId) {
      const c = getInteractionCounts(itemType, itemId)
      setLiked(c.isLiked)
      setSaved(c.isSaved)
      setCounts({ likes: c.likes, saves: c.saves, shares: c.shares })
    }
  }, [itemId, itemType, active])

  // Item data to persist for Koleksi
  const getItemData = React.useCallback(() => ({
    title,
    src,
    description,
    category: props.category,
    creator_name: props.creator_name,
    creator_avatar_url: props.creator_avatar_url,
    thumbnail_url: src,
    tech_stack: props.tech_stack,
  }), [title, src, description, props])

  const handleLike = React.useCallback((e) => {
    e.stopPropagation()
    if (!itemId) return
    const isNowLiked = toggleLike(itemType, itemId, getItemData())
    setLiked(isNowLiked)
    setCounts(prev => ({ ...prev, likes: prev.likes + (isNowLiked ? 1 : -1) }))
    toggleGlobalLike(itemType, itemId).catch(() => {})
  }, [itemId, itemType, getItemData])

  const handleSave = React.useCallback((e) => {
    e.stopPropagation()
    if (!itemId) return
    const isNowSaved = toggleSave(itemType, itemId, getItemData())
    setSaved(isNowSaved)
    setCounts(prev => ({ ...prev, saves: prev.saves + (isNowSaved ? 1 : -1) }))
    toggleGlobalSave(itemType, itemId).catch(() => {})
  }, [itemId, itemType, getItemData])

  const handleShare = React.useCallback((e) => {
    e.stopPropagation()
    if (!itemId) return
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).catch(() => {})
    }
    const newCount = recordShare(itemType, itemId)
    setCounts(prev => ({ ...prev, shares: newCount }))
  }, [itemId, itemType, title])

  const scrollPositionRef = React.useRef(0)
  const isExpandedRef = React.useRef(false)

  const handleExpand = React.useCallback(() => {
    scrollPositionRef.current = window.scrollY
    isExpandedRef.current = true
    lockScroll()
    document.body.classList.add("scroll-locked")
    setActive(true)
    if (itemId) {
      recordView(itemType, itemId, getItemData())
    }
    setTimeout(() => expandedCloseRef.current?.focus(), 100)
  }, [itemId, itemType, getItemData])

  const handleCollapse = React.useCallback(() => {
    isExpandedRef.current = false
    unlockScroll()
    window.scrollTo(0, scrollPositionRef.current)
    setActive(false)
    setTimeout(() => collapsedCardRef.current?.focus(), 100)
  }, [])

  // Escape key handler
  React.useEffect(() => {
    if (!active) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCollapse()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [active, handleCollapse])

  // Safety: if component unmounts while expanded, guarantee scroll is restored
  React.useEffect(() => {
    return () => {
      if (isExpandedRef.current) resetScrollLock()
    }
  }, [])

  const interactionProps = React.useMemo(() => ({
    liked, saved, counts, onLike: handleLike, onSave: handleSave, onShare: handleShare
  }), [liked, saved, counts, handleLike, handleSave, handleShare])

  return (
    <>
      {/* Collapsed Card - Consistent sizing */}
      <motion.article
        ref={collapsedCardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExpand}
        className={cn(
          "group cursor-pointer overflow-hidden rounded-xl transition-all duration-300",
          "bg-white dark:bg-neutral-900",
          "border border-neutral-200 dark:border-[var(--border-color)]",
          "hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-black/50",
          "focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50",
          className
        )}
        style={{ width: '100%', minHeight: '420px', height: '100%' }}
        tabIndex={0}
        role="button"
        aria-expanded={active}
        {...props}
      >
        {/* Image - Compact aspect ratio */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={src}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/8B5CF6/white?text=No+Image' }}
          />
          
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            style={{ '--theme-color': `hsl(${themeColor})` }}
          />
          
          {/* Badge - constrained width */}
          {badge && (
            <div className="absolute top-2 left-2 max-w-[calc(100%-1rem)] overflow-hidden">
              <div className="truncate">{badge}</div>
            </div>
          )}
        </div>

        {/* Content - Longer description area */}
        <div className="p-5 min-h-[220px] flex flex-col flex-grow gap-3">
          <h3 className="font-semibold text-sm text-[var(--text-primary)] line-clamp-2 mb-2 break-words overflow-hidden leading-snug pr-1">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-[var(--text-muted)] line-clamp-5 break-words overflow-hidden leading-relaxed">
              {description}
            </p>
          )}
          {meta && (
            <div className="mt-auto pt-4 border-t border-[var(--border-color)] overflow-hidden">
              <div className="truncate">{meta}</div>
            </div>
          )}
        </div>
      </motion.article>

      {/* Expanded Modal - Longer card */}
      {createPortal(
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={handleCollapse}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                id={`card-${id}`}
                onClick={(e) => e.stopPropagation()}
                className={cn(
              // Consistent width, long expanded card for all card types
              "w-full max-w-[min(520px,calc(100vw-2rem))] max-h-[min(92vh,1000px)] flex flex-col overflow-hidden rounded-2xl relative",
                  "bg-white dark:bg-[#0a0a0a]",
                  "border border-neutral-200 dark:border-[var(--border-color)]",
                  "shadow-2xl dark:shadow-black/60",
                  classNameExpanded
                )}
                {...props}
              >
                {/* Hero image - Consistent height */}
                <div className="relative shrink-0 h-56 sm:h-64 overflow-hidden">
                  <motion.img
                    src={src}
                    alt={title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/8B5CF6/white?text=No+Image' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-transparent to-transparent opacity-70" />

                  <motion.button
                    ref={expandedCloseRef}
                    aria-label="Close card"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.6)" }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:text-white transition-all duration-150 focus:outline-none"
                    onClick={handleCollapse}
                  >
                    <X size={16} />
                  </motion.button>
                  
                  {badge && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="absolute bottom-3 left-4 max-w-[calc(100%-2rem)]"
                    >
                      {badge}
                    </motion.div>
                  )}
                </div>

                {/* Scrollable content */}
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="px-6 pt-5 pb-5">
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="font-bold text-lg leading-tight mb-3 font-heading break-words overflow-hidden" 
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {title}
                    </motion.h3>
                    {description && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                        className="text-sm leading-relaxed line-clamp-5 break-words overflow-hidden mt-2" 
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {description}
                      </motion.p>
                    )}
                  </div>

                  {children && (
                    <div className="px-6">
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.25 }}
                        className="text-sm pb-5 pt-3 flex flex-col items-start gap-3 overflow-hidden"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {children}
                      </motion.div>
                    </div>
                  )}

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="px-6 py-4 shrink-0 border-t" 
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <InteractionBar {...interactionProps} />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>, 
        document.body
      )}
    </>
  )
}

export { ExpandableCard }

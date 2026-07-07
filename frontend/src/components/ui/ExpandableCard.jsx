import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, Bookmark, Share2, ArrowRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { toggleLike, toggleSave, recordShare, recordView, getInteractionCounts } from "../../services/interactions"
import { lockScroll, unlockScroll } from "../../lib/scrollLock"

/* Tiny icon-only interaction bar */
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
    <div className={cn("flex items-center", compact ? "gap-0.5" : "gap-1")}>
      <button onClick={onLike} aria-label={liked ? 'Unlike' : 'Like'}
        className={cn("p-1 rounded transition-colors duration-150",
          liked ? "text-red-500" : "text-[var(--text-muted)] hover:text-red-400"
        )}>
        <Heart size={compact ? 11 : 13} fill={liked ? "currentColor" : "none"} />
      </button>
      <button onClick={onSave} aria-label={saved ? 'Unsave' : 'Save'}
        className={cn("p-1 rounded transition-colors duration-150",
          saved ? "text-blue-500" : "text-[var(--text-muted)] hover:text-blue-400"
        )}>
        <Bookmark size={compact ? 11 : 13} fill={saved ? "currentColor" : "none"} />
      </button>
      <button onClick={onShare} aria-label="Share"
        className="p-1 rounded text-[var(--text-muted)] hover:text-green-500 transition-colors duration-150">
        <Share2 size={compact ? 11 : 13} />
      </button>
      {!compact && counts.likes > 0 && (
        <span className="text-[10px] ml-0.5" style={{ color: 'var(--text-muted)' }}>{counts.likes}</span>
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
  const cardRef = React.useRef(null)
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

  const handleLike = React.useCallback((e) => {
    e.stopPropagation()
    if (!itemId) return
    const isNowLiked = toggleLike(itemType, itemId)
    setLiked(isNowLiked)
    setCounts(prev => ({ ...prev, likes: prev.likes + (isNowLiked ? 1 : -1) }))
  }, [itemId, itemType])

  const handleSave = React.useCallback((e) => {
    e.stopPropagation()
    if (!itemId) return
    const isNowSaved = toggleSave(itemType, itemId, { title, src, description })
    setSaved(isNowSaved)
    setCounts(prev => ({ ...prev, saves: prev.saves + (isNowSaved ? 1 : -1) }))
  }, [itemId, itemType, title, src, description])

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

  const handleExpand = React.useCallback(() => {
    scrollPositionRef.current = window.scrollY
    lockScroll()
    setActive(true)
    if (itemId) {
      recordView(itemType, itemId, { title, src, description })
    }
  }, [itemId, itemType, title, src, description])

  const handleCollapse = React.useCallback(() => {
    unlockScroll()
    setActive(false)
    setTimeout(() => {
      window.scrollTo({ top: scrollPositionRef.current, behavior: 'instant' })
    }, 0)
  }, [])

  React.useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActive(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  React.useLayoutEffect(() => {
    if (!active) return
    return () => { unlockScroll() }
  }, [active])

  React.useEffect(() => {
    if (active && expandedCloseRef.current) {
      expandedCloseRef.current.focus()
    }
  }, [active])

  const interactionProps = React.useMemo(
    () => ({
      liked, saved, counts,
      onLike: handleLike, onSave: handleSave, onShare: handleShare,
    }),
    [liked, saved, counts, handleLike, handleSave, handleShare]
  )

  return (
    <>
      {/* ── Collapsed Card — Tall & Simple ─────────────────────────────── */}
      <div className="w-full self-stretch">
        <motion.div
          ref={collapsedCardRef}
          layoutId={`card-${title}-${id}`}
          onClick={handleExpand}
          className={cn(
            "group w-full rounded-xl cursor-pointer relative overflow-hidden",
            "bg-white dark:bg-[#0a0a0a]",
            "transition-all duration-200 ease-out",
            "hover:shadow-lg dark:hover:shadow-black/30",
            "hover:-translate-y-px",
            className
          )}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* Image — tall portrait aspect */}
          <div className="relative w-full aspect-[3/4] overflow-hidden">
            <img
              src={src}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x800/8B5CF6/white?text=No+Image'
              }}
            />
            {badge && (
              <div className="absolute top-2.5 left-2.5 z-10">
                {badge}
              </div>
            )}
          </div>

          {/* Content — minimal */}
          <div className="p-3">
            <motion.h3
              layoutId={`title-${title}-${id}`}
              className="text-[13px] font-semibold leading-snug line-clamp-2 mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </motion.h3>

            {description && (
              <motion.p
                layoutId={`description-${description}-${id}`}
                className="text-[11px] leading-relaxed line-clamp-2 mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                {description}
              </motion.p>
            )}

            {meta && (
              <motion.div layoutId={`meta-${title}-${id}`}>
                {meta}
              </motion.div>
            )}

            {/* Bottom row — tiny read more + tiny interactions */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-0.5 text-[10px] font-medium transition-colors duration-150 group-hover:text-[var(--accent)]"
                style={{ color: 'var(--text-muted)' }}
              >
                <span>Buka</span>
                <ArrowRight className="h-2.5 w-2.5 transform transition-transform duration-150 group-hover:translate-x-0.5" />
              </div>
              <InteractionBar compact {...interactionProps} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Expanded Modal ──────────────────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {active && (
            <motion.div
              key={`expand-${id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ position: "fixed", inset: 0, zIndex: 999999 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleCollapse}
              />

              <div className="absolute inset-0 grid place-items-center p-4 sm:p-6" onClick={handleCollapse}>
                <motion.div
                  ref={cardRef}
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  role="dialog"
                  aria-label={title}
                  aria-modal="true"
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "w-[min(28rem,calc(100vw-2rem))] max-h-[min(90vh,640px)] flex flex-col overflow-hidden rounded-xl relative",
                    "bg-white dark:bg-[#0a0a0a]",
                    "shadow-2xl dark:shadow-black/60",
                    classNameExpanded
                  )}
                  {...props}
                >
                  {/* Hero image */}
                  <div className="relative shrink-0 h-44 sm:h-52 overflow-hidden">
                    <img
                      src={src}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/8B5CF6/white?text=No+Image' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-transparent to-transparent opacity-60" />

                    {/* Close — tiny, top-right on image */}
                    <button
                      ref={expandedCloseRef}
                      aria-label="Close card"
                      className="absolute top-2.5 right-2.5 h-7 w-7 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white transition-all duration-150 focus:outline-none"
                      onClick={handleCollapse}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div
                    onWheel={(e) => e.stopPropagation()}
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y"
                  >
                    {/* Title */}
                    <div className="px-4 pt-3 pb-1">
                      {badge && <div className="mb-1.5">{badge}</div>}
                      <h3 className="font-bold text-base leading-tight mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {title}
                      </h3>
                      {description && (
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{description}</p>
                      )}
                    </div>

                    {/* Children */}
                    {children && (
                      <div className="px-4">
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08, duration: 0.25 }}
                          className="text-sm pb-4 pt-2 flex flex-col items-start gap-3"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {children}
                        </motion.div>
                      </div>
                    )}

                    {/* Interactions — tiny, bottom */}
                    <div className="px-4 py-2.5 shrink-0 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <InteractionBar {...interactionProps} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

export { ExpandableCard }

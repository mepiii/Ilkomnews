import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Heart, Bookmark, Share2 } from "lucide-react"
import { cn } from "../../lib/utils"
import { toggleLike, toggleSave, recordShare, getInteractionCounts } from "../../services/interactions"
import { lockScroll, unlockScroll } from "../../lib/scrollLock"

// ── InteractionBar extracted & memoized ───────────────────────────────
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
    <div className={cn("flex items-center gap-1", compact ? "gap-0.5" : "gap-1")}>
      <button
        onClick={onLike}
        aria-label={liked ? 'Unlike' : 'Like'}
        className={cn(
          "flex items-center gap-1 rounded-full transition-all",
          compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs",
          liked
            ? "bg-red-50 dark:bg-red-500/10 text-red-500"
            :          "text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-white/5 hover:text-red-400"
        )}
      >
        <Heart size={compact ? 12 : 14} fill={liked ? "currentColor" : "none"} />
        {!compact && <span>{counts.likes}</span>}
      </button>
      <button
        onClick={onSave}
        aria-label={saved ? 'Unsave' : 'Save'}
        className={cn(
          "flex items-center gap-1 rounded-full transition-all",
          compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs",
          saved
            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-500"
            :          "text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-white/5 hover:text-blue-400"
        )}
      >
        <Bookmark size={compact ? 12 : 14} fill={saved ? "currentColor" : "none"} />
        {!compact && <span>{counts.saves}</span>}
      </button>
      <button
        onClick={onShare}
        aria-label="Share"
        className={cn(
          "flex items-center gap-1 rounded-full transition-all",
          compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs",
          "text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-white/5 hover:text-green-400"
        )}
      >
        <Share2 size={compact ? 12 : 14} />
        {!compact && <span>{counts.shares}</span>}
      </button>
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
  ...props
}) {
  const [active, setActive] = React.useState(false)
  const cardRef = React.useRef(null)
  const collapsedCardRef = React.useRef(null)
  const expandedCloseRef = React.useRef(null)
  const id = React.useId()

  // ── 3D Tilt State (framer-motion) ───────────────────────────────────
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"]), {
    stiffness: 300,
    damping: 30,
  })

  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), {
    stiffness: 300,
    damping: 30,
  })
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), {
    stiffness: 300,
    damping: 30,
  })
  const glareOpacity = useSpring(0, { stiffness: 300, damping: 30 })

  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.25) 0%, transparent 60%)`
  )

  const handleMouseMove = React.useCallback((e) => {
    const el = collapsedCardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
    glareOpacity.set(0.15)
  }, [mouseX, mouseY, glareOpacity])

  const handleMouseLeave = React.useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
    glareOpacity.set(0)
  }, [mouseX, mouseY, glareOpacity])

  const [liked, setLiked] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [counts, setCounts] = React.useState({ likes: 0, saves: 0, shares: 0 })

  React.useEffect(() => {
    if (itemId) {
      const c = getInteractionCounts(itemType, itemId)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLiked(c.isLiked)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaved(c.isSaved)
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    handleMouseLeave()
    lockScroll()
    setActive(true)
  }, [handleMouseLeave])

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

  const handleWheel = React.useCallback((e) => {
    e.stopPropagation()
  }, [])

  return (
    <>
      <div
        className="w-full self-stretch"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          ref={collapsedCardRef}
          layoutId={`card-${title}-${id}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleExpand}
          className={cn(
            "w-full h-[380px] sm:h-[440px] flex flex-col justify-between items-stretch rounded-2xl cursor-pointer relative will-change-transform",
            "backdrop-blur-md",
            className
          )}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-glass)',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            style={{ background: glareBackground, opacity: glareOpacity }}
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
          />

          <div className="flex flex-col flex-1 relative z-20 min-h-0">
            <motion.div layoutId={`image-${title}-${id}`}>
              <img
                src={src}
                alt={title}
                className="w-full h-[150px] sm:h-[200px] rounded-t-2xl object-cover object-center"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/8B5CF6/white?text=No+Image' }}
              />
            </motion.div>
            <div className="flex flex-col flex-1 min-h-0 p-3 sm:p-4 overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="flex flex-col min-w-0 flex-1">
                  {badge && (
                    <motion.div layoutId={`badge-${title}-${id}`} className="mb-1">
                      {badge}
                    </motion.div>
                  )}
                  <motion.h3
                    layoutId={`title-${title}-${id}`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="text-[var(--text-primary)] font-semibold line-clamp-2 break-words cursor-pointer"
                  >
                    {title}
                  </motion.h3>
                  {description && (
                    <motion.p
                      layoutId={`description-${description}-${id}`}
                      className="text-[var(--text-secondary)] text-sm font-medium mt-1 line-clamp-2 break-words"
                    >
                      {description}
                    </motion.p>
                  )}
                </div>
                <motion.button
                  aria-label="Open card"
                  layoutId={`button-${title}-${id}`}
                  className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-950 text-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-950 dark:text-white/70 text-black/70 border border-gray-200/90 dark:border-zinc-900 hover:border-gray-300/90 hover:text-black dark:hover:text-white dark:hover:border-zinc-800 transition-colors duration-300 focus:outline-none ml-2"
                >
                  <motion.div
                    animate={{ rotate: active ? 45 : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </motion.div>
                </motion.button>
              </div>
              {meta && (
                <motion.div layoutId={`meta-${title}-${id}`} className="pt-2 mt-auto">
                  {meta}
                </motion.div>
              )}
            </div>
          </div>
          <div className="w-full px-3 pb-3 pt-2 mt-auto border-t border-gray-100 dark:border-zinc-800/50 relative z-20 shrink-0">
            <InteractionBar compact {...interactionProps} />
          </div>
        </motion.div>
      </div>

      {createPortal(
        <AnimatePresence>
          {active && (
            <motion.div
              key={`expand-${id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: "fixed", inset: 0, zIndex: 999999 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-xl"
                onClick={handleCollapse}
              />

              <div className="absolute inset-0 grid place-items-center p-2 sm:p-6" onClick={handleCollapse}>
                <motion.div
                  ref={cardRef}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  role="dialog"
                  aria-label={title}
                  aria-modal="true"
                  onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "w-[min(36rem,calc(100vw-1rem))] h-[min(95vh,720px)] flex flex-col overflow-hidden sm:rounded-3xl relative",
                      "bg-zinc-50 dark:bg-zinc-950",
                      "shadow-lg dark:shadow-black/20",
                      classNameExpanded
                    )}
                  {...props}
                >
                  <div className="relative shrink-0 overflow-hidden rounded-t-3xl">
                    <img
                      src={src}
                      alt={title}
                      className="w-full h-48 sm:h-72 object-cover object-center"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x500/8B5CF6/white?text=No+Image' }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none" />
                  </div>

                  <div
                    onWheel={handleWheel}
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y"
                  >
                    <div className="flex justify-between items-start p-5 sm:p-6">
                      <div className="min-w-0 flex-1">
                        {badge && (
                          <div className="mb-2">{badge}</div>
                        )}
                        <h3 className="font-semibold text-[var(--text-primary)] text-2xl sm:text-3xl break-words">
                          {title}
                        </h3>
                        {description && (
                          <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-1 break-words">
                            {description}
                          </p>
                        )}
                        {meta && (
                          <div className="mt-3">{meta}</div>
                        )}
                      </div>
                      <button
                        ref={expandedCloseRef}
                        aria-label="Close card"
                        className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-950 text-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-950 dark:text-white/70 text-black/70 border border-gray-200/90 dark:border-zinc-900 hover:border-gray-300/90 hover:text-black dark:hover:text-white dark:hover:border-zinc-800 transition-colors duration-300 focus:outline-none ml-3"
                        onClick={handleCollapse}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>

                    {children && (
                      <div className="relative px-5 sm:px-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.3 }}
                          className="text-[var(--text-secondary)] text-sm pb-8 flex flex-col items-start gap-4"
                        >
                          {children}
                        </motion.div>
                      </div>
                    )}

                    <div className="px-4 sm:px-5 py-3 shrink-0 border-t border-gray-100 dark:border-zinc-800/50">
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

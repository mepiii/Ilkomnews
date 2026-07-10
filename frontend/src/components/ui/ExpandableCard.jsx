import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, Bookmark, Share2, X, Eye } from "lucide-react"
import { cn } from "../../lib/utils"
import { useEngagement } from "../../context/EngagementContext"
import { lockScroll, unlockScroll, resetScrollLock } from "../../lib/scrollLock"
import { shareItem } from "../../lib/share"
import { useToast } from "../../components/ui/Toast"
import { generateSlug } from "../../utils/formatters"

// Abstract, themed placeholder rendered when no image is available.
// Uses a dynamic CSS gradient (from themeColor) plus soft abstract SVG blobs,
// so a broken-image icon never appears.
export const GradientPlaceholder = React.memo(function GradientPlaceholder({
  themeColor = "270 50% 40%",
  title = "",
  className,
}) {
  return (
    <div
      role="img"
      aria-label={title ? `${title} — no image` : "No image"}
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, hsl(${themeColor}) 0%, hsl(${themeColor} / 0.55) 55%, hsl(${themeColor} / 0.15) 100%)`,
      }}
    >
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gp-fade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="140" cy="120" r="180" fill="url(#gp-fade)" />
        <circle cx="660" cy="420" r="220" fill="#ffffff" opacity="0.08" />
        <path
          d="M0 360 Q200 280 400 360 T800 340 V500 H0 Z"
          fill="#000000"
          opacity="0.12"
        />
        <path
          d="M0 300 L260 140 L440 260 L620 120 L800 240"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          opacity="0.18"
        />
      </svg>
    </div>
  )
})

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
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
      {!compact && counts.saves > 0 && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs ml-1 font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          {counts.saves}
        </motion.span>
      )}
      {!compact && counts.shares > 0 && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs ml-1 font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          {counts.shares}
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
  const expandedCardRef = React.useRef(null)
  const expandedCloseRef = React.useRef(null)
  const id = React.useId()

  const { get, ensure, toggleLike, toggleSave, recordView, recordShare } = useEngagement()
  const { showToast } = useToast()
  const eng = itemId
    ? get(itemType, itemId)
    : { liked: false, saved: false, views: 0, likes: 0, saves: 0, shares: 0, loaded: false }
  const liked = eng.liked
  const saved = eng.saved
  const counts = React.useMemo(() => ({
    views: eng.views,
    likes: eng.likes,
    saves: eng.saves,
    shares: eng.shares,
  }), [eng.views, eng.likes, eng.saves, eng.shares])

  // Thumbnail is optional. Fall back to an abstract themed placeholder when the
  // src is missing/empty or fails to load — never show a broken-image icon.
  const [imgError, setImgError] = React.useState(false)
  const hasImage = Boolean(src) && !imgError

  // Load server stats on mount and whenever the card expands.
  React.useEffect(() => {
    if (itemId) ensure(itemType, itemId)
  }, [itemId, itemType, ensure])

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
    toggleLike(itemType, itemId)
  }, [itemId, itemType, toggleLike])

  const handleSave = React.useCallback((e) => {
    e.stopPropagation()
    if (!itemId) return
    toggleSave(itemType, itemId)
  }, [itemId, itemType, toggleSave])

  const handleShare = React.useCallback(async (e) => {
    e.stopPropagation()
    if (!itemId) return
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const path = itemType === 'project'
      ? `/ilkomgallery/project/${itemId}`
      : itemType === 'article'
        ? `/articles/${generateSlug(title)}`
        : `/news/${generateSlug(title)}`
    const url = origin + path
    await shareItem({ title, url })
    showToast('Tautan berhasil disalin & dibagikan', { type: 'success' })
    recordShare(itemType, itemId) // counter dedup happens inside EngagementContext
  }, [itemId, itemType, title, recordShare, showToast])

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
  }, [itemId, itemType, getItemData, recordView])

  const handleCollapse = React.useCallback(() => {
    isExpandedRef.current = false
    unlockScroll()
    setActive(false)
    setTimeout(() => collapsedCardRef.current?.focus(), 100)
  }, [])

  // Pointer-tracked glow — sets --glow-x / --glow-y CSS vars on the
  // card element so the sheen overlay can follow the cursor. Mirrors the
  // technique used in GlowCard. The overlay stays pointer-events-none.
  const handleCardMouseMove = React.useCallback((e) => {
    const el = collapsedCardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
  }, [])

  const handleModalMouseMove = React.useCallback((e) => {
    const el = expandedCardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
  }, [])

  // Safety: if component unmounts while expanded, guarantee scroll is restored
  React.useEffect(() => {
    return () => {
      if (isExpandedRef.current) resetScrollLock()
    }
  }, [])

  const interactionProps = React.useMemo(() => ({
    liked, saved, counts, onLike: handleLike, onSave: handleSave, onShare: handleShare
  }),     [liked, saved, counts, handleLike, handleSave, handleShare])

  return (
    <>
      {/* Collapsed Card - Consistent sizing */}
      <motion.article
        ref={collapsedCardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: '0 0 24px rgba(122,71,166,0.35)' }}
        whileTap={{ scale: 0.98 }}
        onMouseMove={handleCardMouseMove}
        onClick={handleExpand}
        className={cn(
          "group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 relative",
          "bg-white dark:bg-neutral-900",
          "border border-neutral-200 dark:border-[var(--border-color)]",
          "hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-black/50",
          "focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50",
          className
        )}
        style={{ width: '100%', minHeight: '420px', height: '100%', position: 'relative', '--glow-x': '50%', '--glow-y': '50%' }}
        tabIndex={0}
        role="button"
        aria-expanded={active}
        {...props}
      >
        {/* Pointer-tracked sheen glow — revealed softly on hover, behind content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            zIndex: 1,
            background: 'radial-gradient(420px circle at var(--glow-x) var(--glow-y), rgba(122,71,166,0.18), transparent 60%)',
          }}
        />
        {/* Image - Compact aspect ratio (optional; falls back to placeholder) */}
        <div className="relative z-[2] aspect-video overflow-hidden">
          {hasImage ? (
            <img
              src={src}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <GradientPlaceholder
              themeColor={themeColor}
              title={title}
              className="transition-transform duration-500 group-hover:scale-105"
            />
          )}
          
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
        <div className="relative z-[2] p-4 sm:p-5 min-h-[200px] sm:min-h-[220px] flex flex-col flex-grow gap-2 sm:gap-3">
          <motion.h3 
            whileHover={{ scale: 1.02 }} 
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="font-semibold text-sm text-[var(--text-primary)] line-clamp-2 mb-2 break-words overflow-hidden leading-snug pr-1"
          >
            {title}
          </motion.h3>
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

        {/* Compact interaction bar (collapsed card footer) — shares the same
            context state as the expanded modal, so a like here reflects there
            instantly without a reload. */}
        {itemId && (
          <div className="relative z-[2] flex items-center justify-between gap-2 px-4 pb-4 pt-3 border-t border-[var(--border-color)]">
            <InteractionBar
              compact
              liked={liked}
              saved={saved}
              counts={counts}
              onLike={handleLike}
              onSave={handleSave}
              onShare={handleShare}
            />
            <div
              className="flex items-center gap-3 text-[11px] font-medium shrink-0"
              style={{ color: 'var(--text-muted)' }}
              aria-hidden="true"
            >
              {counts.views > 0 && <span className="flex items-center gap-1"><Eye size={12} />{counts.views}</span>}
              {counts.likes > 0 && <span className="flex items-center gap-1"><Heart size={12} />{counts.likes}</span>}
              {counts.saves > 0 && <span className="flex items-center gap-1"><Bookmark size={12} />{counts.saves}</span>}
              {counts.shares > 0 && <span className="flex items-center gap-1"><Share2 size={12} />{counts.shares}</span>}
            </div>
          </div>
        )}
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
                ref={expandedCardRef}
                onMouseMove={handleModalMouseMove}
                whileHover={{ boxShadow: '0 0 30px rgba(122,71,166,0.32)' }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
              // Consistent width, long expanded card for all card types
              "w-full max-w-[min(520px,calc(100vw-2rem))] max-h-[min(92vh,1000px)] flex flex-col overflow-hidden rounded-2xl relative group",
                  "bg-white dark:bg-[#0a0a0a]",
                  "border border-neutral-200 dark:border-[var(--border-color)]",
                  "shadow-2xl dark:shadow-black/60",
                  classNameExpanded
                )}
                style={{ position: 'relative', '--glow-x': '50%', '--glow-y': '50%' }}
                {...props}
              >
                {/* Pointer-tracked sheen glow — revealed softly on hover, behind content */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(420px circle at var(--glow-x) var(--glow-y), rgba(122,71,166,0.18), transparent 60%)',
                  }}
                />
                {/* Hero image - Consistent height (optional; placeholder fallback) */}
                <div className="relative z-[2] shrink-0 h-56 sm:h-64 overflow-hidden">
                  {hasImage ? (
                    <motion.img
                      src={src}
                      alt={title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4 }}
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <motion.div
                      className="w-full h-full"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <GradientPlaceholder themeColor={themeColor} title={title} />
                    </motion.div>
                  )}
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
                  className="relative z-[2] flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y"
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

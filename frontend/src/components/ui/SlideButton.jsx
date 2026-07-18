import { forwardRef, useMemo, useRef, useState, useEffect, useImperativeHandle } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { Check, Loader2, SendHorizontal, X } from 'lucide-react'
import { cn } from '../../lib/utils'

const DRAG_THRESHOLD = 0.85

const ANIMATION_CONFIG = {
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  },
}

const StatusIcon = ({ status }) => {
  const iconMap = useMemo(() => ({
    loading: <Loader2 className="animate-spin" size={20} />,
    success: <Check size={20} />,
    error: <X size={20} />,
  }), [])

  if (!iconMap[status]) return null

  return (
    <motion.div
      key={crypto.randomUUID()}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {iconMap[status]}
    </motion.div>
  )
}

/**
 * SlideButton - Drag-to-submit button with status animation
 * Users drag the handle to the right to trigger submission
 * Shows loading spinner, success checkmark, or error X
 *
 * Props:
 * - onSubmit: called when drag completes past threshold
 * - completed: if true, shows status area instead of slider (controlled)
 * - status: 'idle' | 'loading' | 'success' | 'error' — icon to show when completed
 * - disabled: disable dragging
 * - ref: exposes .reset() to reset button state
 */
const SlideButton = forwardRef(({ className, onSubmit, children, disabled, completed: controlledCompleted, status: controlledStatus }, ref) => {
  const [isDragging, setIsDragging] = useState(false)
  const [internalStatus, setInternalStatus] = useState('idle')
  const [internalCompleted, setInternalCompleted] = useState(false)
  const containerRef = useRef(null)
  const dragRightRef = useRef(200)

  const reduce = useReducedMotion()

  const isControlled = controlledCompleted !== undefined
  const completed = isControlled ? controlledCompleted : internalCompleted
  const status = isControlled ? (controlledStatus || 'loading') : internalStatus

  const dragX = useMotionValue(0)
  const springX = useSpring(dragX, ANIMATION_CONFIG.spring)
  const [dragRight, setDragRight] = useState(200)
  const dragProgress = useTransform(springX, [0, dragRight || 200], [0, 1])

  // Measure container width dynamically — ResizeObserver for mobile
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const updateWidth = () => {
      const rect = el.getBoundingClientRect()
      const width = rect.width
      dragRightRef.current = Math.max(0, width - 32)
      setDragRight(Math.max(0, width - 32))
    }
    updateWidth()
  }, [])

  // Re-observe on resize for mobile orientation changes
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const width = el.getBoundingClientRect().width
      const newRight = Math.max(0, width - 32)
      dragRightRef.current = newRight
      setDragRight(newRight)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Reset dragX when completed transitions to false
  useEffect(() => {
    if (!completed) {
      dragX.set(0)
      springX.set(0)
      if (!isControlled) setInternalStatus('idle')
    }
  }, [completed, dragX, isControlled, springX])
  
  // Also reset when status changes back to idle (for controlled mode)
  useEffect(() => {
    if (status === 'idle' && !completed) {
      dragX.set(0)
      springX.set(0)
    }
  }, [status, completed, dragX, springX])

  const handleDragStart = () => {
    if (completed || disabled) return
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    if (completed || disabled) return
    setIsDragging(false)

    const progress = dragProgress.get()
    if (progress >= DRAG_THRESHOLD) {
      if (isControlled) {
        // Parent controls state; just fire onSubmit
        onSubmit?.()
      } else {
        setInternalCompleted(true)
        setInternalStatus('loading')
        onSubmit?.()
      }
    } else {
      // Reset position when not reaching threshold
      dragX.set(0)
      springX.set(0)
    }
  }

  const handleDrag = (_event, info) => {
    if (completed || disabled) return
    const maxX = dragRightRef.current
    const newX = Math.max(0, Math.min(info.offset.x, maxX))
    dragX.set(newX)
  }

  // Allow parent to reset the button state via imperative handle
  useImperativeHandle(ref, () => ({
    reset: () => {
      setInternalCompleted(false)
      setInternalStatus('idle')
      dragX.set(0)
      setIsDragging(false)
    },
  }))

  const adjustedWidth = useTransform(springX, (x) => x + 10)

  return (
    <motion.div
      ref={containerRef}
      style={{ touchAction: 'none' }}
      animate={completed ? { width: '10rem' } : { width: '100%' }}
      transition={ANIMATION_CONFIG.spring}
      className="relative flex h-14 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-900 mx-auto select-none"
    >
      {!completed && (
        <motion.div
          style={{ width: adjustedWidth }}
          className="absolute inset-y-0 left-0 z-0 rounded-full bg-[var(--accent)]"
        />
      )}

      <AnimatePresence>
        {!completed && (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: dragRight }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            style={{ x: springX, touchAction: 'none' }}
            className="absolute -left-4 z-10 flex cursor-grab items-center justify-start active:cursor-grabbing"
          >
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.06 }}
              whileTap={reduce ? undefined : { scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)] shadow-lg',
                isDragging && 'scale-105',
                className
              )}
            >
              <SendHorizontal className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {completed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className={cn(
                'w-full h-full flex items-center justify-center rounded-full transition-all duration-300 bg-[var(--accent)] text-white',
                className
              )}
            >
              <AnimatePresence mode="wait">
                <StatusIcon status={status} />
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Label */}
      {!completed && (
        <span className="ml-8 text-sm font-medium text-[var(--text-secondary)] select-none">
          {children || 'Geser untuk kirim'}
        </span>
      )}
    </motion.div>
  )
})

SlideButton.displayName = 'SlideButton'

export default SlideButton

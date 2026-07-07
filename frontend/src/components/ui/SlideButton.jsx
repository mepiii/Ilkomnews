import React, { forwardRef, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
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

const useButtonStatus = (resolveTo) => {
  const [status, setStatus] = useState('idle')

  const handleSubmit = useCallback(() => {
    setStatus('loading')
    setTimeout(() => {
      setStatus(resolveTo)
    }, 2000)
  }, [resolveTo])

  return { status, handleSubmit, setStatus }
}

/**
 * SlideButton - Drag-to-submit button with status animation
 * Users drag the handle to the right to trigger submission
 * Shows loading spinner, success checkmark, or error X
 */
const SlideButton = forwardRef(({ className, onSubmit, children, ...props }, ref) => {
  const [isDragging, setIsDragging] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [dragRight, setDragRight] = useState(200)
  const containerRef = useRef(null)
  const dragHandleRef = useRef(null)
  const { handleSubmit } = useButtonStatus('success')

  const dragX = useMotionValue(0)
  const springX = useSpring(dragX, ANIMATION_CONFIG.spring)
  const dragProgress = useTransform(springX, [0, dragRight], [0, 1])

  // Measure container width to set drag constraints dynamically
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      // Handle is 40px (w-10), offset -16px left, so usable = width - 40 + 16
      setDragRight(Math.max(0, width - 32))
    }
  }, [])

  const handleDragStart = useCallback(() => {
    if (completed) return
    setIsDragging(true)
  }, [completed])

  const handleDragEnd = () => {
    if (completed) return
    setIsDragging(false)

    const progress = dragProgress.get()
    if (progress >= DRAG_THRESHOLD) {
      setCompleted(true)
      handleSubmit()
      onSubmit?.()
    } else {
      dragX.set(0)
    }
  }

  const handleDrag = (_event, info) => {
    if (completed) return
    const newX = Math.max(0, Math.min(info.offset.x, dragRight))
    dragX.set(newX)
  }

  const adjustedWidth = useTransform(springX, (x) => x + 10)

  return (
    <motion.div
      ref={containerRef}
      animate={completed ? { width: '10rem' } : { width: '100%' }}
      transition={ANIMATION_CONFIG.spring}
      className="relative flex h-14 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 mx-auto"
    >
      {!completed && (
        <motion.div
          style={{ width: adjustedWidth }}
          className="absolute inset-y-0 left-0 z-0 rounded-full bg-[var(--accent)]"
        />
      )}

      <AnimatePresence key={crypto.randomUUID()}>
        {!completed && (
          <motion.div
            ref={dragHandleRef}
            drag="x"
            dragConstraints={{ left: 0, right: dragRight }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            style={{ x: springX }}
            className="absolute -left-4 z-10 flex cursor-grab items-center justify-start active:cursor-grabbing"
          >
            <div
              ref={ref}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)] shadow-lg',
                isDragging && 'scale-105 transition-transform',
                className
              )}
              {...props}
            >
              <SendHorizontal className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence key={crypto.randomUUID()}>
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
              <AnimatePresence key={crypto.randomUUID()} mode="wait">
                <StatusIcon status={status} />
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Label */}
      {!completed && (
        <span className="ml-8 text-sm font-medium text-[var(--text-secondary)]">
          {children || 'Geser untuk kirim'}
        </span>
      )}
    </motion.div>
  )
})

SlideButton.displayName = 'SlideButton'

export default SlideButton

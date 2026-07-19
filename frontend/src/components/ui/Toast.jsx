import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const ToastContext = createContext(null)

const TYPE_STYLES = {
  success: {
    border: 'border-[var(--accent)]/40',
    icon: '✓',
    iconColor: 'text-[var(--accent)]',
  },
  error: {
    border: 'border-red-500/40',
    icon: '✕',
    iconColor: 'text-red-500',
  },
  info: {
    border: 'border-[var(--accent)]/40',
    icon: 'ℹ',
    iconColor: 'text-[var(--accent)]',
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)
  const prefersReducedMotion = useReducedMotion()

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, opts = {}) => {
    // ponytail: duration=0 keeps the toast persistent (admin feedback that
    // must stay until read); pass duration>0 to auto-dismiss.
    const { type = 'success', duration = 0 } = opts
    const id = ++idRef.current
    setToasts((prev) => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }, [dismiss])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ul
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed top-4 left-1/2 z-[100] flex -translate-x-1/2 list-none flex-col items-center gap-2 m-0 p-0"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const style = TYPE_STYLES[t.type] || TYPE_STYLES.success
            return (
              <motion.li
                key={t.id}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={() => dismiss(t.id)}
                role="button"
                title="Klik untuk menutup"
                className={`pointer-events-auto flex cursor-pointer items-center gap-2 rounded-lg border ${style.border} bg-[var(--bg-card)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] shadow-lg backdrop-blur-md`}
              >
                <span className={`shrink-0 text-base leading-none ${style.iconColor}`} aria-hidden="true">
                  {style.icon}
                </span>
                <span>{t.message}</span>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

export default ToastProvider

import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

/**
 * Toast notification system with queue and auto-dismiss
 * Variants: success, error, info, warning
 * Features: auto-dismiss, manual close, stacking
 * Fully accessible with ARIA live region
 * Uses CSS variables for theming
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      variant: options.variant || 'info',
      duration: options.duration || 3000,
      ...options,
    }

    setToasts((prev) => [...prev, toast])

    if (toast.duration > 0) {
      setTimeout(() => removeToast(id), toast.duration)
    }

    return id
  }, [removeToast])

  const success = useCallback((message, options) => {
    return addToast(message, { ...options, variant: 'success' })
  }, [addToast])

  const error = useCallback((message, options) => {
    return addToast(message, { ...options, variant: 'error' })
  }, [addToast])

  const info = useCallback((message, options) => {
    return addToast(message, { ...options, variant: 'info' })
  }, [addToast])

  const warning = useCallback((message, options) => {
    return addToast(message, { ...options, variant: 'warning' })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function Toast({ toast, onClose }) {
  const { message, variant } = toast

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const variantClasses = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
  }

  const iconColors = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
    warning: 'text-amber-600 dark:text-amber-400',
  }

  const Icon = icons[variant]

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`pointer-events-auto w-80 max-w-full px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm ${variantClasses[variant]}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon size={20} className={`flex-shrink-0 mt-0.5 ${iconColors[variant]}`} aria-hidden="true" />
        )}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Tutup notifikasi"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  )
}

/**
 * Toast component for manual usage without provider
 */
export default function ToastComponent({ message, variant = 'info', onClose, className = '' }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const variantClasses = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
  }

  const Icon = icons[variant]

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm ${variantClasses[variant]} ${className}`}
      role="alert"
    >
      {Icon && <Icon size={20} className="flex-shrink-0 mt-0.5" aria-hidden="true" />}
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Tutup notifikasi"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

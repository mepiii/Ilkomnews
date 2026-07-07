import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * SlideConfirm - Confirmation modal for slide-to-submit
 * Shows warning message with confirm/cancel buttons
 * Used before destructive or irreversible actions
 */
export default function SlideConfirm({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah kamu yakin? Kamu tidak akan bisa mengubahnya lagi',
  confirmText = 'Ya, Kirim',
  cancelText = 'Batal',
  loading = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-[var(--bg-primary)] rounded-lg shadow-2xl border border-[var(--border-color)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-color)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              <p className="text-[var(--text-secondary)]">{message}</p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={cn(
                  'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50',
                  'bg-[var(--accent)] hover:brightness-110'
                )}
              >
                {loading ? 'Mengirim...' : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

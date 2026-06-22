import { AlertCircle } from 'lucide-react'

export default function ErrorState({ message = 'Terjadi kesalahan', onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300" role="alert">
      <div className="flex items-start gap-3">
        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <p>{message}</p>
          {onRetry && (
            <button type="button" onClick={onRetry} className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
              Coba lagi
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

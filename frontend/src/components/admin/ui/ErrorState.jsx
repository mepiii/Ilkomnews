import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorState({ message = 'Gagal memuat data', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle size={32} className="text-red-400 dark:text-red-500 mb-3" />
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#262626] transition-colors"
        >
          <RefreshCw size={14} /> Muat ulang
        </button>
      )}
    </div>
  )
}

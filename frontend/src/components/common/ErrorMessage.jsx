import { AlertCircle } from 'lucide-react'

const ErrorMessage = ({ message, onRetry }) => (
  <div className="glass-card rounded-lg p-4 my-4 border-red-300/30">
    <div className="flex items-center space-x-3">
      <AlertCircle className="text-red-500" size={24} />
      <div className="flex-1">
        <p className="text-red-600 dark:text-red-400">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 font-medium text-sm">
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  </div>
)

export default ErrorMessage

import { Component } from 'react'
import { WordBounce } from '../ui/WordBounce'

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      if (import.meta.env.DEV) {
        return (
          <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-8">
            <div className="max-w-md w-full text-center">
              <h1 className="text-2xl font-bold text-red-500 mb-4"><WordBounce text="Something went wrong" /></h1>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-sm font-mono break-all">
                {this.state.error.message}
              </p>
              <pre className="text-xs text-neutral-500 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-xl overflow-auto text-left max-h-64">
                {this.state.error.stack}
              </pre>
              <button onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2 text-white rounded-xl" style={{ background: 'var(--accent)' }}>
                Reload
              </button>
            </div>
          </div>
        )
      }
      return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4"><WordBounce text="Something went wrong" /></h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-sm">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <button onClick={() => window.location.reload()}
              className="px-6 py-2 text-white rounded-xl" style={{ background: 'var(--accent)' }}>
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary

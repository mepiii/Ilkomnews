const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12 min-h-[200px]">
    <div className="relative flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 animate-spin" />
        <div className="absolute inset-0 w-9 h-9 m-auto rounded-full border-2 border-indigo-500/30" style={{ animation: 'spin-reverse 1.5s linear infinite' }} />
        <div className="absolute inset-0 w-4 h-4 m-auto">
          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-purple-600 dark:text-purple-400 font-mono text-xs tracking-wider animate-pulse">LOADING</span>
        <div className="flex gap-0.5">
          {[0, 0.2, 0.4].map((d) => (
            <div key={d} className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
          ))}
        </div>
      </div>
      <p className="text-theme-muted text-xs animate-pulse">Memuat data...</p>
    </div>
  </div>
)

export default LoadingSpinner

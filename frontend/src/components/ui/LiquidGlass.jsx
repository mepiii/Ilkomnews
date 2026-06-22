const LiquidGlass = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export { LiquidGlass }

import { cn } from "@/lib/utils"

export function PageBackground({ children, className }) {
  return (
    <div className={cn("relative min-h-screen", className)}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

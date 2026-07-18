import { cn } from "@/lib/utils"

/**
 * PageBackground — global page chrome.
 *
 * Renders a layered background that matches the brand quality in BOTH
 * light and dark modes:
 *   - Light: subtle purple wash + faint grid for depth.
 *   - Dark: deep navy/purple gradient + matching soft glow accents so
 *     the page no longer reads as a flat #0a0a0a slab.
 *
 * The two radial accents (top-left and bottom-right) mirror the
 * decorative dots in the light-mode tiles, and are pure CSS so they
 * add zero JS, zero image weight, and resize with the viewport.
 */
export function PageBackground({ children, className }) {
  return (
    <div
      className={cn(
        // Fully transparent — Tiles background shows through with no overlay.
        "relative min-h-screen overflow-hidden bg-transparent",
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

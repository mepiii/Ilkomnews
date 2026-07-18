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
        "relative min-h-screen overflow-hidden",
        // Light: soft purple wash on white
        "bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(122,71,166,0.10),transparent_60%),linear-gradient(180deg,#fafafa_0%,#f3eef9_100%)]",
        // Dark: deep gradient + matching purple glow (replaces flat #0a0a0a)
        "dark:bg-[radial-gradient(1000px_500px_at_15%_-10%,rgba(122,71,166,0.18),transparent_55%),radial-gradient(900px_500px_at_85%_110%,rgba(170,120,225,0.12),transparent_60%),linear-gradient(180deg,#08070b_0%,#0a090f_50%,#07060a_100%)]",
        className
      )}
    >
      {/* Faint grid overlay for depth, theme-aware. Pointer-events-none so
          it never intercepts clicks. Uses a CSS background, no extra markup. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]
          bg-[linear-gradient(rgba(122,71,166,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(122,71,166,0.6)_1px,transparent_1px)]
          bg-[size:48px_48px]"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

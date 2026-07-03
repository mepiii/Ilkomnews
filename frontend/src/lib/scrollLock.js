/**
 * Centralized scroll-lock utility.
 * Uses a counter so multiple modals/widgets can coexist
 * without breaking body scroll when one closes.
 * Saves and restores scroll position across lock/unlock.
 */
let lockCount = 0
let savedScrollY = 0

export function lockScroll() {
  if (lockCount === 0) {
    savedScrollY = window.scrollY || document.documentElement.scrollTop || 0
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.touchAction = 'none'
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.position = 'fixed'
    document.body.style.left = '0'
    document.body.style.right = '0'
  }
  lockCount++
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    const y = savedScrollY
    document.documentElement.style.overflow = ''
    document.documentElement.style.touchAction = ''
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    requestAnimationFrame(() => {
      window.scrollTo(0, y)
    })
  }
}

export function resetScrollLock() {
  lockCount = 0
  document.documentElement.style.overflow = ''
  document.documentElement.style.touchAction = ''
  document.body.style.overflow = ''
  document.body.style.touchAction = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
}

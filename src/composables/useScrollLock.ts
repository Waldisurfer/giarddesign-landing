import { onBeforeUnmount } from 'vue'

/* Counter-based body scroll lock shared by all overlays (mobile menu, lightbox).
   Reference counting prevents one overlay's close from unlocking scroll while
   another overlay is still open. Auto-releases on component unmount. */

let lockCount = 0

export function useScrollLock() {
  let isHolding = false

  function lock() {
    if (isHolding) return
    isHolding = true
    lockCount += 1
    if (lockCount === 1) document.body.style.overflow = 'hidden'
  }

  function unlock() {
    if (!isHolding) return
    isHolding = false
    lockCount -= 1
    if (lockCount === 0) document.body.style.removeProperty('overflow')
  }

  onBeforeUnmount(unlock)

  return { lock, unlock }
}

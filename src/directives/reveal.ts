import type { Directive } from 'vue'

/* v-reveal — scroll-reveal via a single shared IntersectionObserver.
   Default: fade-up. `v-reveal:mask`: pure slide-up inside an overflow-hidden
   parent (heading reveal). Value = stagger delay in ms: `v-reveal="150"`.

   Gotcha worth remembering: IntersectionObserver clips the target's rect by
   ancestors' overflow. A heading translated 110% down inside an overflow-hidden
   mask is 100% clipped → its ratio stays 0 and it would never reveal. That is
   why for the mask variant we OBSERVE THE MASK (parent) and reveal the child.

   Fail-open policy: content must never end up permanently hidden. The hiding
   class is only applied AFTER observation successfully starts; any observer
   failure leaves the element fully visible.

   Respects prefers-reduced-motion: no classes added, content stays visible. */

const revealTargets = new WeakMap<Element, HTMLElement>()
/* Observed element remembered per directive element, so unmount does not have
   to re-derive it from a DOM structure that may already be detached. */
const observedByEl = new WeakMap<HTMLElement, Element>()
let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealTargets.get(entry.target)?.classList.add('is-revealed')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
  }
  return observer
}

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const isMask = binding.arg === 'mask'
    const observed = isMask ? (el.parentElement ?? el) : el

    if (import.meta.env.DEV && revealTargets.has(observed)) {
      console.warn('[v-reveal] two mask elements share one parent — first one will never reveal', observed)
    }

    try {
      revealTargets.set(observed, el)
      observedByEl.set(el, observed)
      getObserver().observe(observed)
    } catch (error) {
      /* Fail open: without a working observer the element must stay visible. */
      console.error('[v-reveal] observer failed, leaving content visible', error)
      return
    }

    el.classList.add(isMask ? 'reveal-mask' : 'reveal')
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
  },
  unmounted(el) {
    const observed = observedByEl.get(el)
    if (observed) {
      observer?.unobserve(observed)
      observedByEl.delete(el)
    }
  },
}

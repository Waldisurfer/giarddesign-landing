<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useScrollLock } from '../composables/useScrollLock'
import logoUrl from '../assets/icons/logo-giarddesign.svg'
import searchIconUrl from '../assets/icons/icon-search.svg'
import chevronIconUrl from '../assets/icons/icon-chevron-down.svg'

const NAV_LINKS = [
  { label: 'O firmie', href: '#o-firmie' },
  { label: 'Realizacje', href: '#realizacje' },
  { label: 'Kontakt', href: '#kontakt' },
]

const OFFER_LINKS = [
  { label: 'Projekty', href: '#projekty' },
  { label: 'Wizualizacje', href: '#wizualizacje' },
  { label: 'Realizacje', href: '#realizacje' },
]

const isOfferOpen = ref(false)
const isSearchOpen = ref(false)
const isMobileOpen = ref(false)
const searchQuery = ref('')

const rootEl = ref<HTMLElement | null>(null)
const searchInputEl = ref<HTMLInputElement | null>(null)
const burgerEl = ref<HTMLButtonElement | null>(null)
const { lock, unlock } = useScrollLock()

/* The element that opened the current overlay — focus goes back to it on close
   (a11y: keyboard users must not lose their place). */
let overlayTrigger: HTMLElement | null = null

function closeOverlays(returnFocus = false) {
  isOfferOpen.value = false
  isSearchOpen.value = false
  if (returnFocus) overlayTrigger?.focus()
  overlayTrigger = null
}

/* Desktop-only hover open/close; touch pointers fall through to the plain
   anchor navigation. */
function onOfferHover(open: boolean, event: PointerEvent) {
  if (event.pointerType === 'touch') return
  /* WCAG 1.4.13: never hover-close while KEYBOARD focus is inside the menu.
     :focus-visible separates keyboard focus from focus left behind by a mouse
     click — after a click the menu must still collapse on pointerleave. */
  const li = event.currentTarget as HTMLElement
  const active = document.activeElement
  if (!open && active && li.contains(active) && active.matches(':focus-visible')) return
  if (open) isSearchOpen.value = false
  isOfferOpen.value = open
  /* Hover interactions don't own focus — clear any stale click-set trigger,
     so a later Escape doesn't send focus to an unrelated button. */
  overlayTrigger = null
}

/* Keyboard path: focusing the trigger (Tab) opens the panel so its links are
   reachable; focus leaving the whole <li> closes it. Enter on the trigger
   follows the #oferta anchor like a mouse click. */
function onOfferFocusIn(event: FocusEvent) {
  isSearchOpen.value = false
  isOfferOpen.value = true
  overlayTrigger = event.currentTarget instanceof HTMLElement
    ? (event.currentTarget.querySelector('a[aria-controls="offer-dropdown"]') as HTMLElement | null)
    : null
}
function onOfferFocusOut(event: FocusEvent) {
  const li = event.currentTarget as HTMLElement
  if (event.relatedTarget instanceof Node && li.contains(event.relatedTarget)) return
  isOfferOpen.value = false
  overlayTrigger = null
}

async function toggleSearch(event: MouseEvent) {
  isOfferOpen.value = false
  isSearchOpen.value = !isSearchOpen.value
  overlayTrigger = isSearchOpen.value ? (event.currentTarget as HTMLElement) : null
  if (isSearchOpen.value) {
    await nextTick()
    searchInputEl.value?.focus()
  }
}

function toggleMobile() {
  closeOverlays()
  isMobileOpen.value = !isMobileOpen.value
}

function submitSearch() {
  // No backend — the search is a UI element required by the task.
  searchQuery.value = ''
  closeOverlays(true)
}

/* Zamykanie klikiem poza headerem + klawiszem Esc. */
function onDocumentClick(event: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) closeOverlays()
}
function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    /* Only act when something is open — a bare Escape must not move focus. */
    if (isOfferOpen.value || isSearchOpen.value) closeOverlays(true)
    if (isMobileOpen.value) {
      isMobileOpen.value = false
      burgerEl.value?.focus()
    }
  }
}
onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
  setBackgroundInert(false)
})

/* While the fullscreen mobile menu is open: lock page scroll and make the
   content behind the overlay inert, so keyboard/AT users cannot land in
   visually hidden content (the native <dialog> lightbox gets this for free —
   a custom overlay has to do it by hand). */
function setBackgroundInert(inert: boolean) {
  for (const el of document.querySelectorAll('main, footer')) {
    el.toggleAttribute('inert', inert)
  }
}
watch(isMobileOpen, (open) => {
  if (open) lock()
  else unlock()
  setBackgroundInert(open)
})
</script>

<template>
  <!-- While the fullscreen mobile menu is open the header pins to the viewport
       top: the page may be scrolled anywhere, and the menu (fixed top-16)
       assumes the bar with the close button sits right above it — otherwise a
       strip of page content shows through and the X is off-screen. -->
  <header ref="rootEl" class="z-40 bg-white" :class="isMobileOpen ? 'fixed inset-x-0 top-0' : 'relative'">
    <div class="container-page flex h-16 items-center justify-between lg:h-[72px]">
      <a href="#" aria-label="GiardDesign — strona główna" @click="isMobileOpen = false">
        <img :src="logoUrl" alt="GiardDesign" width="114" height="19" />
      </a>

      <!-- Nawigacja desktop -->
      <nav class="hidden items-center lg:flex" aria-label="Nawigacja główna">
        <ul class="flex items-center gap-5 text-small">
          <li
            class="relative"
            @pointerenter="onOfferHover(true, $event)"
            @pointerleave="onOfferHover(false, $event)"
            @focusin="onOfferFocusIn"
            @focusout="onOfferFocusOut"
          >
            <!-- The trigger is a real link: hover opens the menu, a click follows
                 the anchor to the Oferta section (and the pointer cursor comes
                 for free with the <a>). -->
            <a
              href="#oferta"
              class="flex items-center gap-2 px-4 py-2 transition-colors hover:text-forest"
              :aria-expanded="isOfferOpen"
              aria-controls="offer-dropdown"
              @click="closeOverlays()"
            >
              Oferta
              <img
                :src="chevronIconUrl"
                alt=""
                width="8"
                height="5"
                class="transition-transform duration-300 motion-reduce:transition-none"
                :class="{ 'rotate-180': isOfferOpen }"
              />
            </a>
            <!-- Panel offset -8px: its 24px item padding then puts the link text in
                 the exact column of the 'Oferta' label (which sits 16px in, px-4).
                 pt-4 = 16px: the li ends at y=56 inside the 72px bar, so the panel's
                 visible edge starts exactly at the header's bottom (top of the hero
                 photo). The padding doubles as a hover bridge — the cursor never
                 leaves the <li>, so hover-open is stable. -->
            <Transition name="dropdown">
              <div
                v-show="isOfferOpen"
                id="offer-dropdown"
                class="absolute -left-2 top-full w-max pt-4"
              >
                <ul class="bg-white py-3 shadow-[0_16px_40px_rgba(17,17,17,0.12)]">
                  <li v-for="link in OFFER_LINKS" :key="link.label">
                    <a
                      :href="link.href"
                      class="block px-6 py-2.5 transition-colors hover:text-forest"
                      @click="closeOverlays()"
                    >
                      {{ link.label }}
                    </a>
                  </li>
                </ul>
              </div>
            </Transition>
          </li>
          <li v-for="link in NAV_LINKS" :key="link.label">
            <a :href="link.href" class="px-4 py-2 transition-colors hover:text-forest">
              {{ link.label }}
            </a>
          </li>
        </ul>
        <button
          type="button"
          class="-mr-2 ml-3 p-2 transition-opacity hover:opacity-60"
          :aria-expanded="isSearchOpen"
          aria-controls="search-panel"
          :aria-label="isSearchOpen ? 'Zamknij wyszukiwarkę' : 'Otwórz wyszukiwarkę'"
          @click="toggleSearch"
        >
          <img :src="searchIconUrl" alt="" width="24" height="24" />
        </button>
      </nav>

      <!-- Kontrolki mobile: lupa zostaje w pasku, menu za hamburgerem -->
      <div class="flex items-center gap-1 lg:hidden">
        <button
          type="button"
          class="p-2 transition-opacity hover:opacity-60"
          :aria-expanded="isSearchOpen"
          aria-controls="search-panel"
          :aria-label="isSearchOpen ? 'Zamknij wyszukiwarkę' : 'Otwórz wyszukiwarkę'"
          @click="toggleSearch"
        >
          <img :src="searchIconUrl" alt="" width="24" height="24" />
        </button>
        <button
          ref="burgerEl"
          type="button"
          class="group -mr-2 p-2"
          :aria-expanded="isMobileOpen"
          aria-controls="mobile-menu"
          :aria-label="isMobileOpen ? 'Zamknij menu' : 'Otwórz menu'"
          @click="toggleMobile"
        >
          <span class="relative block h-4 w-6">
            <span
              class="absolute left-0 top-0 block h-0.5 w-6 bg-ink transition-transform duration-300"
              :class="{ 'translate-y-[7px] rotate-45': isMobileOpen }"
            />
            <span
              class="absolute left-0 top-[7px] block h-0.5 w-6 bg-ink transition-opacity duration-300"
              :class="{ 'opacity-0': isMobileOpen }"
            />
            <span
              class="absolute left-0 top-[14px] block h-0.5 w-6 bg-ink transition-transform duration-300"
              :class="{ '-translate-y-[7px] -rotate-45': isMobileOpen }"
            />
          </span>
        </button>
      </div>
    </div>

    <!-- Panel wyszukiwarki — wysuwa się pod paskiem na każdym breakpoincie -->
    <Transition name="panel">
      <div
        v-show="isSearchOpen"
        id="search-panel"
        class="absolute inset-x-0 top-full border-t border-ink/10 bg-white shadow-[0_24px_48px_rgba(17,17,17,0.08)]"
      >
        <form
          class="container-page flex items-center gap-4 py-5"
          role="search"
          @submit.prevent="submitSearch"
        >
          <img :src="searchIconUrl" alt="" width="24" height="24" class="shrink-0 opacity-40" />
          <label for="site-search" class="sr-only">Czego szukasz?</label>
          <input
            id="site-search"
            ref="searchInputEl"
            v-model="searchQuery"
            type="search"
            placeholder="Czego szukasz?"
            autocomplete="off"
            class="w-full bg-transparent text-body outline-none placeholder:text-ink/40"
          />
          <button
            type="submit"
            class="shrink-0 rounded-full bg-forest px-6 pb-3 pt-2.5 text-small text-cream transition-colors hover:bg-forest/90"
          >
            Szukaj
          </button>
        </form>
      </div>
    </Transition>

    <!-- Menu mobilne (fullscreen pod paskiem) -->
    <Transition name="panel">
      <nav
        v-show="isMobileOpen"
        id="mobile-menu"
        class="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-white lg:hidden"
        aria-label="Menu mobilne"
      >
        <ul class="container-page flex flex-col gap-1 py-8">
          <li>
            <span class="block px-0 py-2 text-label uppercase tracking-wide text-forest">Oferta</span>
            <ul class="flex flex-col">
              <li v-for="link in OFFER_LINKS" :key="link.label">
                <a
                  :href="link.href"
                  class="block py-3 font-display text-h3 transition-colors hover:text-forest"
                  @click="toggleMobile"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </li>
          <li class="mt-4 border-t border-ink/10 pt-6">
            <ul class="flex flex-col">
              <li v-for="link in NAV_LINKS" :key="link.label">
                <a
                  :href="link.href"
                  class="block py-3 font-display text-h3 transition-colors hover:text-forest"
                  @click="toggleMobile"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
/* Vue <Transition> — animujemy tylko transform/opacity (kompozytor). */
.dropdown-enter-active,
.dropdown-leave-active,
.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
@media (prefers-reduced-motion: reduce) {
  .dropdown-enter-active,
  .dropdown-leave-active,
  .panel-enter-active,
  .panel-leave-active {
    transition-duration: 0.01s;
  }
}
</style>

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

function toggleOffer(event: MouseEvent) {
  isSearchOpen.value = false
  isOfferOpen.value = !isOfferOpen.value
  overlayTrigger = isOfferOpen.value ? (event.currentTarget as HTMLElement) : null
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
    closeOverlays(true)
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
  <header ref="rootEl" class="relative z-40 bg-white">
    <div class="container-page flex h-16 items-center justify-between lg:h-[72px]">
      <a href="#" aria-label="GiardDesign — strona główna" @click="isMobileOpen = false">
        <img :src="logoUrl" alt="GiardDesign" width="114" height="19" />
      </a>

      <!-- Nawigacja desktop -->
      <nav class="hidden items-center lg:flex" aria-label="Nawigacja główna">
        <ul class="flex items-center gap-5 text-small">
          <li class="relative">
            <button
              type="button"
              class="flex items-center gap-2 px-4 py-2 transition-colors hover:text-forest"
              :aria-expanded="isOfferOpen"
              aria-controls="offer-dropdown"
              @click="toggleOffer"
            >
              Oferta
              <img
                :src="chevronIconUrl"
                alt=""
                width="8"
                height="5"
                class="transition-transform duration-300"
                :class="{ 'rotate-180': isOfferOpen }"
              />
            </button>
            <Transition name="dropdown">
              <ul
                v-show="isOfferOpen"
                id="offer-dropdown"
                class="absolute left-4 top-full mt-3 w-52 rounded-2xl bg-white py-3 shadow-[0_16px_40px_rgba(17,17,17,0.12)]"
              >
                <li v-for="link in OFFER_LINKS" :key="link.label">
                  <a
                    :href="link.href"
                    class="block px-6 py-2.5 transition-colors hover:bg-cream hover:text-forest"
                    @click="closeOverlays()"
                  >
                    {{ link.label }}
                  </a>
                </li>
              </ul>
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

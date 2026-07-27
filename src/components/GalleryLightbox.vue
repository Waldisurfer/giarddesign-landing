<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useScrollLock } from '../composables/useScrollLock'
import IconArrow from './ui/IconArrow.vue'

/* Native <dialog> — the senior shortcut: showModal() gives the focus trap,
   Esc handling, ::backdrop and top-layer for free. On close, the browser
   returns focus to the element that opened the dialog. */

export interface LightboxImage {
  src: string
  alt: string
  width: number
  height: number
}

const props = defineProps<{
  images: LightboxImage[]
  index: number | null
}>()

const emit = defineEmits<{ close: [] }>()

const dialogEl = ref<HTMLDialogElement | null>(null)
const activeIndex = ref(0)
const { lock, unlock } = useScrollLock()

watch(
  () => props.index,
  (value) => {
    if (value === null) return
    activeIndex.value = value
    const dialog = dialogEl.value
    /* Feature-detect: without full <dialog> support a thumbnail click would
       otherwise throw silently inside the watcher and do nothing visible. */
    if (!dialog || typeof dialog.showModal !== 'function') {
      console.error('[lightbox] <dialog>.showModal unsupported in this browser')
      emit('close')
      return
    }
    if (!dialog.open) {
      dialog.showModal()
      lock()
    }
  },
  /* post-flush: the <figure> (with the autofocus close button) must exist in
     the DOM before showModal() runs, or the dialog itself receives focus. */
  { flush: 'post' },
)

function step(delta: number) {
  const total = props.images.length
  if (total === 0) return
  activeIndex.value = (activeIndex.value + delta + total) % total
}

function close() {
  dialogEl.value?.close()
}

/* Fired by Esc as well — single cleanup path. */
function onClose() {
  unlock()
  emit('close')
}

onBeforeUnmount(unlock)

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialogEl.value) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') step(-1)
  if (event.key === 'ArrowRight') step(1)
}
</script>

<template>
  <dialog
    ref="dialogEl"
    class="lightbox m-auto w-[min(92vw,1000px)] bg-transparent p-0 backdrop:bg-ink/85"
    aria-label="Galeria realizacji"
    @close="onClose"
    @click="onBackdropClick"
    @keydown="onKeydown"
  >
    <figure v-if="index !== null" class="relative">
      <img
        :key="activeIndex"
        :src="images[activeIndex].src"
        :alt="images[activeIndex].alt"
        :width="images[activeIndex].width"
        :height="images[activeIndex].height"
        class="lightbox-img mx-auto max-h-[82vh] w-auto object-contain"
      />
      <!-- aria-live: arrow-key navigation must be announced to screen readers -->
      <figcaption aria-live="polite" aria-atomic="true" class="mt-4 text-center text-small text-white/70">
        {{ activeIndex + 1 }} / {{ images.length }}
      </figcaption>

      <button
        type="button"
        autofocus
        class="absolute -top-12 right-0 grid h-10 w-10 place-items-center text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
        aria-label="Zamknij galerię"
        @click="close"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M1 1L21 21M21 1L1 21" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>

      <button
        type="button"
        class="absolute left-0 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-white/90 text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-white sm:-left-2"
        aria-label="Poprzednie zdjęcie"
        @click="step(-1)"
      >
        <IconArrow direction="left" :size="28" />
      </button>
      <button
        type="button"
        class="absolute right-0 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-white/90 text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-white sm:-right-2"
        aria-label="Następne zdjęcie"
        @click="step(1)"
      >
        <IconArrow direction="right" :size="28" />
      </button>
    </figure>
  </dialog>
</template>

<style scoped>
/* Open/close animation for the native dialog: @starting-style + allow-discrete
   (progressive enhancement — older browsers just get an instant dialog). */
.lightbox {
  opacity: 0;
  transform: scale(0.96);
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    overlay 0.3s ease allow-discrete,
    display 0.3s ease allow-discrete;
}
.lightbox[open] {
  opacity: 1;
  transform: scale(1);
}
@starting-style {
  .lightbox[open] {
    opacity: 0;
    transform: scale(0.96);
  }
}
.lightbox::backdrop {
  transition: opacity 0.3s ease;
}
@media (prefers-reduced-motion: reduce) {
  .lightbox {
    transition: none;
  }
}
</style>

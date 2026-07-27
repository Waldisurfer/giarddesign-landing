<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { MacyInstance } from 'macy'
import GalleryLightbox from './GalleryLightbox.vue'
import type { LightboxImage } from './GalleryLightbox.vue'
import IconArrow from './ui/IconArrow.vue'
import SectionIntro from './ui/SectionIntro.vue'

/* Masonry via Macy.js — a hard requirement from the Figma note.
   Vite glob-imports keep the image list in one place. */
const galleryModules = import.meta.glob<{ default: string }>('../assets/img/gallery-*.webp', {
  eager: true,
})
const extraModules = import.meta.glob<{ default: string }>('../assets/img/extra-*.webp', {
  eager: true,
})

/* Hand-maintained metadata per file: intrinsic size (CLS) + descriptive alt
   (a11y/SEO — filename-derived alts are useless to screen reader users). */
const IMAGE_META: Record<string, { width: number; height: number; alt: string }> = {
  'gallery-01': { width: 902, height: 1202, alt: 'Białe schody ogrodowe wśród palm i przystrzyżonego trawnika' },
  'gallery-02': { width: 904, height: 676, alt: 'Przydomowy basen z drewnianą pergolą przy nowoczesnym domu' },
  'gallery-03': { width: 902, height: 902, alt: 'Tunel z pnących róż nad kamienną alejką' },
  'gallery-04': { width: 902, height: 904, alt: 'Patio z drewnianymi ławkami pod stalową pergolą' },
  'gallery-05': { width: 904, height: 904, alt: 'Staw ogrodowy z karpiami koi i liliami wodnymi' },
  'gallery-06': { width: 902, height: 1206, alt: 'Kamienna ścieżka wijąca się przez bujną tropikalną zieleń' },
  'gallery-07': { width: 902, height: 676, alt: 'Nowoczesna betonowa architektura ogrodu z samotnym drzewem' },
  'gallery-08': { width: 904, height: 1202, alt: 'Drewniany taras z pergolą na miejskim podwórku' },
  'gallery-09': { width: 902, height: 676, alt: 'Detal drewnianej pergoli na tle koron drzew' },
  'extra-10': { width: 1024, height: 768, alt: 'Ogród z białymi schodami i palmami — ujęcie szerokie' },
  'extra-11': { width: 1024, height: 683, alt: 'Karpie koi w szmaragdowej wodzie stawu' },
  'extra-12': { width: 1024, height: 683, alt: 'Turkusowy basen przy tarasie z pergolą' },
  'extra-13': { width: 683, height: 1024, alt: 'Geometryczny zielony labirynt z żywopłotu' },
  'extra-14': { width: 1024, height: 683, alt: 'Ogród japoński z kamienną latarnią i żwirową kompozycją' },
  'extra-15': { width: 683, height: 1024, alt: 'Ścieżka z otoczaków wśród egzotycznych roślin' },
  'extra-16': { width: 768, height: 1024, alt: 'Dziedziniec z ławkami i pergolą między budynkami' },
  'extra-17': { width: 767, height: 1024, alt: 'Aleja różana pod łukowatą pergolą' },
  'extra-18': { width: 768, height: 1024, alt: 'Drewniany podest i pergola w przydomowym ogrodzie' },
  'extra-19': { width: 1024, height: 686, alt: 'Konstrukcja drewnianej pergoli — detal zadaszenia' },
  'extra-20': { width: 1024, height: 683, alt: 'Betonowe schody i rampa z zielenią w tle' },
}

function toImages(modules: Record<string, { default: string }>): LightboxImage[] {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, mod]) => {
      const name = path.replace(/^.*\/(.+)\.webp$/, '$1')
      const meta = IMAGE_META[name]
      if (import.meta.env.DEV && !meta) {
        console.warn(`[gallery] missing IMAGE_META entry for "${name}" — using fallback size/alt`)
      }
      return {
        src: mod.default,
        alt: meta?.alt ?? 'Realizacja ogrodu',
        width: meta?.width ?? 900,
        height: meta?.height ?? 900,
      }
    })
}

const INITIAL_IMAGES = toImages(galleryModules)
const EXTRA_IMAGES = toImages(extraModules)

const isExpanded = ref(false)
const visibleImages = computed(() =>
  isExpanded.value ? [...INITIAL_IMAGES, ...EXTRA_IMAGES] : INITIAL_IMAGES,
)

const gridEl = ref<HTMLElement | null>(null)
let macy: MacyInstance | null = null

onMounted(async () => {
  if (!gridEl.value) return
  /* Dynamic import: Macy is below the fold — no need to parse it before mount. */
  const { default: Macy } = await import('macy')
  try {
    macy = Macy({
      container: gridEl.value,
      columns: 3,
      margin: 43,
      trueOrder: true,
      breakAt: { 1023: { columns: 2, margin: 16 } },
    })
    macy.runOnImageLoad(() => macy?.recalculate(true), true)
  } catch (error) {
    /* Fail visible: degrade to a CSS-columns layout instead of a broken stack. */
    console.error('[gallery] Macy init failed, falling back to CSS columns', error)
    gridEl.value.classList.add('masonry-fallback')
  }
})

onBeforeUnmount(() => {
  macy?.remove()
  macy = null
})

async function expand() {
  isExpanded.value = true
  await nextTick()
  macy?.recalculate(true, true)
  /* The "Rozwiń" button just removed itself from the DOM along with the user's
     focus — move focus to the first newly loaded tile. */
  const firstNewTile = gridEl.value?.querySelectorAll('button')[INITIAL_IMAGES.length]
  firstNewTile?.focus()
}

function onImgError(event: Event) {
  console.error('[gallery] image failed to load', (event.target as HTMLImageElement).src)
}

/* Lightbox state — index into visibleImages, null = closed. */
const lightboxIndex = ref<number | null>(null)
</script>

<template>
  <section id="realizacje" class="scroll-mt-16 bg-sand py-16 lg:py-[120px]">
    <div class="container-page">
      <SectionIntro label="Realizacje">
        Nasze <em class="font-sans font-medium italic tracking-normal">projekty</em>
      </SectionIntro>

      <!-- Masonry is full-bleed in the design (edge to edge), unlike the heading.
           margin: calc(50% - 50vw) breaks the grid out of the page container. -->
      <div class="relative mt-12 mx-[calc(50%-50vw)] lg:mt-16">
        <div ref="gridEl">
          <button
            v-for="(image, i) in visibleImages"
            :key="image.src"
            v-reveal="(i % 3) * 100"
            type="button"
            class="group block w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
            :aria-label="`Powiększ zdjęcie: ${image.alt}`"
            @click="lightboxIndex = i"
          >
            <img
              :src="image.src"
              :alt="image.alt"
              :width="image.width"
              :height="image.height"
              loading="lazy"
              class="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              @error="onImgError"
            />
          </button>
        </div>

        <!-- Bottom fade + expand button, exactly like the design (gone once expanded) -->
        <div
          v-if="!isExpanded"
          class="pointer-events-none absolute inset-x-0 bottom-0 h-[320px] bg-gradient-to-t from-sand via-sand/70 to-transparent"
          aria-hidden="true"
        />
        <button
          v-if="!isExpanded"
          type="button"
          class="absolute bottom-12 left-1/2 inline-flex min-h-[47px] -translate-x-1/2 items-center gap-2.5 rounded-full bg-white px-7 text-body text-ink shadow-float transition-colors duration-300 hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          @click="expand"
        >
          Rozwiń
          <IconArrow direction="down" :size="15" />
        </button>
      </div>
    </div>

    <GalleryLightbox :images="visibleImages" :index="lightboxIndex" @close="lightboxIndex = null" />
  </section>
</template>

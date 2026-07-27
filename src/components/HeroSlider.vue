<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from './ui/BaseButton.vue'
import IconArrow from './ui/IconArrow.vue'
import hero1 from '../assets/img/hero.webp'
import hero2 from '../assets/img/hero-2.webp'
import hero3 from '../assets/img/hero-3.webp'

/* The whole section is a slider (Figma note). Text swaps out-in, images
   crossfade in a stacked wrapper so the layout height never jumps. */
const SLIDES = [
  {
    img: hero1,
    alt: 'Geometryczny zielony labirynt ogrodowy',
    title: 'Nowoczesna aranżacja Twojego ogrodu',
    copy: 'Marka GiardDesign to wieloletnie doświadczenie i wysoka estetyka realizacji. Oferujemy kompleksowy zakres usług z indywidualnym podejściem do każdego projektu.',
  },
  {
    img: hero2,
    alt: 'Przydomowy basen otoczony drewnianą pergolą',
    title: 'Przestrzeń, która pracuje dla Ciebie',
    copy: 'Projektujemy ogrody rezydencjonalne i strefy wypoczynku, które łączą architekturę z naturą. Od koncepcji, przez wizualizację, po pełną realizację.',
  },
  {
    img: hero3,
    alt: 'Kamienna ścieżka wśród bujnej zieleni',
    title: 'Ogród, który żyje z Tobą cały rok',
    copy: 'Dobieramy roślinność i materiały tak, aby Twój ogród zachwycał w każdym sezonie — bez godzin spędzonych na pielęgnacji.',
  },
]

const current = ref(0)
const total = SLIDES.length

/* LCP guard: only slide 1 is mounted initially, so its ~250 kB image does not
   compete for bandwidth with the two hidden slides (~600 kB). The rest mount
   once the first image has loaded (or on first slide change). */
const restReady = ref(false)

function go(delta: number) {
  restReady.value = true
  current.value = (current.value + delta + total) % total
}

function onImgError(event: Event) {
  console.error('[hero] image failed to load', (event.target as HTMLImageElement).src)
}

/* Swipe: pointer events cover touch and mouse drag alike. Pointer capture keeps
   the gesture alive when the pointer leaves the container before release. */
const SWIPE_THRESHOLD = 48
let pointerStartX: number | null = null

function onPointerDown(event: PointerEvent) {
  /* Capturing the pointer retargets pointerup to the container, which suppresses
     the click on the arrow buttons — so never capture when the press starts there. */
  if ((event.target as HTMLElement).closest('button')) return
  pointerStartX = event.clientX
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}
function onPointerUp(event: PointerEvent) {
  if (pointerStartX === null) return
  const delta = event.clientX - pointerStartX
  pointerStartX = null
  if (Math.abs(delta) >= SWIPE_THRESHOLD) go(delta < 0 ? 1 : -1)
}
function onPointerCancel() {
  pointerStartX = null
}
</script>

<template>
  <section
    id="hero"
    class="relative overflow-x-clip bg-sand"
    role="region"
    aria-roledescription="karuzela"
    aria-label="Polecane aranżacje"
  >
    <p class="sr-only" aria-live="polite">Slajd {{ current + 1 }} z {{ total }}</p>

    <div class="container-page relative lg:min-h-[737px]">
      <!-- Text column: stays on the grid -->
      <div class="flex flex-col justify-center pb-10 pt-12 lg:min-h-[737px] lg:max-w-[599px] lg:pb-24 lg:pt-[92px]">
        <!-- All three text blocks live stacked in one grid cell, so the section
             is always as tall as the tallest slide — switching slides never
             resizes the layout (crossfade instead of out-in remount). -->
        <div class="grid">
          <div
            v-for="(item, i) in SLIDES"
            :key="item.title"
            class="col-start-1 row-start-1 transition-[opacity,transform] duration-[350ms] ease-out motion-reduce:transition-none"
            :class="i === current ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4'"
            :aria-hidden="i !== current"
          >
            <div class="overflow-hidden">
              <component :is="i === 0 ? 'h1' : 'p'" v-reveal:mask class="font-display text-[36px] font-medium leading-[44px] lg:max-w-[500px] lg:text-hero lg:leading-[70px]">
                {{ item.title }}
              </component>
            </div>
            <!-- Hero copy is the one body text with ls:0 in the design (tracking-normal) -->
            <p v-reveal="100" class="mt-8 max-w-[489px] text-body tracking-normal text-ink/80 lg:mt-11">
              {{ item.copy }}
            </p>
          </div>
        </div>
        <div v-reveal="200" class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center lg:mt-[72px]">
          <BaseButton href="#kontakt" class="w-full sm:w-auto">Skontaktuj się z nami</BaseButton>
          <BaseButton href="#realizacje" variant="outline" class="w-full sm:w-auto">
            Zobacz nasze realizacje
            <IconArrow direction="down" :size="15" />
          </BaseButton>
        </div>
      </div>

      <!-- Image: full-bleed to the right edge of the viewport on desktop,
           full-bleed both sides on mobile -->
      <div
        class="relative -mx-6 aspect-[1376/1474] touch-pan-y sm:aspect-auto sm:h-[420px] lg:absolute lg:inset-y-0 lg:left-[52%] lg:right-[calc((100%-100vw)/2)] lg:mx-0 lg:h-auto lg:aspect-auto"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      >
        <template v-for="(item, i) in SLIDES" :key="item.img">
          <img
            v-if="i === 0 || restReady"
            :src="item.img"
            :alt="i === current ? item.alt : ''"
            width="1376"
            height="1474"
            :fetchpriority="i === 0 ? 'high' : undefined"
            class="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out"
            :class="i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'"
            :aria-hidden="i !== current"
            draggable="false"
            @load="i === 0 && (restReady = true)"
            @error="onImgError"
          />
        </template>

        <!-- Slider controls: white notch pinned to the bottom-right of the image -->
        <div class="absolute bottom-0 right-0 flex bg-white">
          <button
            type="button"
            class="grid h-[72px] w-[72px] place-items-center transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-forest lg:h-[89px] lg:w-[89px]"
            aria-label="Poprzedni slajd"
            @click="go(-1)"
          >
            <IconArrow direction="left" :size="40" />
          </button>
          <button
            type="button"
            class="grid h-[72px] w-[72px] place-items-center transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-forest lg:h-[89px] lg:w-[89px]"
            aria-label="Następny slajd"
            @click="go(1)"
          >
            <IconArrow direction="right" :size="40" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import OfferCard from './OfferCard.vue'
import SectionIntro from './ui/SectionIntro.vue'
import iconPencil from '../assets/icons/icon-pencil.webp'
import iconEye from '../assets/icons/icon-eye.webp'
import iconSparkles from '../assets/icons/icon-sparkles.webp'

const CARDS = [
  {
    id: 'projekty',
    icon: iconPencil,
    title: 'Projekty',
    copy: 'Zaprojektujemy Twój ogród w nowoczesnym stylu i z najlepszym wykorzystaniem istniejącej przestrzeni.',
    linkLabel: 'Dowiedz się więcej',
    href: '#realizacje',
  },
  {
    id: 'wizualizacje',
    icon: iconEye,
    title: 'Wizualizacje',
    copy: 'Przedstawimy Ci projekty koncepcyjne w postaci wirtualnego spaceru animowanego w technologii 3D.',
    linkLabel: 'Dowiedz się więcej',
    href: '#realizacje',
  },
  {
    id: 'realizacje-karta',
    icon: iconSparkles,
    title: 'Realizacje',
    copy: 'Zrealizujemy Twoje marzenie przy użyciu najnowszych rozwiązań i zaawansowanych technologii.',
    linkLabel: 'Zobacz nasze realizacje',
    href: '#realizacje',
  },
]
</script>

<template>
  <section id="oferta" class="scroll-mt-16 bg-cream py-16 lg:pb-40 lg:pt-[120px]">
    <div class="container-page">
      <SectionIntro label="Oferta">
        Działamy <em class="font-sans font-medium italic tracking-normal">kompleksowo</em>
        <template #copy>
          <p v-reveal="100" class="mt-8 max-w-[709px] text-body text-ink">
            Oferujemy kompletną obsługę inwestycji terenów zielonych. Projektujemy nowoczesne
            ogrody przydomowe oraz rezydencjonalne. Stworzymy dla Ciebie projekt, zwizualizujemy
            go i wcielimy w życie, a na każdym etapie posłużymy radą i wieloletnim doświadczeniem.
          </p>
        </template>
      </SectionIntro>

      <div class="mt-12 grid gap-6 md:grid-cols-3 lg:mt-24 lg:auto-rows-[370px] lg:gap-16">
        <div v-for="(card, i) in CARDS" :key="card.id" v-reveal="i * 120">
          <OfferCard v-bind="card" class="h-full" />
        </div>
      </div>
    </div>
  </section>
</template>

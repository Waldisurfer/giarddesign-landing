<script setup lang="ts">
import BaseButton from './ui/BaseButton.vue'
import IconArrow from './ui/IconArrow.vue'
import SectionIntro from './ui/SectionIntro.vue'
import aboutImg from '../assets/img/about.webp'
</script>

<template>
  <!-- Mirror of the hero: photo bleeds to the LEFT edge, panel holds the grid.
       Figma splits the row 688/752 (not 50/50) — the photo shows its full
       688×720 crop 1:1 and the forest panel is the wider half. -->
  <section id="o-firmie" class="grid scroll-mt-16 lg:grid-cols-[688fr_752fr]">
    <img
      :src="aboutImg"
      alt="Ogród japoński z kamienną kompozycją przed drewnianym pawilonem"
      width="1376"
      height="1440"
      loading="lazy"
      class="h-64 w-full object-cover sm:h-80 lg:h-[720px]"
    />
    <!-- Text inset measured from the .fig: content starts at x=848 at 1440,
         i.e. 160px into the panel (panel edge sits at x=688) -->
    <div class="flex items-center bg-forest px-6 py-14 lg:pl-40 lg:pr-[92px] lg:py-[120px]">
      <div class="max-w-[500px]">
        <!-- Per the .fig source only "pasją" is italic — the "z" stays in Montserrat -->
        <SectionIntro label="O firmie" tone="light">
          Tworzymy<br class="hidden lg:inline" />
          z <em class="font-sans font-medium italic tracking-normal">pasją</em>
        </SectionIntro>
        <p v-reveal="100" class="mt-10 max-w-[500px] text-body text-cream">
          Każdy projekt to nowe wyzwanie. Dlatego nasz zespół tworzą wykwalifikowani projektanci
          oraz architekci, których zadaniem jest rozpoznanie i realizacja potrzeb każdego Klienta.
          Nasza specjalizacja to przestrzenie nowoczesne, które charakteryzuje minimalizm,
          geometria i elegancka prostota. Tworzymy ogrody małoobsługowe, dostosowane do
          współczesnego trybu życia.
        </p>
        <div v-reveal="200" class="mt-9">
          <BaseButton href="#realizacje" variant="outline-light">
            Poznaj nas bliżej
            <IconArrow />
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

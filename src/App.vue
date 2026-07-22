<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
</script>

<template>
  <TheHeader />

  <main>
    <!-- Zaślepki sekcji — będą podmieniane na kolejne komponenty. -->
    <section id="hero" class="bg-sand">
      <div class="container-page py-24">
        <h1 class="max-w-[599px] font-display text-hero font-medium">
          Nowoczesna aranżacja Twojego ogrodu
        </h1>
        <p class="mt-11 max-w-[599px] text-body">
          Marka GiardDesign to wieloletnie doświadczenie i wysoka estetyka realizacji.
          Oferujemy kompleksowy zakres usług z indywidualnym podejściem do każdego projektu.
        </p>
      </div>
    </section>

    <section id="oferta" class="bg-cream">
      <div class="container-page py-24">
        <h2 class="font-display text-h2 font-medium">
          Działamy <em class="font-sans font-medium italic">kompleksowo</em>
        </h2>
      </div>
    </section>

    <section id="o-firmie" class="bg-forest text-cream">
      <div class="container-page py-24">
        <h2 class="font-display text-h2 font-medium">
          Tworzymy <em class="font-sans font-medium italic">z pasją</em>
        </h2>
      </div>
    </section>

    <section id="realizacje" class="bg-sand">
      <div class="container-page py-24">
        <h2 class="font-display text-h2 font-medium">
          Nasze <em class="font-sans font-medium italic">projekty</em>
        </h2>
      </div>
    </section>
  </main>

  <footer id="kontakt" class="bg-ink text-cream">
    <div class="container-page py-20">
      <p class="text-small">Stopka — wkrótce.</p>
    </div>
  </footer>
</template>

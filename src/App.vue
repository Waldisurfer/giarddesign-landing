<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import HeroSlider from './components/HeroSlider.vue'
import OfferSection from './components/OfferSection.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsGallery from './components/ProjectsGallery.vue'
import InstagramCta from './components/InstagramCta.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<template>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-6 focus:py-3 focus:text-small focus:text-cream"
  >
    Przejdź do treści głównej
  </a>
  <TheHeader />
  <main id="main-content" tabindex="-1" class="outline-none">
    <HeroSlider />
    <OfferSection />
    <AboutSection />
    <ProjectsGallery />
    <InstagramCta />
  </main>
  <TheFooter />
</template>

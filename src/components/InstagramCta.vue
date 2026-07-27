<script setup lang="ts">
import BaseButton from './ui/BaseButton.vue'
</script>

<template>
  <section class="bg-cream py-16 lg:py-[120px]" aria-labelledby="instagram-cta-heading">
    <div class="container-page">
      <div
        v-reveal
        class="flex flex-col items-start gap-8 bg-forest px-8 py-12 lg:mx-auto lg:max-w-[1040px] lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-16"
      >
        <h2
          id="instagram-cta-heading"
          class="font-display text-[28px] font-normal leading-9 tracking-[-1.4px] text-cream lg:text-cta-lg lg:leading-[48px] lg:tracking-[-2px]"
        >
          Zostańmy w kontakcie!<br />
          <!-- Accent per .fig: Inter 500 italic with +1px tracking; final period back in Montserrat -->
          Znajdziesz nas na <em class="font-sans font-medium italic tracking-[1px]">Instagramie</em>.
        </h2>
        <div class="flex flex-col gap-4">
          <p class="max-w-[160px] text-body text-cream/85">Śledź nasze najnowsze realizacje!</p>
          <BaseButton
            href="https://www.instagram.com/"
            variant="light"
            target="_blank"
            rel="noopener noreferrer"
            class="self-start"
          >
            Instagram
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

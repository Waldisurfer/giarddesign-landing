<script setup lang="ts">
import BaseButton from './ui/BaseButton.vue'
import logoLight from '../assets/icons/logo-giarddesign-light.svg'
import logoAdrespect from '../assets/icons/logo-adrespect.svg'

const FOOTER_LINKS = [
  { label: 'Kontakt', href: 'mailto:giarddesign@kontakt.pl' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
]
</script>

<template>
  <footer id="kontakt" class="scroll-mt-16 bg-ink text-cream">
    <div class="container-page pb-10 pt-14 lg:pb-12 lg:pt-20">
      <div class="lg:mx-auto lg:max-w-[1040px]">
        <!-- Row 1: logo + tagline + CTA -->
        <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <img :src="logoLight" alt="GiardDesign" width="114" height="19" loading="lazy" />
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <p class="text-body text-cream/90">Daj znać, co możemy dla Ciebie zrobić!</p>
            <BaseButton href="mailto:giarddesign@kontakt.pl" class="self-start sm:self-auto">
              Skontaktuj się z nami
            </BaseButton>
          </div>
        </div>

        <hr class="mt-10 border-white/15 lg:mt-12" />

        <!-- Row 2: links + contact details -->
        <div class="mt-8 flex flex-col gap-6 lg:mt-10 lg:flex-row lg:items-center lg:justify-between">
          <ul class="flex flex-wrap gap-x-8 gap-y-3">
            <li v-for="link in FOOTER_LINKS" :key="link.label">
              <a
                :href="link.href"
                class="text-small text-cream/90 transition-colors hover:text-white"
                :target="link.href.startsWith('http') ? '_blank' : undefined"
                :rel="link.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
          <div class="flex flex-col gap-3 sm:flex-row sm:gap-10">
            <a href="tel:000000000" class="text-small text-cream/90 transition-colors hover:text-white">
              000-000-000
            </a>
            <a
              href="mailto:giarddesign@kontakt.pl"
              class="text-small text-cream/90 transition-colors hover:text-white"
            >
              giarddesign@kontakt.pl
            </a>
          </div>
        </div>

        <!-- Row 3: copyright + agency credit (stays — recruitment requirement) -->
        <div class="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:mt-16">
          <p class="text-body text-cream/60">Prawa zastrzeżone © 2022</p>
          <p class="flex items-center gap-2 text-body text-cream/60">
            made by
            <a
              href="https://adrespect.pl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="adRespect — agencja marketingowa"
            >
              <img :src="logoAdrespect" alt="adRespect" width="86" height="22" loading="lazy" />
            </a>
          </p>
        </div>
        <p class="mt-6 text-[12px] leading-relaxed text-white/60">
          Strona wykonana w ramach zadania rekrutacyjnego dla agencji adRespect.pl.
          Projekt graficzny © adRespect.
        </p>
      </div>
    </div>
  </footer>
</template>

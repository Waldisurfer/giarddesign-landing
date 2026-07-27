<script setup lang="ts">
import IconArrow from './ui/IconArrow.vue'

/* Whole card is a link (Figma note: "cards clickable + hover effect").
   Hover: lift + soft shadow + arrow slides right (group). */
defineProps<{
  id: string
  href: string
  icon: string
  title: string
  copy: string
  linkLabel: string
}>()
</script>

<template>
  <a
    :id="id"
    :href="href"
    class="group flex flex-col scroll-mt-24 rounded-card bg-white p-8 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest lg:px-10 lg:py-12"
  >
    <!-- Fixed 44×44 box: icon files have different aspect ratios (eye is 96×58)
         and Tailwind's preflight `height: auto` would otherwise let the icon
         height vary — pushing card titles out of alignment. -->
    <img :src="icon" alt="" width="44" height="44" loading="lazy" class="h-11 w-11 object-contain object-left" />
    <h3 class="mt-7 font-display text-[24px] font-medium leading-7 tracking-[-0.05em] lg:mt-8 lg:text-h3 lg:leading-8">
      {{ title }}
    </h3>
    <p class="mt-3 text-small text-ink/70">{{ copy }}</p>
    <span class="mt-7 inline-flex items-center gap-2 self-start border-b border-forest pb-1 text-body text-forest lg:mt-auto">
      {{ linkLabel }}
      <IconArrow class="transition-transform duration-300 group-hover:translate-x-1.5" />
    </span>
  </a>
</template>

<script setup lang="ts">
/* Repeating section opener: small green label + H2 with an italic accent
   (accent goes into the default slot as <em class="font-sans font-medium italic">).
   The heading is wrapped in an overflow-hidden mask for the reveal animation. */
withDefaults(
  defineProps<{
    label: string
    tone?: 'dark' | 'light'
  }>(),
  { tone: 'dark' },
)
</script>

<template>
  <div>
    <p
      v-reveal
      class="text-label"
      :class="tone === 'dark' ? 'text-forest' : 'text-cream'"
    >
      {{ label }}
    </p>
    <div class="mt-4 overflow-hidden">
      <h2
        v-reveal:mask
        class="font-display text-[32px] font-medium leading-10 lg:text-h2 lg:leading-[55px]"
        :class="tone === 'light' ? 'text-cream' : 'text-ink'"
      >
        <slot />
      </h2>
    </div>
    <slot name="copy" />
  </div>
</template>

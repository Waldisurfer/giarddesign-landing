<script setup lang="ts">
/* Pill button used across the whole page. Renders <a> when href is given,
   <button> otherwise, so semantics follow usage. */
type Variant = 'solid' | 'outline' | 'outline-light' | 'light'

withDefaults(
  defineProps<{
    href?: string
    variant?: Variant
  }>(),
  { href: undefined, variant: 'solid' },
)

const VARIANT_CLASSES: Record<Variant, string> = {
  solid: 'bg-forest text-cream hover:bg-forest-dark',
  outline: 'border border-forest text-forest hover:bg-forest/5',
  'outline-light': 'border border-cream text-cream hover:bg-white/10',
  light: 'bg-white text-ink hover:bg-cream',
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : 'button'"
    class="inline-flex min-h-[47px] items-center justify-center gap-2.5 rounded-full px-7 text-body transition-[background-color,border-color,transform] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
    :class="VARIANT_CLASSES[variant]"
  >
    <slot />
  </component>
</template>

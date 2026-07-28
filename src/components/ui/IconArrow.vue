<script setup lang="ts">
/* Single source for the arrow glyphs. Two variants matching the two Figma assets:
   - 'ui'     → icon-arrow-btn.svg: a 16×16 glyph that FILLS its box (buttons,
                card links, the gallery expand pill). Drawn pointing DOWN.
   - 'slider' → slider-arrow-a/b.svg: a 48×48 glyph whose artwork spans ~53%
                of the box (hero slider notch, lightbox). Drawn pointing RIGHT.
   Both inherit color via currentColor. */
withDefaults(
  defineProps<{
    direction?: 'right' | 'left' | 'down'
    size?: number
    variant?: 'ui' | 'slider'
  }>(),
  { direction: 'right', size: 16, variant: 'ui' },
)

/* Base orientation differs per variant, so rotations do too. */
const ROTATION: Record<'ui' | 'slider', Record<'right' | 'left' | 'down', string>> = {
  ui: { down: '', right: 'rotate(-90deg)', left: 'rotate(90deg)' },
  slider: { right: '', left: 'rotate(180deg)', down: 'rotate(90deg)' },
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="variant === 'ui' ? '0 0 16 16' : '0 0 48 48'"
    fill="none"
    aria-hidden="true"
    :style="ROTATION[variant][direction] ? { transform: ROTATION[variant][direction] } : undefined"
  >
    <path
      v-if="variant === 'ui'"
      d="M16 7.99529L15.1043 7.09959L8.63642 13.5769L8.63642 1.02988e-07L7.36358 8.78099e-08L7.36358 13.5675L0.895699 7.09959L9.54553e-08 7.99529L8.00471 16L16 7.99529Z"
      fill="currentColor"
    />
    <path
      v-else
      d="M37.2049 25.0607C37.7907 24.4749 37.7907 23.5251 37.2049 22.9393L27.6589 13.3934C27.0732 12.8076 26.1234 12.8076 25.5376 13.3934C24.9518 13.9792 24.9518 14.9289 25.5376 15.5147L34.0229 24L25.5376 32.4853C24.9518 33.0711 24.9518 34.0208 25.5376 34.6066C26.1234 35.1924 27.0732 35.1924 27.6589 34.6066L37.2049 25.0607ZM11.8558 25.5H36.1442V22.5H11.8558V25.5Z"
      fill="currentColor"
    />
  </svg>
</template>

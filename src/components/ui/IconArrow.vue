<script setup lang="ts">
/* Single source for the arrow glyph used across buttons, cards and the
   slider/lightbox controls. Inherits color via currentColor. */
withDefaults(
  defineProps<{
    direction?: 'right' | 'left' | 'down'
    size?: number
  }>(),
  { direction: 'right', size: 16 },
)

const ROTATION: Record<'right' | 'left' | 'down', string> = {
  right: '',
  left: 'rotate(180deg)',
  down: 'rotate(90deg)',
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden="true"
    :style="ROTATION[direction] ? { transform: ROTATION[direction] } : undefined"
  >
    <path
      d="M37.2049 25.0607C37.7907 24.4749 37.7907 23.5251 37.2049 22.9393L27.6589 13.3934C27.0732 12.8076 26.1234 12.8076 25.5376 13.3934C24.9518 13.9792 24.9518 14.9289 25.5376 15.5147L34.0229 24L25.5376 32.4853C24.9518 33.0711 24.9518 34.0208 25.5376 34.6066C26.1234 35.1924 27.0732 35.1924 27.6589 34.6066L37.2049 25.0607ZM11.8558 25.5H36.1442V22.5H11.8558V25.5Z"
      fill="currentColor"
    />
  </svg>
</template>

import { createApp } from 'vue'

// Fonts (self-hosted via Fontsource) — only the variants used in the Figma design:
// Montserrat 500 (headings) + 400 (Instagram panel),
// Inter 400 (body/UI) + 500 italic (heading accents)
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500-italic.css'

import './style.css'
import App from './App.vue'
import { vReveal } from './directives/reveal'

createApp(App).directive('reveal', vReveal).mount('#app')

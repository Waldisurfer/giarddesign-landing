import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/* Injects <link rel="preload"> for the hero LCP image into the built HTML.
   In a CSR SPA the hero image URL is otherwise only discoverable after the JS
   bundle executes and Vue renders — a fully serial chain. The preload hint lets
   the browser fetch it in parallel with the bundle (~300-600ms LCP win on slow
   connections). The asset name is hashed, hence a build-time plugin. */
function preloadHeroImage(): Plugin {
  return {
    name: 'preload-hero-image',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const heroAsset = Object.keys(ctx.bundle).find((file) =>
          /assets\/hero-(?!2-|3-)[\w-]+\.webp$/.test(file),
        )
        if (!heroAsset) return html
        return {
          html,
          tags: [
            {
              tag: 'link',
              attrs: { rel: 'preload', as: 'image', href: `/${heroAsset}`, fetchpriority: 'high' },
              injectTo: 'head',
            },
          ],
        }
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), preloadHeroImage()],
})

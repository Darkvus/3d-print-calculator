import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'printimator.svg', 'apple-touch-icon.png', 'og-image.png'],
      manifest: {
        name: 'Printimator',
        short_name: 'Printimator',
        description: 'Calcula el costo real de tus impresiones 3D',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0f172a',
        theme_color: '#4f46e5',
        lang: 'es',
        icons: [
          { src: '/icon-72.png',           sizes: '72x72',    type: 'image/png' },
          { src: '/icon-96.png',           sizes: '96x96',    type: 'image/png' },
          { src: '/icon-128.png',          sizes: '128x128',  type: 'image/png' },
          { src: '/icon-144.png',          sizes: '144x144',  type: 'image/png' },
          { src: '/icon-152.png',          sizes: '152x152',  type: 'image/png' },
          { src: '/icon-192.png',          sizes: '192x192',  type: 'image/png' },
          { src: '/icon-384.png',          sizes: '384x384',  type: 'image/png' },
          { src: '/icon-512.png',          sizes: '512x512',  type: 'image/png', purpose: 'any' },
          { src: '/icon-512-maskable.png', sizes: '512x512',  type: 'image/png', purpose: 'maskable' },
          // SVG para navegadores modernos (Chrome 93+, Edge, Firefox)
          { src: '/printimator.svg',       sizes: 'any',      type: 'image/svg+xml', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\./,
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
})

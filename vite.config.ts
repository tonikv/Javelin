import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'maskable-icon-512x512.png'
      ],
      manifest: {
        id: 'fi.selain.games2026.javelin',
        name: 'Selain Games 2026 - Keihäänheitto',
        short_name: 'Keihäänheitto',
        description: 'Selain Games 2026 - Keihäänheitto',
        lang: 'fi',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        orientation: 'portrait',
        background_color: '#0f1a24',
        theme_color: '#0f1a24',
        categories: ['games', 'sports'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,json}']
      }
    })
  ],
  base: process.env.GITHUB_ACTIONS ? '/Javelin/' : '/',
  test: {
    environment: 'node'
  }
});

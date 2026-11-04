/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works from any sub-path (e.g. GitHub Pages); routing uses HashRouter.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32x32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Super Calculator',
        short_name: 'SuperCalc',
        description: 'Multi-functional calculator: currency, units, finance, health and more.',
        lang: 'zh-TW',
        start_url: './',
        scope: './',
        display: 'standalone',
        theme_color: '#1c1c1e',
        background_color: '#1c1c1e',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Serve cached exchange rates when offline; refresh in the background when online.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/open\.er-api\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'exchange-rates',
              expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
        ],
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**/*.ts', 'src/services/**/*.ts', 'src/i18n/languages.ts'],
      exclude: ['**/*.test.ts'],
      reporter: ['text', 'html'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
})

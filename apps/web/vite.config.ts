import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'InfoSys · Gestão de Serviços Técnicos',
        short_name: 'InfoSys',
        description:
          'Gestão para prestadores de serviço: agenda, clientes, orçamentos, histórico e avisos de manutenção recorrente.',
        lang: 'pt-BR',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      // ADR-0009 (RF-PLT-001): Somente leitura em cache (stale-while-revalidate para dados do dia).
      // Usa matcher por função (e não RegExp) para funcionar tanto same-origin (dev) quanto cross-origin
      // entre app.seudominio.com e api.seudominio.com em produção (ADR-0004).
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ url, request }) =>
              request.method === 'GET' &&
              /^\/v1\/(appointments|customers|maintenance|quotes|catalog)(\/|$)/.test(url.pathname),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'infosys-api-read-cache',
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24, // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@app': path.resolve(import.meta.dirname, './src/app'),
      '@features': path.resolve(import.meta.dirname, './src/features'),
      '@shared': path.resolve(import.meta.dirname, './src/shared'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', 'src/**/*.d.ts'],
    },
  },
});

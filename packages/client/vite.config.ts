import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: Number(process.env.CLIENT_PORT) || 3000,
  },
  define: {
    __EXTERNAL_SERVER_URL__: JSON.stringify(process.env.EXTERNAL_SERVER_URL),
    __INTERNAL_SERVER_URL__: JSON.stringify(process.env.INTERNAL_SERVER_URL),
  },
  build: {
    outDir: path.join(__dirname, 'dist/client'),
  },
  ssr: {
    format: 'cjs',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'styled-components',
            {
              displayName: true,
              fileName: true,
              ssr: true,
              pure: true,
            },
          ],
        ],
        babelrc: false,
        configFile: false,
      },
    }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      manifest: {
        name: 'Space Invaders',
        short_name: 'SpaceInvaders',
        start_url: '/',
        display: 'standalone',
        background_color: '#0b1020',
        theme_color: '#1d4ed8',
      },
      injectManifest: {
        swSrc: path.join(__dirname, 'src', 'sw.ts'),
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webp,ttf,woff,woff2,json}',
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})

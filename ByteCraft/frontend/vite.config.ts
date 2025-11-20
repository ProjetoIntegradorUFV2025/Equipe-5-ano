/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // IMPORTANTE: barra NO COMEÇO e barra NO FINAL
  base: '/bytecraft/',

  server: {
    port: 3030,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  test: {
    globals: true,
    environment: 'node',
    include: ['src/tests/**/*.test.ts', 'tests/**/*.test.ts'],
  },

  build: {
    outDir: '../backend/src/main/resources/static',
    emptyOutDir: true,
  },
})

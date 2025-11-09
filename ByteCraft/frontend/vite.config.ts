/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3030, // Mantém na 8081 (conforme configurado no Spring Security)
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend Spring Boot na 8080
        changeOrigin: true,
        secure: false,
      }
    }
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/tests/**/*.test.ts', 'tests/**/*.test.ts'],
  }
})
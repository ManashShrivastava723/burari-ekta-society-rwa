import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Enable SPA fallback for all routes during development
    // This fixes the refresh issue on pages like /contact, /admin, etc.
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})

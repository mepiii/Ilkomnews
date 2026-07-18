import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ['e2e/**', '**/node_modules/**'],
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Use 127.0.0.1 (IPv4) — `php artisan serve` binds IPv4 only, and
      // `localhost` can resolve to ::1 (IPv6) and get ECONNREFUSED.
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/sanctum': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      // Storage proxy: lets the SPA at :5173 load /storage/* (uploaded
      // images, project thumbnails, news author avatars) through the
      // backend in dev. Without this, relative /storage/foo.png 404s on
      // the Vite dev server and the same-origin absolute URL from
      // asset() hits CORS/CSP. In prod the SPA is served from :8000 so
      // this proxy is a no-op (Vite dev only).
      '/storage': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Guarantee a single React instance across all chunks (prevents null dispatcher)
    dedupe: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
  },
  build: {
    outDir: '../backend/public',
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react-router/') ||
            id.includes('/node_modules/react-router-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor'
          }
          if (id.includes('/node_modules/framer-motion/')) {
            return 'motion'
          }
          if (
            id.includes('/node_modules/lucide-react/') ||
            id.includes('/node_modules/react-icons/')
          ) {
            return 'icons'
          }
        },
      },
    },
    target: 'es2020',
  },
  optimizeDeps: {
    include: [
      'react',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'lucide-react',
      'framer-motion',
    ],
  },
})

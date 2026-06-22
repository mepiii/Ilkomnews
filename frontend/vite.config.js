import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    outDir: '../backend/public',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion'
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/react-icons')) {
            return 'icons'
          }
        }
      }
    },
    target: 'es2020'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'framer-motion'],
  }
})

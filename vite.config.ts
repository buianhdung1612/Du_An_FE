import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@admin': path.resolve(__dirname, './src/admin'),
      '@shared': path.resolve(__dirname, './src/admin/shared'),
      '@core': path.resolve(__dirname, './src/admin/shared'),
      '@assets': path.resolve(__dirname, './src/admin/assets'),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    },
    host: true,
    allowedHosts: [
      'hyperdolichocephalic-aerodynamic-ashlee.ngrok-free.dev',
      '.ngrok-free.dev'
    ]
  }
})

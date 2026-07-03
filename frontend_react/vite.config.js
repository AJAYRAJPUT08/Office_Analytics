import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react]
})
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/video': 'http://localhost:5000',
      '/camera_status': 'http://localhost:5000',
      '/photo': 'http://localhost:5000',
      '/unknown_photo': 'http://localhost:5000',
    },
  },
})

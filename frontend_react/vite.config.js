import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// AI Office Analytics — React dashboard
// Builds into ../frontend, which the Flask backend (backend/app.py)
// serves as static files. In dev mode, API/video/photo requests are
// proxied to the Flask backend running on :5000 so `npm run dev`
// works against the real backend without any CORS setup.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../frontend',
    emptyOutDir: true,
  },
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

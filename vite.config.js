import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxy API requests to the backend during development
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  build: {
    // put the production build in the backend's public folder so
    // Express can serve the frontend and API from a single server
    outDir: path.resolve(__dirname, 'backend', 'public')
  }
})

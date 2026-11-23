import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dotenv from 'dotenv'

// Read the API port from server/.env so the dev proxy always points at the running server.
dotenv.config({ path: path.resolve(__dirname, '../server/.env') })
const apiPort = process.env.PORT || 3000

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../server/public',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      'picocss': path.resolve(__dirname, '../node_modules/@picocss/pico/css')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${apiPort}`
      }
    }
  }
})

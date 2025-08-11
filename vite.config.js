import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist'
  },
  server: {
    historyApiFallback: true // SPA routing in dev
  },
  preview: {
    historyApiFallback: true // SPA routing in `vite preview`
  }
})

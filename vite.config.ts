import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` must match the GitHub Pages project path: https://<user>.github.io/3d-designer/
export default defineConfig({
  base: '/3d-designer/',
  plugins: [react()],
  server: {
    host: true,
    open: true,
  },
})

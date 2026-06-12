import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base relatif './' -> fonctionne sur GitHub Pages (sous-chemin /repo/), Cloudflare Pages (racine) et en local.
export default defineConfig({
  base: './',
  plugins: [react()],
})

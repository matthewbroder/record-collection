import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative assets work for both custom domains and /repository-name/ Pages URLs.
  base: './',
})

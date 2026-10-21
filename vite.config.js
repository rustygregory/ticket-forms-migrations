import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local calendar date so a late-evening build doesn't roll into tomorrow in UTC.
const now = new Date()
const buildDate = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-')

export default defineConfig({
  plugins: [react()],
  define: { __BUILD_DATE__: JSON.stringify(buildDate) },
})

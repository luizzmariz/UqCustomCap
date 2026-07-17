import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project page on GitHub Pages -> served under /UqCustomCap/.
// All asset/model URLs must be built with import.meta.env.BASE_URL so they
// resolve to '/UqCustomCap/' in production and '/' during local dev.
// If a dedicated *.github.io repo is used later, change `base` to '/'.
// https://vite.dev/config/
export default defineConfig({
  base: '/UqCustomCap/',
  plugins: [react()],
});

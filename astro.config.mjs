import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  alias: {
    "@": fileURLToPath(new URL('./src', import.meta.url))
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
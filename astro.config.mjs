// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Enrutamiento i18n nativo de Astro.
  // 'en' es el idioma por defecto y vive en la raíz ("/").
  // 'es' vive bajo "/es/". prefixDefaultLocale: false = el inglés NO lleva "/en/".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});

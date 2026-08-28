// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Dominio de producción. Necesario para construir URLs absolutas
  // (las usa /llms.txt) y para que Astro genere metadatos correctos.
  site: 'https://rubensalas.dev',

  // El español pasó a vivir en la raíz, así que "/es/" (la ruta antigua,
  // que pudo quedar enlazada por ahí) redirige en vez de dar 404.
  redirects: {
    '/es/': '/',
  },

  // Enrutamiento i18n nativo de Astro.
  // 'es' es el idioma por defecto y vive en la raíz ("/").
  // 'en' vive bajo "/en/". prefixDefaultLocale: false = el español NO lleva "/es/".
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});

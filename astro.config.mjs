// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Dominio de producción. OJO: va CON "www" — el apex redirige a www, así
  // que ese es el host canónico real. Todo lo que Astro construye a partir
  // de aquí (canonical, hreflang, sitemap, og:url, /llms.txt) hereda este
  // valor, de modo que un host equivocado se propaga a todo el sitio.
  site: 'https://www.rubensalas.dev',

  // Genera /sitemap-index.xml declarando las dos locales y sus alternates.
  // La integración lee el bloque `i18n` de abajo, así que no hay que
  // repetir aquí la lista de idiomas cuando cambie.
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es', en: 'en' },
      },
    }),
  ],

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

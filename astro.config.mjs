// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { youtube } from './src/plugins/youtube.mjs';

// https://astro.build/config
export default defineConfig({
  // Dominio de producción. OJO: va CON "www" — el apex redirige a www, así
  // que ese es el host canónico real. Todo lo que Astro construye a partir
  // de aquí (canonical, hreflang, sitemap, og:url, /llms.txt) hereda este
  // valor, de modo que un host equivocado se propaga a todo el sitio.
  site: 'https://www.rubensalas.dev',

  // Genera /sitemap-index.xml declarando las dos locales y sus alternates.
  // La integración no lee el bloque `i18n` de abajo: repite aquí los
  // idiomas, así que si cambian hay que tocar los dos bloques.
  integrations: [
    sitemap({
      // La versión en inglés de cada artículo no entra: es el mismo texto
      // que la española y su canonical apunta a ella (ver Article.astro).
      filter: (page) => !/\/en\/articles\/[^/]+\/$/.test(page),
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es', en: 'en' },
      },
    }),
  ],

  markdown: {
    // Un enlace de YouTube solo en su párrafo pasa a ser una portada.
    processor: satteri({ hastPlugins: [youtube] }),
    // Bloques de código de los artículos con un tema claro y otro oscuro.
    // Sin `defaultColor: false`, Shiki fija los colores de uno solo y en el
    // otro modo el código no se lee; global.css elige el del tema activo.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },

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
});

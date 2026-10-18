// @ts-check
import { defineConfig } from 'astro/config';

import { existsSync, readFileSync } from 'node:fs';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { youtube } from './src/plugins/youtube.mjs';

// La integración del sitemap solo recibe URLs, no los artículos: para
// saber si una página de artículo es de respaldo, mira si existe el archivo
// de su idioma y si su frontmatter lo marca como borrador. Repite a mano la
// regla de src/data/articles.ts; si cambia el formato, cambia los dos.
function hasPublishedVersion(slug, lang) {
  const file = new URL(`./src/content/articles/${slug}/${lang}.md`, import.meta.url);
  if (!existsSync(file)) return false;
  const frontmatter = readFileSync(file, 'utf8').split(/^---$/m)[1] ?? '';
  return !/^draft:\s*true\s*$/m.test(frontmatter);
}

// https://astro.build/config
export default defineConfig({
  // Dominio de producción. OJO: va SIN "www" — en Vercel, www redirige al
  // apex, y el apex tiene que servir directo para que `curl` reciba la
  // versión de terminal sin seguir redirecciones (ver vercel.json). Todo lo
  // que Astro construye a partir de aquí (canonical, hreflang, sitemap,
  // og:url, /llms.txt) hereda este valor, de modo que un host equivocado se
  // propaga a todo el sitio.
  site: 'https://rubensalas.dev',

  // Genera /sitemap-index.xml declarando las dos locales y sus alternates.
  // La integración no lee el bloque `i18n` de abajo: repite aquí los
  // idiomas, así que si cambian hay que tocar los dos bloques.
  integrations: [
    sitemap({
      // Las versiones de respaldo de los artículos no entran: repiten el
      // texto del otro idioma y su canonical apunta a él (ver Article.astro).
      filter: (page) => {
        const match = new URL(page).pathname.match(/^\/(articulos|en\/articles)\/([^/]+)\/$/);
        if (!match) return true;
        return hasPublishedVersion(match[2], match[1] === 'articulos' ? 'es' : 'en');
      },
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

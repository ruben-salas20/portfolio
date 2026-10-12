/**
 * Utilidades de los artículos, compartidas por sus páginas, el RSS y
 * /llms.txt. Los artículos se escriben solo en español, pero se publican
 * en las dos rutas: en /en/ cambian los menús y sale un aviso del idioma.
 */
import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/ui';

/** Ruta de la lista de artículos en cada idioma. */
export const articlesPath: Record<Lang, string> = {
  es: '/articulos/',
  en: '/en/articles/',
};

export function articleHref(lang: Lang, id: string) {
  return `${articlesPath[lang]}${id}/`;
}

/**
 * Todos los artículos, del más reciente al más antiguo. Los borradores solo
 * salen en desarrollo; como todo pasa por aquí, el build no los publica en
 * ningún sitio (páginas, RSS, /llms.txt).
 */
export async function getArticles() {
  const articles = await getCollection(
    'articles',
    (article) => import.meta.env.DEV || !article.data.draft,
  );
  return articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// La fecha del frontmatter no lleva hora y se lee como medianoche UTC; sin
// `timeZone: 'UTC'`, en Colombia se mostraría el día anterior.
export function formatDate(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-CO' : 'en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(date);
}

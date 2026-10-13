/**
 * Utilidades de los artículos, compartidas por sus páginas, el RSS y
 * /llms.txt.
 *
 * Cada artículo es una carpeta con un archivo por idioma: es.md, en.md o los
 * dos. Se publica en las dos rutas. Si falta el idioma de la página, sale
 * el otro con un aviso: una **versión de respaldo**.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

/** Ruta de la lista de artículos en cada idioma. */
export const articlesPath: Record<Lang, string> = {
  es: '/articulos/',
  en: '/en/articles/',
};

/** Ruta del RSS de cada idioma. */
export const feedPath: Record<Lang, string> = {
  es: '/rss.xml',
  en: '/en/rss.xml',
};

export function articleHref(lang: Lang, slug: string) {
  return `${articlesPath[lang]}${slug}/`;
}

/** Un artículo tal como se muestra en una de las dos rutas. */
export interface ArticleView {
  slug: string;
  /** La versión que se muestra: la del idioma de la página o, si falta, la otra. */
  entry: CollectionEntry<'articles'>;
  /** Idioma del texto mostrado; distinto del de la página en un respaldo. */
  lang: Lang;
  /** Si existen las dos versiones, las dos páginas son traducciones reales. */
  bilingual: boolean;
}

/**
 * Los artículos para la ruta de un idioma, del más reciente al más antiguo.
 * Los borradores solo salen en desarrollo, y cada versión cuenta por su
 * cuenta: con es.md publicado y en.md en borrador, /en/ muestra el español.
 * Como todo pasa por aquí, el build no publica un borrador en ningún sitio.
 */
export async function getArticles(lang: Lang): Promise<ArticleView[]> {
  const entries = await getCollection(
    'articles',
    (entry) => import.meta.env.DEV || !entry.data.draft,
  );

  // El id es "<carpeta>/<idioma>" (ver content.config.ts).
  const bySlug = new Map<string, Partial<Record<Lang, CollectionEntry<'articles'>>>>();
  for (const entry of entries) {
    const [slug, entryLang] = entry.id.split('/') as [string, Lang];
    bySlug.set(slug, { ...bySlug.get(slug), [entryLang]: entry });
  }

  const other: Lang = lang === 'es' ? 'en' : 'es';
  return [...bySlug].map(([slug, versions]) => {
    const shown: Lang = versions[lang] ? lang : other;
    return {
      slug,
      entry: versions[shown]!,
      lang: shown,
      bilingual: Boolean(versions.es && versions.en),
    };
  }).sort((a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime());
}

// La fecha del frontmatter no lleva hora y se lee como medianoche UTC; sin
// `timeZone: 'UTC'`, en Colombia se mostraría el día anterior.
export function formatDate(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-CO' : 'en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(date);
}

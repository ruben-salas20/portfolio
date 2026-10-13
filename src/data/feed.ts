/**
 * RSS de los artículos, uno por idioma: /rss.xml y /en/rss.xml. Cada uno
 * lleva todos los artículos, cada uno en su idioma si existe, igual que la
 * lista de esa ruta. Así quien sigue un feed lee lo mismo que en la web.
 */
import rss from '@astrojs/rss';
import { t, type Lang } from '../i18n/ui';
import { getArticles, articleHref } from './articles';

export async function articlesFeed(lang: Lang, site: URL) {
  const tr = t(lang);
  const articles = await getArticles(lang);

  return rss({
    title: `${tr.articles.title} — Rubén Salas`,
    description: tr.articles.description,
    site,
    customData: `<language>${lang}</language>`,
    items: articles.map((article) => ({
      title: article.entry.data.title,
      description: article.entry.data.description,
      pubDate: article.entry.data.date,
      link: articleHref(lang, article.slug),
    })),
  });
}

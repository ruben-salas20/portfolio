/**
 * /rss.xml — feed de los artículos, para leerlos desde un lector de RSS.
 * Va en español, como los artículos, y enlaza a sus URLs en español.
 */
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { t } from '../i18n/ui';
import { getArticles, articleHref } from '../data/articles';

export const GET: APIRoute = async ({ site }) => {
  const tr = t('es');
  const articles = await getArticles();

  return rss({
    title: `${tr.articles.title} — Rubén Salas`,
    description: tr.articles.description,
    site: site!,
    customData: '<language>es</language>',
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.date,
      link: articleHref('es', article.id),
    })),
  });
};

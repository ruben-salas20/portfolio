/**
 * /llms.txt — resumen del sitio en texto plano para modelos de lenguaje.
 * Formato: https://llmstxt.org
 *
 * Se genera a partir de las MISMAS fuentes que la página (i18n/ui.ts,
 * data/projects.ts, data/skills.ts) para que no se desincronice: si añades
 * un proyecto o cambias un texto, este archivo se actualiza solo.
 *
 * Va en inglés por convención del formato, pero enlaza las dos versiones.
 *
 * Toda URL va como enlace Markdown `[texto](url)`, nunca suelta: el formato
 * lo pide así, y la auditoría de Lighthouse falla ("File does not appear to
 * contain any links") si no encuentra ni un enlace con esa sintaxis.
 */
import type { APIRoute } from 'astro';
import { t, contactInfo } from '../i18n/ui';
import { forLang, projects, showAuthorship } from '../data/projects';
import { skills } from '../data/skills';
import { getArticles, articleHref, articlesPath, feedPath } from '../data/articles';

export const GET: APIRoute = async ({ site }) => {
  const tr = t('en');
  const base = (site ?? new URL('https://rubensalas.dev')).origin;

  // Fecha de compilación. Sin esto, afirmaciones con caducidad como
  // "2nd semester" se leen como vigentes para siempre.
  const lastUpdated = new Date().toISOString().slice(0, 7);

  // Un proyecto puede tener repo público, sitio en vivo, ambos o ninguno.
  const projectLines = projects.map((project) => {
    const repo = forLang(project.repo, 'en');
    const links: string[] = [
      repo ? `[Repository](${contactInfo.github}/${repo})` : 'Repository: private',
    ];
    if (project.live) links.push(`[Live site](${project.live})`);
    const authorship = project.writtenByMe ? tr.work.writtenByMe : tr.work.aiDirected;
    const details = showAuthorship ? `${project.year}, ${authorship}` : project.year;

    return [
      `### ${forLang(project.name, 'en')} (${details})`,
      '',
      project.desc.en,
      '',
      `- Stack: ${project.stack.join(', ')}`,
      `- ${links.join('\n- ')}`,
    ].join('\n');
  });

  // Los dos puntos del lead ("Log:") van fuera del enlace, no dentro.
  const nowLines = tr.now.items.map((item) =>
    'href' in item
      ? `- [${item.lead.replace(/:$/, '')}](${item.href}):${item.text}`
      : `- ${item.lead}${item.text}`,
  );

  // Solo los 3 más recientes: el resto está en la lista y en el RSS. Cada
  // uno enlaza a su versión original: la de respaldo solo repite el texto.
  const articles = await getArticles('en');
  const articleLines = articles.slice(0, 3).map((article) => {
    const { title, description, date } = article.entry.data;
    const spanish = article.lang === 'es' ? ' (in Spanish)' : '';
    return `- [${title}](${base}${articleHref(article.lang, article.slug)})${spanish} (${date.toISOString().slice(0, 10)}): ${description}`;
  });
  const articlesSection = articles.length
    ? `## Articles

Latest ${articleLines.length} of ${articles.length}. Some are only in Spanish. The [full list](${base}${articlesPath.en}) and the RSS feeds ([English](${base}${feedPath.en}), [Spanish](${base}${feedPath.es})) have all of them.

${articleLines.join('\n')}

`
    : '';

  const body = `# Rubén Salas

> ${tr.about.intro}

_Last updated: ${lastUpdated}. Time-sensitive claims below (such as the
current stage of his degree) are accurate as of that date._

This site is available in [Spanish](${base}/) (default) and [English](${base}/en/).

## How I work

${tr.about.howIWork}

## Now

${nowLines.join('\n')}

## Projects

${showAuthorship ? `Each project is labelled "${tr.work.writtenByMe}" or "${tr.work.aiDirected}".\n\n` : ''}${projectLines.join('\n\n')}

## Technologies

- ${tr.skills.use}: ${skills.use.join(', ')}
- ${tr.skills.learning}: ${skills.learning.en.join(', ')}

${articlesSection}## Contact

- [Email](mailto:${contactInfo.email}): ${contactInfo.email}
- [GitHub](${contactInfo.github})
- [LinkedIn](${contactInfo.linkedin})
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

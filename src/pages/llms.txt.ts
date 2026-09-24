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
import { projects } from '../data/projects';
import { skills } from '../data/skills';

export const GET: APIRoute = ({ site }) => {
  const tr = t('en');
  const base = (site ?? new URL('https://www.rubensalas.dev')).origin;

  // Fecha de compilación. Sin esto, afirmaciones con caducidad como
  // "2nd semester" se leen como vigentes para siempre.
  const lastUpdated = new Date().toISOString().slice(0, 7);

  // Un proyecto puede tener repo público, sitio en vivo, ambos o ninguno.
  const projectLines = projects.map((project) => {
    const links: string[] = [
      project.repo
        ? `[Repository](${contactInfo.github}/${project.repo})`
        : 'Repository: private',
    ];
    if (project.live) links.push(`[Live site](${project.live})`);
    const authorship = project.writtenByMe ? tr.work.writtenByMe : tr.work.aiDirected;

    return [
      `### ${project.name} (${project.year}, ${authorship})`,
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

Each project is labelled "${tr.work.writtenByMe}" or "${tr.work.aiDirected}".

${projectLines.join('\n\n')}

## Technologies

- ${tr.skills.use}: ${skills.use.join(', ')}
- ${tr.skills.learning}: ${skills.learning.en.join(', ')}

## Contact

- [Email](mailto:${contactInfo.email}): ${contactInfo.email}
- [GitHub](${contactInfo.github})
- [LinkedIn](${contactInfo.linkedin})
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

/**
 * /llms.txt — resumen del sitio en texto plano para modelos de lenguaje.
 * Formato: https://llmstxt.org
 *
 * Se genera a partir de las MISMAS fuentes que la página (i18n/ui.ts,
 * data/projects.ts, data/skills.ts) para que no se desincronice: si añades
 * un proyecto o cambias un texto, este archivo se actualiza solo.
 *
 * Va en inglés por convención del formato, pero enlaza las dos versiones.
 */
import type { APIRoute } from 'astro';
import { t, contactInfo } from '../i18n/ui';
import { projects } from '../data/projects';
import { skillGroups } from '../data/skills';

const GITHUB_USER = 'ruben-salas20';

export const GET: APIRoute = ({ site }) => {
  const tr = t('en');
  const base = (site ?? new URL('https://www.rubensalas.dev')).origin;

  // Fecha de compilación. Sin esto, afirmaciones con caducidad como
  // "estudiante de segundo semestre" se leen como vigentes para siempre.
  const lastUpdated = new Date().toISOString().slice(0, 7);

  // Un proyecto puede tener repo público, sitio en vivo, ambos o ninguno.
  const projectLines = projects.map((project) => {
    const links: string[] = [];
    if (project.repo) {
      links.push(`repo: https://github.com/${GITHUB_USER}/${project.repo}`);
    } else {
      links.push('repo: private');
    }
    if (project.live) links.push(`site: ${project.live}`);

    return [
      `### ${project.name} (${project.year})`,
      '',
      project.desc.en,
      '',
      `- Stack: ${project.stack.join(', ')}`,
      `- ${links.join('\n- ')}`,
    ].join('\n');
  });

  const skillLines = skillGroups.map(
    (group) => `- **${group.label.en}**: ${group.items.join(', ')}`,
  );

  const body = `# Rubén Salas

> ${tr.hero.headline}

_Last updated: ${lastUpdated}. Time-sensitive claims below (such as the
current stage of his degree) are accurate as of that date._

${tr.hero.lead}

Based in Armenia, Colombia. This site is available in Spanish at ${base}/ (default)
and in English at ${base}/en/.

## About

${tr.about.p1}

${tr.about.p2}

${tr.about.p3}

## Skills

${skillLines.join('\n')}

## Projects

${tr.work.lead}

Note on how these were built: ${tr.work.aiNote}

${projectLines.join('\n\n')}

## Contact

- Email: ${contactInfo.email}
- GitHub: ${contactInfo.github}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

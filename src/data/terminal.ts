/**
 * La portada en texto para la terminal: lo que recibe `curl https://rubensalas.dev`.
 * vercel.json reescribe "/" y "/en/" a /index.txt y /en/index.txt cuando la
 * petición viene de curl, Wget, HTTPie o xh; un navegador sigue viendo el HTML.
 * Va con `routes` y no con `rewrites`: Vercel aplica los rewrites solo si no
 * hay un archivo en esa ruta, y en "/" siempre está index.html.
 *
 * Sale de las mismas fuentes que la página, igual que /llms.txt, para que no
 * se desincronice. Los colores son códigos ANSI: la terminal los pinta y un
 * navegador que abra el .txt los muestra como basura, por eso solo se sirve
 * a clientes de terminal.
 */
import { t, contactInfo, type Lang } from '../i18n/ui';
import { forLang, projects } from './projects';
import { skills } from './skills';
import { getArticles, articleHref, articlesPath, formatDate } from './articles';

// 72 columnas en total: cabe en una terminal de 80 con margen.
const WIDTH = 70;
const INDENT = '  ';

const ansi = (code: string) => (text: string) => `\x1b[${code}m${text}\x1b[0m`;
const bold = ansi('1');
const dim = ansi('2');
const link = ansi('34');
const heading = ansi('1;35');

// El monograma "rs" del favicon, dibujado con bloques: cada carácter pinta
// dos píxeles en vertical (▀ arriba, ▄ abajo), así que salen 5 de alto.
const LOGO = ['█▄▀▀ ▄▀▀▀', '█     ▀▀▄', '▀    ▀▀▀'];

/** Parte el texto en líneas de WIDTH columnas, sin cortar palabras. */
function wrap(text: string, width = WIDTH): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && line.length + 1 + word.length > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Texto a la izquierda y fecha a la derecha, alineada al borde. */
function row(left: string, right: string) {
  const gap = Math.max(2, WIDTH - left.length - right.length);
  return bold(left) + ' '.repeat(gap) + dim(right);
}

export async function terminalCard(lang: Lang, site: URL) {
  const tr = t(lang);
  const base = site.origin;
  const out: string[] = [];
  const section = (title: string) => out.push('', heading(title.toUpperCase()), '');

  out.push(...LOGO, '');
  out.push(bold('Rubén Salas'), dim(tr.header.available), '');
  out.push(...wrap(tr.about.intro));
  out.push('');
  out.push(link(contactInfo.github), link(contactInfo.linkedin), link(contactInfo.x), link(contactInfo.email));

  section(tr.about.title);
  out.push(...wrap(tr.about.howIWork));

  section(tr.now.title);
  tr.now.items.forEach((item, i) => {
    if (i > 0) out.push('');
    // El lead va en negrita; se marca sobre la primera línea ya partida
    // porque los códigos ANSI descuadrarían el cálculo de columnas.
    const [first, ...rest] = wrap(item.lead + item.text);
    out.push(bold(item.lead) + first.slice(item.lead.length), ...rest);
  });

  section(tr.work.title);
  projects.forEach((project, i) => {
    if (i > 0) out.push('');
    const repo = forLang(project.repo, lang);
    out.push(row(forLang(project.name, lang), project.year));
    out.push(...wrap(project.desc[lang]));
    out.push(dim(project.stack.join(' · ')));
    out.push(repo ? link(`${contactInfo.github}/${repo}`) : dim(tr.work.privateRepo));
    if (project.live) out.push(link(project.live));
  });

  section(tr.skills.title);
  const pad = Math.max(tr.skills.use.length, tr.skills.learning.length) + 2;
  out.push(bold(tr.skills.use.padEnd(pad)) + skills.use.join(', '));
  out.push(bold(tr.skills.learning.padEnd(pad)) + skills.learning[lang].join(', '));

  // Como en la cabecera de la web: sin artículos publicados, no hay sección.
  const articles = await getArticles(lang);
  if (articles.length) {
    section(tr.articles.title);
    articles.slice(0, 5).forEach((article, i) => {
      if (i > 0) out.push('');
      const { title, date } = article.entry.data;
      out.push(row(title, formatDate(date, lang)));
      out.push(link(`${base}${articleHref(lang, article.slug)}`));
    });
    out.push('', `${tr.terminal.allArticles}: ${link(`${base}${articlesPath[lang]}`)}`);
  }

  out.push('', dim(tr.terminal.otherLang));

  return `\n${out.map((line) => (line ? INDENT + line : '')).join('\n')}\n\n`;
}

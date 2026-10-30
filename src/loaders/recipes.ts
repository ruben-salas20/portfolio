/**
 * Cargador de las recetas: las descarga del repo ruben-salas20/recipes cada
 * vez que se construye el sitio (y al arrancar `npm run dev`). El repo es la
 * única fuente: una receta nueva o un cambio salen en el sitio en el
 * siguiente despliegue, sin tocar este proyecto.
 *
 * - La lista, el orden, el tipo de modelo y la línea de resumen salen de las
 *   tablas del README principal (README.es.md y README.md).
 * - Cada receta es el README de su carpeta, adaptado al sitio: sin el título
 *   ni el enlace al otro idioma, con los avisos de GitHub en recuadros, las
 *   tablas en un contenedor que se desplaza y los enlaces relativos apuntando
 *   a GitHub o a la página de la otra receta.
 * - Las gráficas se descargan y se guardan en public/_recetas/ con un nombre
 *   que es el hash de su contenido. Así el sitio las sirve él mismo con caché
 *   larga (ver vercel.json): GitHub solo deja guardarlas unos minutos.
 *
 * Si GitHub no responde o el README cambia de formato, el build falla en vez
 * de publicar un sitio sin recetas; Vercel mantiene entonces la versión
 * anterior.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { posix } from 'node:path';
import type { Loader } from 'astro/loaders';

const REPO = 'https://github.com/ruben-salas20/recipes';
const RAW = 'https://raw.githubusercontent.com/ruben-salas20/recipes/main';
const ASSETS_DIR = new URL('../../public/_recetas/', import.meta.url);
const ASSETS_URL = '/_recetas/';

type Lang = 'es' | 'en';
const readme = (lang: Lang) => (lang === 'es' ? 'README.es.md' : 'README.md');
const recipesPath = { es: '/recetas/', en: '/en/recipes/' };

const alertLabels = {
  es: { NOTE: 'Nota', TIP: 'Consejo', IMPORTANT: 'Importante', WARNING: 'Atención', CAUTION: 'Cuidado' },
  en: { NOTE: 'Note', TIP: 'Tip', IMPORTANT: 'Important', WARNING: 'Warning', CAUTION: 'Caution' },
} as const;

interface Listed {
  model: string;
  kind: 'image' | 'text';
  summary: string;
  order: number;
}

async function fetchText(path: string) {
  const res = await fetch(`${RAW}/${path}`);
  if (!res.ok) throw new Error(`recetas: ${res.status} al descargar ${path}`);
  return res.text();
}

const cells = (row: string) =>
  row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
const plain = (cell: string) => cell.replace(/\*\*/g, '').replace(/[¹²³⁴⁵]/g, '').trim();

/**
 * Lee las tablas del README principal. Las secciones de imagen y de texto se
 * reconocen por su título; en la de texto, la primera tabla es la de la GPU y
 * la segunda la de solo CPU. En las dos, la tercera columna es la velocidad
 * de generación.
 */
function parseIndex(text: string, lang: Lang): Listed[] {
  const listed = new Map<string, Listed>();
  const decode = new Map<string, { gpu?: string; cpu?: string }>();
  let kind: Listed['kind'] | null = null;
  let textTable = -1;
  let inTable = false;

  for (const line of text.split('\n')) {
    const h2 = line.match(/^## (.+)/);
    if (h2) {
      kind = /imagen|image/i.test(h2[1]) ? 'image' : /texto|text/i.test(h2[1]) ? 'text' : null;
      continue;
    }
    if (!line.startsWith('|')) {
      inTable = false;
      continue;
    }
    if (!inTable) {
      inTable = true;
      if (kind === 'text') textTable++;
      continue; // fila de encabezado
    }
    const model = line.match(/\]\(([^/)]+)\/README(?:\.es)?\.md\)/)?.[1];
    if (!kind || !model) continue;
    const row = cells(line);
    if (!listed.has(model)) {
      listed.set(model, { model, kind, summary: '', order: listed.size });
    }
    if (kind === 'image') {
      const type = row[0].match(/\(([^)]+)\)/)?.[1] ?? '';
      listed.get(model)!.summary = type.charAt(0).toUpperCase() + type.slice(1);
    } else {
      const speeds = decode.get(model) ?? {};
      speeds[textTable === 0 ? 'gpu' : 'cpu'] = plain(row[2]);
      decode.set(model, speeds);
    }
  }

  for (const [model, { gpu, cpu }] of decode) {
    listed.get(model)!.summary =
      lang === 'es'
        ? `Generación: ${gpu} con GPU · ${cpu} solo con CPU`
        : `Decode: ${gpu} on GPU · ${cpu} on CPU only`;
  }
  const result = [...listed.values()];
  if (result.length === 0 || result.some((r) => !r.summary)) {
    throw new Error(`recetas: no se pudieron leer las tablas de ${readme(lang)}`);
  }
  return result;
}

/** Descarga las gráficas de una receta y devuelve su ruta en el sitio. */
async function downloadAssets(model: string, markdown: string) {
  const paths = new Set(markdown.match(/assets\/[\w.-]+/g) ?? []);
  const urls = new Map<string, string>();
  mkdirSync(ASSETS_DIR, { recursive: true });
  await Promise.all(
    [...paths].map(async (path) => {
      const res = await fetch(`${RAW}/${model}/${path}`);
      if (!res.ok) throw new Error(`recetas: ${res.status} al descargar ${model}/${path}`);
      const bytes = Buffer.from(await res.arrayBuffer());
      const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
      const name = `${hash}${posix.extname(path)}`;
      const file = new URL(name, ASSETS_DIR);
      if (!existsSync(file)) writeFileSync(file, bytes);
      urls.set(path, `${ASSETS_URL}${name}`);
    }),
  );
  return urls;
}

function rewriteLink(model: string, target: string, known: Set<string>) {
  // Externos, anclas y rutas del sitio (como las gráficas ya descargadas).
  if (/^(https?:|mailto:|#|\/)/.test(target)) return target;
  const [path, hash] = target.split('#');
  const anchor = hash ? `#${hash}` : '';
  const resolved = posix.normalize(posix.join(model, path));
  const other = resolved.match(/^([^/]+)\/README(\.es)?\.md$/);
  if (other && known.has(other[1])) {
    return `${recipesPath[other[2] ? 'es' : 'en']}${other[1]}/${anchor}`;
  }
  const kind = path.endsWith('/') ? 'tree' : 'blob';
  return `${REPO}/${kind}/main/${resolved.replace(/\/$/, '')}${anchor}`;
}

function adapt(model: string, lang: Lang, text: string, assets: Map<string, string>, known: Set<string>) {
  const title = text.match(/^# (.+)$/m)?.[1];
  if (!title) throw new Error(`recetas: ${model}/${readme(lang)} no tiene título`);
  const asset = (path: string) => assets.get(path)!;

  let md = text.replace(/^# .+\n+/m, '');
  md = md.replace(/^\[(English version|Versión en español)\]\([^)]*\)\n+/m, '');
  // <picture> con una versión para cada tema → dos <img>; global.css muestra
  // la del tema activo, también cuando se elige con el botón.
  md = md.replace(
    /<picture>\s*<source media="\(prefers-color-scheme: dark\)" srcset="([^"]+)">\s*<img alt="([^"]*)" src="([^"]+)">\s*<\/picture>/g,
    (_, dark, alt, light) =>
      `<img class="only-light" alt="${alt}" src="${asset(light)}" loading="lazy">\n` +
      `<img class="only-dark" alt="${alt}" src="${asset(dark)}" loading="lazy">`,
  );
  md = md.replace(/(\]\(|src=")(assets\/[\w.-]+)/g, (_, before, path) => before + asset(path));
  md = md.replace(/(?<!!)\]\(([^)\s]+)\)/g, (_, target) => `](${rewriteLink(model, target, known)})`);
  md = md.replace(/^> \[!(\w+)\]\n((?:>.*\n?)*)/gm, (_, kind, body) => {
    const label = alertLabels[lang][kind as keyof (typeof alertLabels)['es']] ?? kind;
    const inner = body.replace(/^> ?/gm, '').trim();
    return `<div class="callout">\n\n**${label}**\n\n${inner}\n\n</div>\n`;
  });
  md = md.replace(/(^\|.*\|\n)+/gm, (table) => `<div class="table-scroll">\n\n${table}\n</div>\n`);
  return { title, md };
}

export function recipesLoader(): Loader {
  return {
    name: 'recipes',
    load: async ({ store, parseData, renderMarkdown, generateDigest, logger }) => {
      const langs: Lang[] = ['es', 'en'];
      const indexes = await Promise.all(langs.map((lang) => fetchText(readme(lang))));
      const listed = Object.fromEntries(langs.map((lang, i) => [lang, parseIndex(indexes[i], lang)])) as Record<
        Lang,
        Listed[]
      >;
      const known = new Set(listed.es.map((r) => r.model));

      store.clear();
      await Promise.all(
        langs.flatMap((lang) =>
          listed[lang].map(async (recipe) => {
            const text = await fetchText(`${recipe.model}/${readme(lang)}`);
            const assets = await downloadAssets(recipe.model, text);
            const { title, md } = adapt(recipe.model, lang, text, assets, known);
            const id = `${recipe.model}/${lang}`;
            const data = await parseData({ id, data: { ...recipe, title } });
            store.set({ id, data, body: md, rendered: await renderMarkdown(md), digest: generateDigest(md) });
          }),
        ),
      );
      logger.info(`${known.size} recetas descargadas de ${REPO}`);
    },
  };
}

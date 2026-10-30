/**
 * Catálogo de proyectos del portafolio.
 * Cada proyecto trae su descripción en EN y ES; el resto (stack, repo) es neutro.
 * El orden de este array es el orden en que aparecen en la página.
 *
 * Criterio de entrada: que lo que dice la descripción exista en el código, y que
 * el proyecto siga vivo. `writtenByMe` distingue lo que escribí yo de lo que
 * construí dirigiendo agentes de IA.
 */

/**
 * Las etiquetas de autoría están ocultas: dirigir agentes se cuenta como una
 * habilidad en "Cómo trabajo", no como una marca por proyecto. `writtenByMe`
 * se conserva para poder volver a mostrarlas con `true`.
 */
export const showAuthorship = false;

import type { Lang } from '../i18n/ui';

/** Un valor igual en los dos idiomas, o uno por idioma. */
type PerLang<T> = T | Record<Lang, T>;

export function forLang<T>(value: PerLang<T>, lang: Lang): T {
  return typeof value === 'object' && value !== null ? (value as Record<Lang, T>)[lang] : value;
}

export interface Project {
  /**
   * Slug del repo en GitHub (github.com/ruben-salas20/<repo>).
   * `null` cuando el repositorio es privado: se muestra el aviso en vez de
   * enlazar a un 404. Uno por idioma cuando cada versión vive en su repo.
   */
  repo: PerLang<string | null>;
  name: PerLang<string>;
  year: string;
  writtenByMe: boolean;
  stack: string[];
  /** Sitio en vivo, si existe. */
  live?: string;
  /** Página del proyecto dentro de este sitio, si tiene (ruta por idioma). */
  page?: Record<Lang, string>;
  desc: { en: string; es: string };
}

export const projects: Project[] = [
  {
    // Cada idioma vive en su propio repo.
    repo: { en: 'study-skills', es: 'estudio-skills' },
    name: { en: 'study-skills', es: 'estudio-skills' },
    year: '2026',
    writtenByMe: false,
    stack: ['Agent Skills', 'HTML'],
    desc: {
      en: 'Skills for studying with an AI agent: it researches the topic, builds a plan, writes study pages, assesses you and schedules reviews. It works for studying on your own or for turning your classes into study pages.',
      es: 'Skills para estudiar con un agente de IA: investiga el tema, arma un plan, escribe páginas de estudio, te evalúa y programa los repasos. Sirve para estudiar por tu cuenta o para convertir tus clases en páginas de estudio.',
    },
  },
  {
    // Repositorio privado: es código interno de un negocio en operación.
    repo: null,
    name: 'Vaecos tracking',
    year: '2026',
    writtenByMe: false,
    stack: ['Python', 'Flask', 'SQLite', 'Playwright', 'AWS'],
    desc: {
      en: "The logistics app I built for my family's store, which handles around 30 orders a day. It tracks shipment status and generates shipping labels; about 15 in every 20 are created automatically.",
      es: 'La app de logística que construí para la tienda de mi familia, que atiende unos 30 pedidos al día. Sigue el estado de los envíos y genera las guías de transporte; unas 15 de cada 20 salen solas.',
    },
  },
  {
    repo: 'recipes',
    name: 'recipes',
    year: '2026',
    writtenByMe: false,
    stack: ['llama.cpp', 'stable-diffusion.cpp', 'GGUF', 'Python'],
    page: { es: '/recetas/', en: '/en/recipes/' },
    desc: {
      en: 'Measured recipes for running open image and text models on modest hardware: the exact command, the winning settings and the numbers behind them. I measure them on an RTX 3050 with 6 GB and on a CPU-only laptop.',
      es: 'Recetas medidas para ejecutar modelos abiertos, de imagen y de texto, en hardware modesto: el comando exacto, los ajustes ganadores y los números que los respaldan. Las mido en una RTX 3050 de 6 GB y en un portátil solo con CPU.',
    },
  },
  {
    repo: 'visor',
    name: 'visor',
    year: '2026',
    writtenByMe: false,
    stack: ['Rust', 'WebKitGTK', 'MCP'],
    desc: {
      en: 'An app for studying with AI, in the spirit of Obsidian: it shows folders of HTML pages and Markdown notes. You highlight and comment, and your agent reads it and replies on the same page. With a simple note it uses about half the memory of Obsidian.',
      es: 'Una app para estudiar con IA, al estilo de Obsidian: muestra carpetas de páginas HTML y notas Markdown. Tú subrayas y comentas, y tu agente lo lee y te responde en la misma página. Con una nota sencilla usa más o menos la mitad de memoria que Obsidian.',
    },
  },
  {
    repo: 'harness',
    name: 'harness',
    year: '2026',
    writtenByMe: true,
    stack: ['Python', 'httpx', 'uv'],
    desc: {
      en: 'A terminal agent in Python that talks to any OpenAI-compatible server. It has streaming, token counting and automatic compaction of the conversation once it passes 85% of the context.',
      es: 'Un agente de terminal en Python que habla con cualquier servidor compatible con la API de OpenAI. Tiene streaming, conteo de tokens y compactación automática de la conversación al pasar el 85 % del contexto.',
    },
  },
];

/**
 * Catálogo de proyectos del portafolio.
 * Cada proyecto trae su descripción en EN y ES; el resto (stack, repo) es neutro.
 * El orden de este array es el orden en que aparecen en la página.
 *
 * Criterio de entrada: que lo que dice la descripción exista en el código, y que
 * el proyecto siga vivo. `writtenByMe` distingue lo que escribí yo de lo que
 * construí dirigiendo a una IA; la página lo muestra como etiqueta.
 */

export interface Project {
  /**
   * Slug del repo en GitHub (github.com/ruben-salas20/<repo>).
   * `null` cuando el repositorio es privado: se muestra el aviso en vez de
   * enlazar a un 404.
   */
  repo: string | null;
  name: string;
  year: string;
  writtenByMe: boolean;
  stack: string[];
  /** Sitio en vivo, si existe. */
  live?: string;
  desc: { en: string; es: string };
}

export const projects: Project[] = [
  {
    repo: 'harness',
    name: 'harness',
    year: '2026',
    writtenByMe: true,
    stack: ['Python', 'httpx', 'uv'],
    desc: {
      en: 'My first Python project written entirely by me: a terminal agent that talks to any OpenAI-compatible server. It has streaming, token counting and automatic compaction of the conversation once it passes 85% of the context. I measured that compaction with 100 runs per model: LFM2.5-2.6B kept the key details 100 out of 100 times, and Gemma4-E4B 91.',
      es: 'Mi primer proyecto de Python escrito entero por mí: un agente de terminal que habla con cualquier servidor compatible con la API de OpenAI. Tiene streaming, conteo de tokens y compactación automática de la conversación al pasar el 85 % del contexto. Medí esa compactación con 100 pruebas por modelo: LFM2.5-2.6B conservó los datos clave en 100 de 100 y Gemma4-E4B en 91.',
    },
  },
  {
    // Repositorio privado: es código interno de un negocio en operación.
    repo: null,
    name: 'Vaecos tracking',
    year: '2026',
    writtenByMe: false,
    stack: ['Python', 'Flask', 'SQLite', 'Playwright'],
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
    stack: ['stable-diffusion.cpp', 'GGUF'],
    desc: {
      en: 'Measured recipes for running open models on modest hardware: the exact command, the winning settings and the numbers behind them. The first one is Qwen-Image 2.1 on 6 GB of VRAM.',
      es: 'Recetas medidas para ejecutar modelos abiertos en hardware modesto: el comando exacto, los ajustes ganadores y los números que los respaldan. La primera es Qwen-Image 2.1 en 6 GB de VRAM.',
    },
  },
  {
    repo: 'OpenCall.md',
    name: 'OpenCall.md',
    year: '2026',
    writtenByMe: false,
    live: 'https://opencall.rubensalas.dev',
    stack: ['Electron', 'TypeScript', 'React', 'Ollama'],
    desc: {
      en: "A desktop app that records, transcribes and summarises classes locally, with no paid services. It's a fork of call.md that swaps the cloud for local Whisper and a pluggable LLM (Ollama or any OpenAI-compatible API).",
      es: 'Una app de escritorio que graba, transcribe y resume clases en local, sin servicios de pago. Es un fork de call.md que reemplaza la nube por Whisper local y un LLM intercambiable (Ollama o cualquier API compatible con OpenAI).',
    },
  },
];

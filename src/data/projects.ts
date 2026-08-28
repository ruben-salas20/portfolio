/**
 * Catálogo de proyectos del portafolio.
 * Cada proyecto trae su descripción en EN y ES; el resto (stack, repo) es neutro.
 * El orden de este array es el orden en que aparecen en la página.
 *
 * Criterio de entrada: solo proyectos que aguantan que alguien abra el código
 * (o, si es privado, que se puedan describir sin prometer un repo que no existe).
 */

export interface Project {
  /**
   * Slug del repo en GitHub (github.com/ruben-salas20/<repo>).
   * `null` cuando el repositorio es privado: la tarjeta no muestra enlace
   * al código y avisa de que es privado, en vez de enlazar a un 404.
   */
  repo: string | null;
  /** Nombre mostrado. */
  name: string;
  year: string;
  /** Tecnologías clave (se muestran como etiquetas). */
  stack: string[];
  /** Sitio en vivo, si existe (landing, demo o app desplegada). */
  live?: string;
  /** Estado opcional, ej. "Pre-alpha" / "En desarrollo". */
  status?: { en: string; es: string };
  desc: { en: string; es: string };
}

export const projects: Project[] = [
  {
    repo: 'OpenCall.md',
    name: 'OpenCall.md',
    year: '2026',
    live: 'https://opencall.rubensalas.dev',
    stack: ['Electron', 'TypeScript', 'React', 'sherpa-onnx', 'Ollama'],
    desc: {
      en: 'A desktop app that records, transcribes and summarises classes and meetings entirely on your own machine. Built on top of the open-source call.md, swapping its paid cloud dependency for local Whisper transcription (sherpa-onnx) and a pluggable LLM backend — Ollama or any OpenAI-compatible provider. Ships a working Windows installer, 257 automated tests and its own landing page.',
      es: 'Una aplicación de escritorio que graba, transcribe y resume clases y reuniones enteramente en tu propia máquina. Construida sobre el proyecto open source call.md, sustituyendo su dependencia de nube de pago por transcripción local con Whisper (sherpa-onnx) y un backend de LLM intercambiable: Ollama o cualquier proveedor compatible con la API de OpenAI. Incluye instalador de Windows funcionando, 257 tests automatizados y su propia landing.',
    },
  },
  {
    // Repositorio privado: es código interno de un negocio en operación.
    repo: null,
    name: 'VAECOS Tracking',
    year: '2026',
    stack: ['Python', 'Flask', 'SQLite', 'Playwright', 'LLM tool-calling'],
    desc: {
      en: 'The internal logistics and finance platform running in production for our family dropshipping store, which operates in Guatemala. It reconciles shipment tracking across systems, creates shipping labels end to end in a third-party ERP through a browser bot with an AI address validator, keeps the financial ledger, and answers questions about its own data through a conversational assistant with tool-calling.',
      es: 'La plataforma interna de logística y finanzas que corre en producción para la tienda de dropshipping de mi familia, que opera en Guatemala. Reconcilia el estado de los envíos entre sistemas, crea guías de transporte de extremo a extremo en un ERP externo mediante un bot de navegador con validación de direcciones por IA, lleva el libro financiero y responde preguntas sobre sus propios datos a través de un asistente conversacional con tool-calling.',
    },
  },
];

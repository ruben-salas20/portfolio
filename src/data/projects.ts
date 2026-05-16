/**
 * Catálogo de proyectos del portafolio.
 * Cada proyecto trae su descripción en EN y ES; el resto (stack, repo) es neutro.
 * El orden de este array es el orden en que aparecen en la página.
 */

export interface Project {
  /** Slug del repo en GitHub (github.com/ruben-salas20/<repo>). */
  repo: string;
  /** Nombre mostrado. */
  name: string;
  year: string;
  /** Tecnologías clave (se muestran como etiquetas). */
  stack: string[];
  /** Estado opcional, ej. "Pre-alpha" / "En desarrollo". */
  status?: { en: string; es: string };
  desc: { en: string; es: string };
}

export const projects: Project[] = [
  {
    repo: 'study-timer',
    name: 'Study Timer',
    year: '2026',
    stack: ['React 19', 'TypeScript', 'PocketBase', 'Docker', 'PWA'],
    desc: {
      en: 'A self-hostable, competitive study tracker for friend groups. Timed sessions, friend codes, live challenges and a stats dashboard — built as a full PWA with offline support and push notifications. Zero vendor lock-in.',
      es: 'Un tracker de estudio competitivo y autoalojable para grupos de amigos. Sesiones cronometradas, códigos de amistad, retos en vivo y un panel de estadísticas — una PWA completa con soporte offline y notificaciones push. Sin dependencia de proveedores.',
    },
  },
  {
    repo: 'agents-ai',
    name: 'agents-ai',
    year: '2026',
    stack: ['JavaScript', 'Node.js', 'Vitest'],
    desc: {
      en: 'A unified CLI to discover, install and manage AI coding agents across editors — Claude Code, Cursor, Copilot, Windsurf and more. Features a shared registry and 3-way drift detection that protects your local edits from upstream changes.',
      es: 'Una CLI unificada para descubrir, instalar y gestionar agentes de IA de programación entre editores — Claude Code, Cursor, Copilot, Windsurf y más. Con un registro compartido y detección de drift de 3 vías que protege tus ediciones locales de los cambios upstream.',
    },
  },
  {
    repo: 'vaecos-tracking',
    name: 'VAECOS Tracking',
    year: '2026',
    stack: ['Python', 'Automation'],
    desc: {
      en: 'An order-tracking tool built for VAECOS, the family dropshipping business — automating shipment status and logistics workflows that were previously handled by hand.',
      es: 'Una herramienta de seguimiento de pedidos para VAECOS, el negocio familiar de dropshipping — automatiza estados de envío y flujos logísticos que antes se hacían a mano.',
    },
  },
  {
    repo: 'traductor-pantalla',
    name: 'Screen Translator',
    year: '2026',
    stack: ['Python', 'Windows'],
    desc: {
      en: 'A real-time screen translator for Windows that captures a selected region and translates it on the fly (EN → ES) — useful for untranslated software and documentation.',
      es: 'Un traductor de pantalla en tiempo real para Windows que captura una región seleccionada y la traduce al vuelo (EN → ES) — útil para software y documentación sin traducir.',
    },
  },
  {
    repo: 'comando-ayuda',
    name: 'comando-ayuda',
    year: '2026',
    stack: ['Python', 'Shell'],
    desc: {
      en: 'A terminal command, `ayuda`, that translates any tool’s `--help` output into Spanish — lowering the language barrier on the command line for Spanish-speaking learners.',
      es: 'Un comando de terminal, `ayuda`, que traduce al español la salida `--help` de cualquier herramienta — bajando la barrera del idioma en la línea de comandos para quienes aprenden en español.',
    },
  },
];

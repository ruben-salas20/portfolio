/**
 * Diccionario de traducciones.
 * Toda la copia de la interfaz vive aquí, en dos idiomas. Los componentes
 * reciben `lang` como prop y piden sus textos con la función `t(lang)`.
 *
 * Las ramas `en` y `es` tienen claves espejo: el objeto está tipado `as const`,
 * así que una clave que falte en un idioma es error de tipos.
 */

export const languages = { es: 'ES', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

export const ui = {
  en: {
    meta: {
      title: 'Rubén Salas — Systems Engineering Student',
      description:
        'Systems Engineering student at Universidad del Quindío, learning to build AI agents in Python.',
      jobTitle: 'Systems Engineering student',
    },
    header: {
      available: 'Available for work',
      email: 'Email',
      otherLang: 'ES',
      themeToggle: 'Switch between light and dark mode',
    },
    about: {
      title: 'About',
      intro:
        "Systems Engineering student at Universidad del Quindío (2nd semester), in Armenia, Colombia. I'm learning to build AI agents in Python.",
      howIWork:
        "My first projects were built by directing Claude Code: I decided what and how to do things, but I didn't write the code. With harness I program the code myself, and the AI explains and reviews it (it's my boss, ha). That's how I build my skills, learn so I can later direct with judgement, and enjoy programming, which is what I like.",
    },
    now: {
      title: 'Now',
      // `lead` va en negrita; si hay `href`, el enlace es el `lead`.
      items: [
        {
          lead: 'harness',
          text: ', my agent written in Python. It already chats and compacts its context; now I’m adding tools.',
        },
        {
          lead: 'Next on my roadmap:',
          text: ' evals and tests, my own MCP server, connecting harness to it, rebuilding it with LangGraph and deploying it on AWS.',
        },
        {
          lead: 'Local models:',
          text: ' I run and benchmark them on my homelab, which has an RTX 3050 with 6 GB.',
        },
        {
          lead: 'Log:',
          text: ' I keep an (almost) daily record of what I do and learn.',
          href: 'https://github.com/ruben-salas20/bitacora',
        },
      ],
    },
    work: {
      title: 'Projects',
      writtenByMe: 'written by me',
      aiDirected: 'AI-directed',
      privateRepo: 'private repository',
      liveSite: 'live site',
    },
    skills: {
      title: 'Technologies',
      use: 'I use',
      learning: 'Learning',
    },
  },

  es: {
    meta: {
      title: 'Rubén Salas — Estudiante de Ingeniería de Sistemas',
      description:
        'Estudiante de Ingeniería de Sistemas en la Universidad del Quindío, aprendiendo a construir agentes de IA con Python.',
      jobTitle: 'Estudiante de Ingeniería de Sistemas',
    },
    header: {
      available: 'Disponible para trabajar',
      email: 'Correo',
      otherLang: 'EN',
      themeToggle: 'Cambiar entre modo claro y oscuro',
    },
    about: {
      title: 'Sobre mí',
      intro:
        'Estudiante de Ingeniería de Sistemas en la Universidad del Quindío (2.º semestre), en Armenia, Colombia. Estoy aprendiendo a construir agentes de IA con Python.',
      howIWork:
        'Mis primeros proyectos los construí dirigiendo a Claude Code: yo decidía qué y cómo hacer las cosas, pero no escribía el código. Con harness yo programo el código, y la IA me explica y me revisa (es mi jefe, jaja). Así desarrollo mis habilidades, aprendo para luego poder dirigir con criterio y disfruto de programar, que es lo que me gusta.',
    },
    now: {
      title: 'Ahora',
      items: [
        {
          lead: 'harness',
          text: ', mi agente escrito en Python. Ya conversa y compacta el contexto; ahora le estoy añadiendo herramientas.',
        },
        {
          lead: 'Lo que sigue en mi ruta:',
          text: ' evals y tests, un servidor MCP propio, conectar harness a ese servidor, rehacerlo con LangGraph y desplegarlo en AWS.',
        },
        {
          lead: 'Modelos locales:',
          text: ' los ejecuto y los mido en mi homelab, que tiene una RTX 3050 de 6 GB.',
        },
        {
          lead: 'Bitácora:',
          text: ' llevo un registro (casi) diario de lo que hago y aprendo.',
          href: 'https://github.com/ruben-salas20/bitacora',
        },
      ],
    },
    work: {
      title: 'Proyectos',
      writtenByMe: 'escrito por mí',
      aiDirected: 'dirigido con IA',
      privateRepo: 'repositorio privado',
      liveSite: 'sitio web',
    },
    skills: {
      title: 'Tecnologías',
      use: 'Uso',
      learning: 'Aprendiendo',
    },
  },
} as const;

/** Devuelve el diccionario completo para un idioma. */
export function t(lang: Lang) {
  return ui[lang];
}

/** Datos de contacto y redes — no cambian entre idiomas. */
export const contactInfo = {
  email: 'rubensalas0907@gmail.com',
  github: 'https://github.com/ruben-salas20',
  linkedin: 'https://www.linkedin.com/in/ruben-salas17/',
};

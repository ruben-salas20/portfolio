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
      articles: 'Articles',
      email: 'Email',
      otherLang: 'ES',
      themeToggle: 'Switch between light and dark mode',
    },
    about: {
      title: 'About',
      intro:
        "Systems Engineering student at Universidad del Quindío (2nd semester), in Armenia, Colombia. I'm learning to build AI agents in Python.",
      howIWork:
        "I work by defining the specifications and the process of each project, and I implement it by directing AI agents. I'm constantly developing my directing skills and my understanding of code, to sharpen my judgement and make better decisions. I also enjoy writing code by hand, even though it's becoming less and less efficient, so I do it more as a hobby and out of passion.",
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
    articles: {
      title: 'Articles',
      description: 'Articles by Rubén Salas.',
      empty: 'No articles yet.',
      back: 'All articles',
      // Para un artículo que solo existe en el otro idioma.
      onlyOtherLang: 'This article is only available in Spanish.',
      otherLangTag: 'Spanish',
      translatedWithAI: 'Translated with AI',
      // Reproductor de audio de los artículos (ver src/scripts/media.ts).
      player: { play: 'Play', pause: 'Pause', seek: 'Position', of: 'of' },
    },
    // Versión de terminal (ver src/data/terminal.ts). `otherLang` va en el
    // otro idioma: lo lee quien no entiende este.
    terminal: {
      allArticles: 'All articles',
      otherLang: 'En español: curl https://rubensalas.dev',
    },
    // Bocadillos de la escena de los márgenes: frases de una o dos palabras.
    scene: {
      name: 'Rubén',
      assign: { wall: 'It broke!', sign: 'A 404!', bug: 'A bug!' },
      going: 'On it!',
      done: 'Done!',
      self: "I'll do this one",
      selfDone: 'Like this?',
      approve: 'Perfect!',
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
      articles: 'Artículos',
      email: 'Correo',
      otherLang: 'EN',
      themeToggle: 'Cambiar entre modo claro y oscuro',
    },
    about: {
      title: 'Sobre mí',
      intro:
        'Estudiante de Ingeniería de Sistemas en la Universidad del Quindío (2.º semestre), en Armenia, Colombia. Estoy aprendiendo a construir agentes de IA con Python.',
      howIWork:
        'Trabajo definiendo las especificaciones y el proceso de cada proyecto, y lo implemento dirigiendo agentes de IA. Desarrollo constantemente mis habilidades de dirección y mi entendimiento del código, para mejorar mi criterio y tomar mejores decisiones. También disfruto escribir código a mano, aunque hoy es cada vez menos eficiente, así que lo hago más por hobby y por pasión.',
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
    articles: {
      title: 'Artículos',
      description: 'Artículos de Rubén Salas.',
      empty: 'Aún no hay artículos.',
      back: 'Todos los artículos',
      onlyOtherLang: 'Este artículo solo está en inglés.',
      otherLangTag: 'En inglés',
      translatedWithAI: 'Traducido con IA',
      player: { play: 'Reproducir', pause: 'Pausar', seek: 'Posición', of: 'de' },
    },
    terminal: {
      allArticles: 'Todos los artículos',
      otherLang: 'In English: curl https://rubensalas.dev/en',
    },
    scene: {
      name: 'Rubén',
      assign: { wall: '¡Se rompió!', sign: '¡Un 404!', bug: '¡Un bug!' },
      going: '¡Voy!',
      done: '¡Listo!',
      self: 'Este lo hago yo',
      selfDone: '¿Así?',
      approve: '¡Perfecto!',
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

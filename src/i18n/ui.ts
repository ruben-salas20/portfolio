/**
 * Diccionario de traducciones.
 * Toda la interfaz vive aquí, en dos idiomas. Los componentes reciben
 * `lang` como prop y piden sus textos con la función `t(lang)`.
 *
 * Patrón "dictionary": una sola fuente de verdad para EN y ES.
 */

export const languages = { es: 'ES', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

export const ui = {
  en: {
    meta: {
      title: 'Ruben Salas — Systems Engineering Student & AI Builder',
      description:
        'Portfolio of Ruben Salas, a systems engineering student from Armenia, Colombia, building toward AI engineering and research.',
    },
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      work: 'Work',
      contact: 'Contact',
    },
    sidebar: {
      role: 'Systems Engineering Student',
      location: '~/armenia · colombia',
      available: 'Open to collaboration',
      sourceCode: 'Source',
    },
    hero: {
      prompt: 'ruben@portfolio:~$ whoami',
      headline: 'Systems engineering student, building toward AI engineering & research.',
      lead: "I'm a self-directed builder from Armenia, Colombia. I learn by shipping — command-line tools, web apps and AI tooling — turning genuine curiosity into working software.",
      ctaWork: 'View work',
      ctaContact: 'Get in touch',
      scroll: 'scroll',
    },
    about: {
      kicker: '01 — About',
      title: 'A polymath in the making.',
      p1: "I'm a second-semester Systems Engineering student. I learn in cycles, driven by genuine curiosity rather than obligation — building practical projects is how concepts actually stick for me.",
      p2: 'Right now I work in the Technology & AI department at VAECOS, a family business, automating real operational processes. My long-term aim is to become an AI Engineer and Researcher — someone who both understands how these systems work and can build genuinely useful things with them.',
      p3: 'I apply stoic philosophy day to day, think in big ambitious arcs, and care about contributing to my community, not just personal success.',
    },
    skills: {
      kicker: '02 — Skills',
      title: 'Tools I build with.',
      note: 'Self-taught, project-first. This list grows with every repo.',
    },
    work: {
      kicker: '03 — Work',
      title: 'Selected projects.',
      lead: 'A short list on purpose — the work I stand behind, not everything I have ever pushed.',
      aiNote:
        "Each project was built with AI-assisted development — I direct the architecture and decisions while learning to code. Directing AI to ship real software is a craft I'm deliberately practising.",
      viewRepo: 'View repository',
      viewLive: 'Live site',
      privateRepo: 'Private repository — internal to the business',
      allRepos: 'See all repositories on GitHub',
    },
    contact: {
      kicker: '04 — Contact',
      title: "Let's build something.",
      lead: "I'm open to collaboration, open-source contributions and learning opportunities. The fastest way to reach me is email.",
      emailLabel: 'Email',
      githubLabel: 'GitHub',
    },
    footer: {
      built: 'Built with Astro & Tailwind CSS',
      year: '© 2026 Ruben Salas',
    },
  },

  es: {
    meta: {
      title: 'Ruben Salas — Estudiante de Ingeniería de Sistemas y Builder de IA',
      description:
        'Portafolio de Ruben Salas, estudiante de ingeniería de sistemas de Armenia, Colombia, en camino a la ingeniería e investigación en IA.',
    },
    nav: {
      home: 'Inicio',
      about: 'Sobre mí',
      skills: 'Skills',
      work: 'Proyectos',
      contact: 'Contacto',
    },
    sidebar: {
      role: 'Estudiante de Ingeniería de Sistemas',
      location: '~/armenia · colombia',
      available: 'Abierto a colaborar',
      sourceCode: 'Código',
    },
    hero: {
      prompt: 'ruben@portfolio:~$ whoami',
      headline: 'Estudiante de ingeniería de sistemas, en camino a la ingeniería e investigación en IA.',
      lead: 'Soy un builder autodidacta de Armenia, Colombia. Aprendo construyendo — herramientas de línea de comandos, apps web y tooling de IA — convirtiendo la curiosidad genuina en software que funciona.',
      ctaWork: 'Ver proyectos',
      ctaContact: 'Hablemos',
      scroll: 'scroll',
    },
    about: {
      kicker: '01 — Sobre mí',
      title: 'Un polímata en formación.',
      p1: 'Soy estudiante de segundo semestre de Ingeniería de Sistemas. Aprendo por ciclos, movido por la curiosidad genuina más que por la obligación — construir proyectos prácticos es como los conceptos realmente se me quedan.',
      p2: 'Actualmente trabajo en el departamento de Tecnología e IA de VAECOS, un negocio familiar, automatizando procesos operativos reales. Mi meta a largo plazo es ser AI Engineer e Investigador — alguien que entiende cómo funcionan estos sistemas y que puede construir cosas realmente útiles con ellos.',
      p3: 'Aplico filosofía estoica en el día a día, pienso en grande y me importa aportar a mi comunidad, no solo el éxito personal.',
    },
    skills: {
      kicker: '02 — Skills',
      title: 'Herramientas con las que construyo.',
      note: 'Autodidacta, primero el proyecto. Esta lista crece con cada repo.',
    },
    work: {
      kicker: '03 — Proyectos',
      title: 'Proyectos seleccionados.',
      lead: 'Una lista corta a propósito — el trabajo que sostengo, no todo lo que he subido.',
      aiNote:
        'Cada proyecto se construyó con desarrollo asistido por IA — yo dirijo la arquitectura y las decisiones mientras aprendo a programar. Dirigir una IA para entregar software real es un oficio que practico de forma deliberada.',
      viewRepo: 'Ver repositorio',
      viewLive: 'Sitio en vivo',
      privateRepo: 'Repositorio privado — código interno del negocio',
      allRepos: 'Ver todos los repositorios en GitHub',
    },
    contact: {
      kicker: '04 — Contacto',
      title: 'Construyamos algo.',
      lead: 'Estoy abierto a colaborar, contribuir a open source y a oportunidades de aprendizaje. La forma más rápida de contactarme es el correo.',
      emailLabel: 'Correo',
      githubLabel: 'GitHub',
    },
    footer: {
      built: 'Hecho con Astro y Tailwind CSS',
      year: '© 2026 Ruben Salas',
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
  githubUser: 'ruben-salas20',
};

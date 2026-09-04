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
      title: 'Rubén Salas — Systems Engineering Student & AI Builder',
      description:
        'Portfolio of Rubén Salas, a systems engineering student from Armenia, Colombia, building toward AI engineering and research.',
    },
    a11y: {
      skipToContent: 'Skip to content',
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
      available: 'Open to collaboration',
    },
    hero: {
      prompt: 'ruben@portfolio:~$ whoami',
      headline: 'Systems engineering student, building toward AI engineering & research.',
      lead: "I’m a self-directed builder from Armenia, Colombia. I learn by shipping — command-line tools, web apps and AI tooling — turning genuine curiosity into working software.",
      ctaWork: 'View work',
      ctaContact: 'Get in touch',
    },
    about: {
      kicker: '01 — About',
      title: 'Learning by building.',
      p1: "I’m a second-semester Systems Engineering student. I learn in cycles, driven by genuine curiosity rather than obligation — building practical projects is how concepts actually stick for me.",
      p2: "Right now I work in the Technology & AI department at VAECOS, my family’s dropshipping business, automating real operational processes. My long-term aim is to become an AI Engineer and Researcher — someone who both understands how these systems work and can build genuinely useful things with them.",
      p3: 'I think in long, ambitious arcs, and I care about contributing to my community, not just personal success.',
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
        "Every project here uses AI-assisted development: I own the architecture, the decisions and the testing, and I level up my hands-on coding with each one. Knowing how to direct AI to ship real software is a skill in itself — one I practise deliberately.",
      viewRepo: 'View repository',
      viewLive: 'Live site',
      privateRepo: 'Private repository — internal to the business',
      allRepos: 'See all repositories on GitHub',
    },
    contact: {
      kicker: '04 — Contact',
      title: "Let’s build something.",
      lead: "I’m open to collaboration, open-source contributions and learning opportunities. The fastest way to reach me is email.",
      emailLabel: 'Email',
      githubLabel: 'GitHub',
    },
    footer: {
      built: 'Built with Astro & Tailwind CSS',
      year: '© 2026 Rubén Salas',
    },
  },

  es: {
    meta: {
      title: 'Rubén Salas — Estudiante de Ingeniería de Sistemas y Builder de IA',
      description:
        'Portafolio de Rubén Salas, estudiante de ingeniería de sistemas de Armenia, Colombia, en camino a la ingeniería e investigación en IA.',
    },
    a11y: {
      skipToContent: 'Saltar al contenido',
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
      available: 'Abierto a colaborar',
    },
    hero: {
      prompt: 'ruben@portfolio:~$ whoami',
      headline: 'Estudiante de ingeniería de sistemas, en camino a la ingeniería y la investigación en IA.',
      lead: 'Soy un builder autodidacta de Armenia, Colombia. Aprendo construyendo — herramientas de línea de comandos, apps web y tooling de IA — convirtiendo la curiosidad genuina en software que funciona.',
      ctaWork: 'Ver proyectos',
      ctaContact: 'Hablemos',
    },
    about: {
      kicker: '01 — Sobre mí',
      title: 'Aprendo construyendo.',
      p1: 'Soy estudiante de segundo semestre de Ingeniería de Sistemas. Aprendo por ciclos, movido por la curiosidad genuina más que por la obligación — construir proyectos prácticos es como los conceptos realmente se me quedan.',
      p2: 'Actualmente trabajo en el departamento de Tecnología e IA de VAECOS, el negocio de dropshipping de mi familia, automatizando procesos operativos reales. Mi meta a largo plazo es ser AI Engineer e Investigador — alguien que entiende cómo funcionan estos sistemas y que puede construir cosas realmente útiles con ellos.',
      p3: 'Pienso en objetivos grandes y a largo plazo, y me importa aportar a mi comunidad, no solo el éxito personal.',
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
        'Cada proyecto usa desarrollo asistido por IA: yo dirijo la arquitectura, las decisiones y las pruebas, y con cada uno subo mi nivel de código a mano. Saber dirigir una IA para entregar software real es una habilidad en sí misma, y la practico de forma deliberada.',
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
      year: '© 2026 Rubén Salas',
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

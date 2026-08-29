# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```sh
npm run dev      # servidor de desarrollo en localhost:4321
npm run build    # build de producción a ./dist/
npm run preview  # sirve el build local
```

No hay tests, linter ni formateador configurados. Node >= 22.12.0.

`astro check` **no está disponible**: requiere `@astrojs/check` + `typescript`, que no son dependencias del proyecto, y lanzarlo con `npx` es interactivo y arrastra otra versión de Astro. Para validar cambios usa `npm run build`, que compila las dos rutas y falla ante errores de plantilla.

## Arquitectura

Sitio estático de Astro 6 + Tailwind CSS 4 (vía `@tailwindcss/vite`, sin `tailwind.config`). Una sola página de portafolio, publicada en dos idiomas.

### Un solo componente para las dos rutas

El i18n nativo de Astro (`astro.config.mjs`) define **`es` como locale por defecto**, sin prefijo, y `en` bajo `/en/`. Las páginas son cascarones de una línea:

- `src/pages/index.astro` → `<Portfolio lang="es" />`
- `src/pages/en/index.astro` → `<Portfolio lang="en" />`

Cambiar qué idioma va en la raíz toca cinco sitios a la vez, y olvidar uno deja enlaces rotos sin que el build avise: `defaultLocale`/`locales` en `astro.config.mjs`, el nombre de la carpeta bajo `src/pages/`, el `lang` de cada página, `defaultLang` en `src/i18n/ui.ts`, y en `Sidebar.astro` tanto el enlace de la marca (`isEn`) como los dos `href` del toggle.

`/es/` era la ruta española antigua y hoy es un `redirect` a `/` declarado en `astro.config.mjs`, para no romper enlaces externos.

### `/llms.txt`

`src/pages/llms.txt.ts` es un endpoint estático que genera el resumen del sitio para modelos de lenguaje ([formato llmstxt.org](https://llmstxt.org)). **Se construye a partir de `i18n/ui.ts`, `data/projects.ts` y `data/skills.ts`**, así que no hay que mantenerlo a mano: añadir un proyecto o cambiar un texto lo actualiza solo. Usa `Astro.site` (definido como `https://rubensalas.dev` en la config) para las URLs absolutas.

### SEO y metadatos

Todo el `<head>` se genera en `src/layouts/Layout.astro` a partir de `Astro.site`: canonical, los tres `hreflang` (`es`, `en`, `x-default`), Open Graph, Twitter Card y el JSON-LD de `Person`. **`site` en `astro.config.mjs` lleva `www`** — el apex `rubensalas.dev` redirige a `www.rubensalas.dev`, así que ese es el host canónico; ponerlo sin `www` propaga el host equivocado a todas las URLs absolutas del sitio, incluido `/llms.txt`.

`@astrojs/sitemap` genera `/sitemap-index.xml` leyendo el bloque `i18n`; el stub de redirect `/es/` queda fuera del sitemap por sí solo. `public/robots.txt` lo referencia y permite el rastreo a todos los crawlers, incluidos los de IA, a propósito.

Los iconos de `public/` (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`) y `og-image.png` se generaron rasterizando HTML/SVG con Edge en headless. Si hay que rehacerlos, **usa `--headless=new`**: el headless antiguo renderiza mal el SVG, y Windows clampa las ventanas por debajo de ~200 px, así que hay que renderizar grande y no pedir tamaños pequeños directamente.

### Fuentes

Las tres familias están **autoalojadas** en `public/fonts/` y declaradas con `@font-face` en `src/styles/global.css`; `Layout.astro` las precarga. No dependas de Google Fonts para añadir una fuente o un peso: costaba ~2 s de render en móvil por la cadena de tres saltos (HTML → CSS de Google → woff2 de gstatic).

Las tres son variables, así que **un archivo cubre los pesos 400 y 500**, que son los únicos que usa el sitio. Si necesitas otro peso, primero comprueba que de verdad se use en algún componente. El `unicode-range` replica el subconjunto latino de Google: las flechas (→ ↗) quedan fuera y caen a la fuente del sistema, igual que antes.

### Contraste

`--color-faint` se usa en texto de 10-12 px, así que **cualquier cambio a ese token debe validarse contra `--color-base` y contra `--color-surface`** (el fondo real de la sidebar) con el mínimo AA de 4.5:1. Ojo: Lighthouse y axe no detectan un fallo aquí — el `backdrop-blur` translúcido de la sidebar les impide resolver un fondo sólido y marcan la comprobación como "incompleta", no como fallo. Hay que calcular el ratio a mano.

### Deuda conocida

- El apex `rubensalas.dev` redirige a `www` con **307 (temporal)**; debería ser 308 para consolidar la autoridad en un host. Se cambia en el panel de Vercel, no en el repo.
- `npm audit` deja 3 avisos transitivos vía `sharp`, solo resolubles con `--force`. Son de la cadena de desarrollo y no viajan al sitio estático.
- Las secciones con `.reveal` arrancan en `opacity: 0` y dependen del IntersectionObserver: sin JavaScript quedan invisibles. Bajo riesgo, pero se cubre con `@media (scripting: none)`.

## Despliegue

El sitio se publica en Vercel **desde `origin/main` en GitHub**. Vercel no ve el árbol de trabajo local: un cambio no llega a producción hasta que está commiteado *y* pusheado. Si el usuario dice que no ve sus cambios en el sitio, comprueba primero `git status` y si `git rev-parse HEAD` coincide con `git ls-remote origin refs/heads/main`.

`src/components/Portfolio.astro` ensambla la página entera (Layout + Sidebar + las cinco secciones). **Añadir o reordenar secciones se hace ahí, una sola vez** — nunca duplicando estructura por idioma.

### Propagación de `lang` y diccionario

No hay librería de i18n ni contexto: cada componente recibe `lang: Lang` como prop y resuelve sus textos con `const tr = t(lang)` de `src/i18n/ui.ts`. Ese archivo es la única fuente de verdad de la copia de la UI: el objeto `ui` tiene ramas `en` y `es` **con claves espejo**, y está tipado `as const`, así que una clave nueva en `en` que falte en `es` es error de tipos. `contactInfo` (email, GitHub) vive ahí también, fuera del diccionario, porque no se traduce.

Al crear un componente nuevo: acepta `lang` como prop, añade sus textos bajo una clave nueva en ambos idiomas de `ui`, y pásale `lang` desde `Portfolio.astro`.

### Datos vs. copia

`src/data/projects.ts` y `src/data/skills.ts` guardan el contenido que es lista, no interfaz. Ahí la traducción es por campo, no por rama: `desc: { en, es }`, `label: { en, es }`, mientras que stack, año y `repo` son neutros. Se leen con `project.desc[lang]`. El orden del array `projects` es el orden de render.

`repo` es solo el slug; la URL se compone en `ProjectCard.astro` con `https://github.com/ruben-salas20/<repo>`. **`repo: null` significa repositorio privado**: la tarjeta se renderiza sin enlace al código y muestra el aviso `work.privateRepo` en vez de enlazar a un 404. `live` es opcional y añade un segundo enlace al sitio desplegado.

Por eso `ProjectCard.astro` es un `<article>`, no un `<a>` envolvente: una tarjeta puede tener dos destinos o ninguno, y anidar enlaces dentro de un `<a>` no es HTML válido. Los enlaces van explícitos al pie.

La lista de proyectos es deliberadamente corta y curada. Dos criterios de entrada: que las afirmaciones de la descripción existan **en el código**, no solo en el README del repo; y que el proyecto siga vivo — los repos abandonados quedan fuera aunque sean técnicamente buenos. `study-timer` y `agents-ai` se retiraron por esto último, no por calidad.

### Estilos: tokens en `@theme`

`src/styles/global.css` define en `@theme` la paleta (base/surface/elevated/line, ink/muted/faint, accent/prompt) y las tres familias tipográficas. Tailwind 4 genera de ahí las utilidades — `--color-accent` habilita `text-accent`, `bg-accent`, `border-accent`. **Usa esos tokens en vez de colores literales**; los hex crudos en los componentes solo aparecen en los gradientes inline del fondo en `Layout.astro`.

Las utilidades propias (`.reveal`, `.animate-fade-up`, `.cursor-blink`, `.link-underline`, `.nav-active`) están en `@layer utilities` del mismo archivo, y todas quedan neutralizadas bajo `prefers-reduced-motion: reduce` — cualquier animación nueva debe respetar ese bloque.

### Interacción: dos IntersectionObserver en el Layout

Todo el JS del sitio son dos observers en el `<script>` de `src/layouts/Layout.astro`:

1. **Reveal al scroll** — observa `.reveal` y le añade `.is-visible`. Una sección nueva necesita la clase `reveal` para aparecer.
2. **Scroll-spy** — enlaza `section[id]` con los `<a data-nav>` de la sidebar comparando `href="#<id>"`.

Por eso los ids de sección (`home`, `about`, `skills`, `work`, `contact`) deben coincidir con los de `navItems` en `Sidebar.astro`. Cambiar uno obliga a cambiar el otro.

### Idioma de los comentarios

El código está comentado en español, explicando el *por qué* de cada pieza. Mantén ese registro y densidad al escribir código nuevo.

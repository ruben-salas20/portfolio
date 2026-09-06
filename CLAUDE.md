# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Validación

No hay tests, linter ni formateador. **El gate es `npm run build`**, que compila las dos rutas y falla ante errores de plantilla.

`astro check` **no está disponible**: requiere `@astrojs/check` + `typescript`, que no son dependencias del proyecto, y lanzarlo con `npx` es interactivo y arrastra otra versión de Astro.

## Arquitectura

Sitio estático de Astro 6 + Tailwind CSS 4 (vía `@tailwindcss/vite`, sin `tailwind.config`). Una sola página de portafolio, publicada en dos idiomas.

### Un solo componente para las dos rutas

El i18n nativo de Astro (`astro.config.mjs`) define **`es` como locale por defecto**, sin prefijo, y `en` bajo `/en/`. Las páginas son cascarones de una línea:

- `src/pages/index.astro` → `<Portfolio lang="es" />`
- `src/pages/en/index.astro` → `<Portfolio lang="en" />`

Cambiar qué idioma va en la raíz toca cinco sitios a la vez, y olvidar uno deja enlaces rotos sin que el build avise: `defaultLocale`/`locales` en `astro.config.mjs`, el nombre de la carpeta bajo `src/pages/`, el `lang` de cada página, `defaultLang` en `src/i18n/ui.ts`, y en `Sidebar.astro` tanto el enlace de la marca (`isEn`) como los dos `href` del toggle.

`/es/` era la ruta española antigua y hoy es un `redirect` a `/` declarado en `astro.config.mjs`, para no romper enlaces externos.

`src/components/Portfolio.astro` ensambla la página entera (Layout + Sidebar + las cinco secciones). **Añadir o reordenar secciones se hace ahí, una sola vez** — nunca duplicando estructura por idioma.

### `/llms.txt`

`src/pages/llms.txt.ts` es un endpoint estático que genera el resumen del sitio para modelos de lenguaje ([formato llmstxt.org](https://llmstxt.org)). **Se construye a partir de `i18n/ui.ts`, `data/projects.ts` y `data/skills.ts`**, así que no hay que mantenerlo a mano: añadir un proyecto o cambiar un texto lo actualiza solo. Usa `Astro.site` para las URLs absolutas, así que hereda el host canónico con `www` (ver más abajo).

### SEO y metadatos

Todo el `<head>` se genera en `src/layouts/Layout.astro` a partir de `Astro.site`: canonical, los tres `hreflang` (`es`, `en`, `x-default`), Open Graph, Twitter Card y el JSON-LD de `Person`. **`site` en `astro.config.mjs` lleva `www`** — el apex `rubensalas.dev` redirige a `www.rubensalas.dev`, así que ese es el host canónico; ponerlo sin `www` propaga el host equivocado a todas las URLs absolutas del sitio, incluido `/llms.txt`.

`@astrojs/sitemap` genera `/sitemap-index.xml` leyendo el bloque `i18n`; el stub de redirect `/es/` queda fuera del sitemap por sí solo. `public/robots.txt` lo referencia y permite el rastreo a todos los crawlers, incluidos los de IA, a propósito.

Los iconos de `public/` (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`) y `og-image.png` se generaron rasterizando HTML/SVG con Edge en headless. Si hay que rehacerlos, **usa `--headless=new`**: el headless antiguo renderiza mal el SVG, y Windows clampa las ventanas por debajo de ~200 px, así que hay que renderizar grande y no pedir tamaños pequeños directamente.

### Fuentes

Las tres familias están **autoalojadas** en `public/fonts/` y declaradas con `@font-face` en `src/styles/global.css`; `Layout.astro` las precarga. Una fuente o un peso nuevo se autoaloja aquí también: Google Fonts costaba ~2 s de render en móvil por la cadena de tres saltos (HTML → CSS de Google → woff2 de gstatic).

Las tres son variables, así que **un archivo cubre los pesos 400 y 500**, que son los únicos que usa el sitio. Si necesitas otro peso, primero comprueba que de verdad se use en algún componente. El `unicode-range` se copió del subconjunto latino de Google en vez de derivarlo del contenido, así que incluye ↑ ↓ (sin usar) y deja fuera → ↗ (usadas por todas partes). Esas caen a la fuente del sistema y se ven bien, pero el subconjunto está mal derivado.

### Contraste

`--color-faint` se usa en texto de 12-14 px, así que **cualquier cambio a ese token debe validarse contra `--color-base` y contra `--color-surface`** (el fondo real de la sidebar) con el mínimo AA de 4.5:1. Ojo: Lighthouse y axe no detectan un fallo aquí — el `backdrop-blur` translúcido de la sidebar les impide resolver un fondo sólido y marcan la comprobación como "incompleta", no como fallo. Hay que calcular el ratio a mano.

Los fondos translúcidos (`bg-surface/50` en la sidebar, `bg-surface/40` en las tarjetas) hay que **componerlos sobre `--color-base` antes de medir**, no medir contra `--color-surface` a secas. Los pares reales son `#171a20` y `#16191f`.

### Propagación de `lang` y diccionario

No hay librería de i18n ni contexto: cada componente recibe `lang: Lang` como prop y resuelve sus textos con `const tr = t(lang)` de `src/i18n/ui.ts`. Ese archivo es la única fuente de verdad de la copia de la UI: el objeto `ui` tiene ramas `en` y `es` **con claves espejo**, y está tipado `as const`, así que una clave nueva en `en` que falte en `es` es error de tipos. `contactInfo` (email, GitHub) vive ahí también, fuera del diccionario, porque no se traduce.

Al crear un componente nuevo: acepta `lang` como prop, añade sus textos bajo una clave nueva en ambos idiomas de `ui`, y pásale `lang` desde `Portfolio.astro`.

### Datos vs. copia

`src/data/projects.ts` y `src/data/skills.ts` guardan el contenido que es lista, no interfaz. Ahí la traducción es por campo, no por rama: `desc: { en, es }`, `label: { en, es }`, mientras que stack, año y `repo` son neutros. Se leen con `project.desc[lang]`. El orden del array `projects` es el orden de render.

`repo` es solo el slug; la URL se compone en `ProjectCard.astro` con `https://github.com/ruben-salas20/<repo>`. **`repo: null` significa repositorio privado**: la tarjeta se renderiza sin enlace al código y muestra el aviso `work.privateRepo` en vez de enlazar a un 404. `live` es opcional y añade un segundo enlace al sitio desplegado.

Por eso `ProjectCard.astro` es un `<article>`, no un `<a>` envolvente: una tarjeta puede tener dos destinos o ninguno, y anidar enlaces dentro de un `<a>` no es HTML válido. Los enlaces van explícitos al pie.

La lista de proyectos es deliberadamente corta y curada. Dos criterios de entrada: que las afirmaciones de la descripción existan **en el código**, no solo en el README del repo; y que el proyecto siga vivo — los repos abandonados quedan fuera aunque sean técnicamente buenos. `study-timer` y `agents-ai` se retiraron por esto último, no por calidad.

### Estilos: tokens en `@theme`

`src/styles/global.css` define en `@theme` la paleta, la escala de display y las tres familias tipográficas. Tailwind 4 genera de ahí las utilidades — `--color-accent` habilita `text-accent`, `bg-accent`, `border-accent`. **Usa esos tokens en vez de colores literales**; los hex crudos en los componentes solo aparecen en los gradientes inline del fondo en `Layout.astro`.

**Los dos acentos tienen un significado cada uno, y es lo que hace legible la página:** `--color-accent` (frost) es *solo* interactivo — enlaces, hover, foco, nav activa, idioma activo; `--color-prompt` (aurora) es *solo* anotación estática — prompt de terminal, kickers de sección, `// note`, badge de estado. Pintar de frost un texto que no se pulsa invita a hacer clic donde no hay nada.

**La escala tipográfica son cinco pasos `--text-display-*`** (xs 30 px → xl 54.4 px), uno por rol en uso, con su `--line-height` de 1.1. Todo lo que no es titular usa la escala de Tailwind, y **12 px (`text-xs`) es el suelo**. Todo tamaño vive en `@theme`: si hace falta uno nuevo es porque hay un rol nuevo, y se declara ahí.

Las utilidades propias viven en `@layer utilities` del mismo archivo. Tres reglas sobre ellas:

- **Toda animación queda neutralizada bajo `prefers-reduced-motion: reduce`**, y el bloque cubre también utilidades de Tailwind, no solo las de este archivo: `animate-ping` se coló justo por venir de fuera de `@layer utilities`.
- **`text-wrap` va en `@layer base` sobre el elemento** (`balance` en `h1,h2,h3`, `pretty` en `p`), no como utilidad por componente, para que cualquier sección nueva lo herede sin acordarse de pedirlo.
- **`.tap-target` amplía el área pulsable con un `::after`** sin tocar el tamaño visible, para enlaces de 12 px que miden ~16 px de alto. Las áreas extendidas **nunca deben solaparse** (WCAG 2.5.8 lo prohíbe), por eso el ensanche horizontal se ajusta con `--tap-inset-x` — el toggle ES/EN tiene los centros a 34 px y con el valor por defecto se pisan. Ese valor por defecto vive en el `var()` del `::after`, no en la clase: declararlo en la clase lo pone a competir con el override a la misma especificidad y gana el que quede después en la hoja.

### Interacción: dos IntersectionObserver en el Layout

Todo el JS del sitio son dos observers en el `<script>` de `src/layouts/Layout.astro`:

1. **Reveal al scroll** — observa `.reveal` y le añade `.is-visible`. Una sección nueva necesita la clase `reveal` para aparecer.
2. **Scroll-spy** — enlaza `section[id]` con los `<a data-nav>` de la sidebar comparando `href="#<id>"`.

Por eso los ids de sección (`home`, `about`, `skills`, `work`, `contact`) deben coincidir con los de `navItems` en `Sidebar.astro`. Cambiar uno obliga a cambiar el otro. El enlace de salto al contenido de `Layout.astro` apunta a `#home`, así que también depende de ese id.

`.reveal` arranca en `opacity: 0`, de modo que **sin JavaScript la página entera menos el hero desaparece**. Lo sostiene un `@media (scripting: none)` en `global.css`, que cubre el caso de JS desactivado — no el de un script que carga y revienta.

### Idioma de los comentarios

El código está comentado en español, explicando el *por qué* de cada pieza. Mantén ese registro y esa densidad.

## Deuda conocida

- El apex `rubensalas.dev` redirige a `www` con **307 (temporal)**; debería ser 308 para consolidar la autoridad en un host. Se cambia en el panel de Vercel, no en el repo.
- `npm audit` deja 3 avisos transitivos vía `sharp`, solo resolubles con `--force`. Son de la cadena de desarrollo y no viajan al sitio estático.
- **En móvil la primera pantalla es toda chrome**: la sidebar se vuelve una cabecera apilada y el `<h1>` no arranca hasta los ~480 px, así que en un teléfono de 640 px de alto el titular queda fuera de vista. Arreglarlo es reestructurar —mover el pie de la sidebar (estado, GitHub, idioma) al final del documento, o compactar la cabecera—, no un retoque.
- El `<h1>` español va a **7 líneas a 320 px** con interlineado 1.1. La guía tipográfica pide 1.4 a partir de tres líneas, pero 1.4 en un titular de display se ve suelto; la salida real es acortar el titular o bajar `--text-display-sm` en móvil.

## Despliegue

El sitio se publica en Vercel **desde `origin/main` en GitHub**. Vercel no ve el árbol de trabajo local: un cambio no llega a producción hasta que está commiteado *y* pusheado. Si el usuario dice que no ve sus cambios en el sitio, comprueba primero `git status` y si `git rev-parse HEAD` coincide con `git ls-remote origin refs/heads/main`.

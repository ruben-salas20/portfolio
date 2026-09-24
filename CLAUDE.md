# CLAUDE.md

Portafolio personal de Rubén Salas: una sola página estática en Astro, publicada en español (`/`) e inglés (`/en/`). Sin framework de CSS; el único JavaScript es el del botón de tema.

## Validación

**El gate es `npm run build`**: compila las dos rutas y `/llms.txt`, y falla ante errores de plantilla. No hay tests, linter ni formateador.

`astro check` no está disponible: requiere `@astrojs/check` + `typescript`, que no son dependencias, y lanzarlo con `npx` es interactivo y arrastra otra versión de Astro.

## Contenido: la regla es la honestidad

El sitio es una hoja de vida: dice lo que Rubén sabe y hace, nada más. Todo cambio de contenido pasa por estas reglas:

- **Tecnologías (`src/data/skills.ts`)**: `use` lleva solo lo que Rubén sabe usar por su cuenta, sin IA. Que una tecnología aparezca en un repo no basta para listarla. `learning` lleva lo que está estudiando ahora, no lo que planea.
- **Proyectos (`src/data/projects.ts`)**: entran si lo que dice la descripción existe en el código y el proyecto sigue vivo. `writtenByMe` separa lo que programó él (`escrito por mí`) de lo que construyó dirigiendo a una IA (`dirigido con IA`), y la página lo muestra como etiqueta. Ante la duda sobre qué etiqueta lleva un proyecto, pregunta.
- **Texto escrito por Rubén** (por ejemplo `about.howIWork`): corrige solo ortografía y puntuación. Conserva sus redundancias y su forma de hablar; pulir el estilo es lo que lo hace sonar a IA.

## Arquitectura

`src/components/Portfolio.astro` ensambla la página entera (cabecera + cuatro `Section`). Las páginas de `src/pages/` son cascarones de una línea que le pasan `lang`. Añadir o reordenar secciones se hace ahí, una sola vez.

**Copia vs. datos.** `src/i18n/ui.ts` es la única fuente de la copia de la interfaz: ramas `en` y `es` con claves espejo, tipadas `as const`, así que una clave que falte en un idioma es error de tipos. Cada componente recibe `lang` y resuelve sus textos con `t(lang)`. Lo que es lista va en `src/data/`, traducido por campo (`desc: { en, es }`) en vez de por rama. `repo: null` significa repositorio privado: la tarjeta muestra el aviso en vez de enlazar a un 404.

**`/llms.txt`** (`src/pages/llms.txt.ts`) se genera de `ui.ts` y `src/data/`, así que se actualiza solo. Si añades una clave o un campo nuevo, decide si también debe salir ahí.

**Estilos.** Todo vive en `src/styles/global.css`: cuatro colores neutros (`--bg`, `--fg`, `--muted`, `--rule`) más `--available`, cada uno con sus dos valores en `light-dark(claro, oscuro)`, y la fuente del sistema. `--available` (verde) es el único color con tono y lo usa solo la etiqueta "Disponible para trabajar" bajo el nombre; todo lo demás es neutro. Cualquier cambio a un color de texto se valida a mano contra su `--bg` con el mínimo AA de 4.5:1; los ratios actuales están en el comentario de cabecera del archivo. Los `theme-color` de `Layout.astro` repiten los dos `--bg`.

**Tema claro/oscuro.** Por defecto sigue al sistema (`color-scheme: light dark`). El botón de la cabecera fija `data-theme` en `<html>` y lo guarda en `localStorage`; un script inline en el `<head>` de `Layout.astro` lo reaplica antes del primer pintado para que no parpadee. El botón nace `hidden` y lo destapa su script en `Portfolio.astro`: sin JS no aparece y la página sigue al sistema. Un color nuevo se declara con `light-dark()`; declararlo con un valor fijo lo deja igual en los dos temas.

## i18n: cambiar el idioma de la raíz

El español es el locale por defecto, sin prefijo. Cambiar eso toca seis sitios a la vez, y olvidar uno deja enlaces rotos sin que el build avise: `defaultLocale`/`locales` en `astro.config.mjs`, la carpeta bajo `src/pages/`, el `lang` de cada página, `defaultLang` en `ui.ts`, `otherLangHref` en `Portfolio.astro` y `alternates` en `Layout.astro`.

`/es/` es la ruta española antigua y hoy es un `redirect` a `/` en `astro.config.mjs`, para no romper enlaces externos.

## SEO

Todo el `<head>` sale de `src/layouts/Layout.astro` a partir de `Astro.site`: canonical, `hreflang`, Open Graph, Twitter Card y el JSON-LD de `Person`. **`site` lleva `www`**: el apex `rubensalas.dev` redirige a `www.rubensalas.dev`, así que ese es el host canónico, y ponerlo sin `www` propaga el host equivocado a todas las URLs absolutas, incluido `/llms.txt`.

`@astrojs/sitemap` genera `/sitemap-index.xml` leyendo el bloque `i18n`. `public/robots.txt` permite a propósito todos los crawlers, incluidos los de IA.

Los iconos de `public/` y `og-image.png` (en español, sin la etiqueta de disponibilidad para que no caduque) se generaron rasterizando HTML con Chromium en headless: `--headless=new` (el headless antiguo renderiza mal el SVG), render a 512 px y reducción con `magick` a 180 (`apple-touch-icon.png`) y 32 (`favicon.ico`). `favicon.svg` es texto: valídalo con `xmllint --noout`, porque dos guiones seguidos dentro de un comentario XML rompen el SVG entero.

## Comentarios

El código está comentado en español y explica el porqué de cada pieza. Mantén ese registro y esa densidad.

## Deuda conocida

- El apex redirige a `www` con **307 (temporal)**; debería ser 308. Se cambia en el panel de Vercel, no en el repo.

## Despliegue

Vercel publica **desde `origin/main` en GitHub** y no ve el árbol local: un cambio no llega a producción hasta que está commiteado *y* pusheado. Si el usuario no ve sus cambios en el sitio, comprueba `git status` y si `git rev-parse HEAD` coincide con `git ls-remote origin refs/heads/main`.

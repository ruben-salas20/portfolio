# AGENTS.md

Portafolio de Rubén Salas: una sola página estática en Astro, en español (`/`) e inglés (`/en/`), sin framework de CSS. El JavaScript de cliente se limita al botón de tema y a la escena en pixel art. Casi todos los porqués están en los comentarios del código; aquí va lo que no se deduce de él.

## Validación

Comprueba cada cambio con `npm run build`. Compila las dos rutas y `/llms.txt`, y falla ante errores de plantilla. No hay tests, linter ni formateador.

El build no comprueba tipos. `astro check` lo haría, pero necesita `@astrojs/check` y `typescript`, que no están instalados, y con `npx` pide confirmación e instala otra versión de Astro. Revisa a mano lo que solo detectarían los tipos, como una clave de `ui.ts` que falte en un idioma.

## Contenido

El sitio es una hoja de vida: dice lo que Rubén sabe y hace, nada más. Aplica estas reglas a todo cambio de contenido:

- **Tecnologías** (`src/data/skills.ts`): en `use`, solo lo que Rubén usa por su cuenta, sin IA. Que una tecnología salga en un repo suyo no basta. En `learning`, lo que estudia ahora, no lo que planea.
- **Proyectos** (`src/data/projects.ts`): un proyecto entra si sigue vivo y si lo que dice su descripción existe en el código. `writtenByMe: true` muestra la etiqueta «escrito por mí»; `false`, «dirigido con IA». Si dudas de cuál lleva, pregunta a Rubén.
- **Texto de Rubén** (por ejemplo, `about.howIWork` en `ui.ts`): corrige solo ortografía y puntuación. Conserva sus redundancias y su forma de hablar: pulir el estilo lo hace sonar a IA.

## Dónde va cada cosa

- **Secciones**: se añaden y se reordenan solo en `src/components/Portfolio.astro`. Las páginas de `src/pages/` solo le pasan `lang`.
- **Textos de la interfaz**: solo en `src/i18n/ui.ts`, con la misma clave en `es` y en `en`.
- **Listas** (proyectos, tecnologías): en `src/data/`, traducidas por campo (`desc: { en, es }`). `repo: null` marca un repositorio privado.
- **`/llms.txt`**: se genera solo a partir de `ui.ts` y `src/data/`. Si añades una clave o un campo, decide si debe salir ahí.

## Colores

- Declara cada color con `light-dark(claro, oscuro)`. Con un valor fijo, el color queda igual en los dos temas.
- Si cambias un color de texto, mide su contraste contra `--bg` en los dos temas (mínimo 4.5:1) y actualiza los ratios del comentario de cabecera de `global.css`.
- Si cambias un `--bg`, cambia también los `theme-color` de `Layout.astro`.
- `--available` (verde) es el único color con tono, y solo lo usa la etiqueta «Disponible para trabajar». Los colores de los personajes están en la paleta de `sprites.ts`.

## Escena

La escena ilustra el párrafo «Cómo trabajo»: Rubén manda a varios Clawd a arreglar fallos y a veces arregla uno él mientras un Clawd lo revisa. Si cambia ese párrafo, cambia también la escena. Cómo funciona está en los comentarios de `scene.ts`, `Scene.astro` y `global.css`. Además:

- **Clawd** es la mascota de Anthropic. Se usa tal cual por decisión de Rubén.
- **La primera franja es la de Rubén**, tanto en los márgenes como en móvil.
- Tecnologías no lleva franja: al cargar la página queda fuera de pantalla, y los bocadillos dirigidos a ella no se entendían.
- El umbral es **1280 px**, en el CSS y en el `matchMedia` de `Scene.astro`. Si lo tocas, cambia los dos. No lo bajes: la media query cuenta la barra de scroll, y con menos la franja izquierda asoma fuera de pantalla.
- Los bocadillos van en `ui.ts`, clave `scene`, con una o dos palabras.
- Tras editar una cuadrícula de `sprites.ts`, comprueba que todas sus filas midan lo mismo.
- **Relleno y trazo van en pareja.** Un sprite con relleno blanco fijo (`w`) lleva trazo fijo y oscuro (`x`, con `outline()`). Un sprite sin relleno lleva trazo que sigue al tema (`#`). Con `w` y `#` juntos, en modo oscuro queda trazo claro sobre blanco y no se lee (pasó con el cartel 404).

## Idioma de la raíz

El español es el idioma por defecto y no lleva prefijo. Para cambiarlo, edita estos sitios en el mismo cambio; si olvidas uno, quedan enlaces rotos y el build no avisa:

1. `astro.config.mjs`: el bloque `i18n` y la opción `i18n` de `sitemap()`.
2. La carpeta de cada idioma bajo `src/pages/`.
3. El `lang` de cada página.
4. `defaultLang` en `ui.ts`.
5. `otherLangHref` en `Portfolio.astro`.
6. `alternates` en `Layout.astro`.

## Dominio e iconos

- El host canónico es `www.rubensalas.dev`. La redirección 308 del apex se configura en el panel de Vercel, no en el repo.
- Para regenerar los iconos de `public/` y `og-image.png`, rasteriza HTML con Chromium:
  1. Usa `--headless=new`; el headless antiguo renderiza mal el SVG.
  2. Renderiza a 512 px y reduce con `magick` a 180 px (`apple-touch-icon.png`) y a 32 px (`favicon.ico`).
  3. Haz `og-image.png` en español y sin la etiqueta de disponibilidad, para que no caduque.
- Tras editar `favicon.svg`, valídalo con `xmllint --noout`. Dos guiones seguidos dentro de un comentario XML rompen el SVG entero.

## Comentarios

Comenta en español y explica el porqué de cada pieza, con la misma densidad que el código de alrededor.

## Despliegue

Vercel publica desde `origin/main` en GitHub y no ve el árbol local: un cambio llega a producción cuando está commiteado y pusheado. Si Rubén no ve un cambio en el sitio, mira `git status` y compara `git rev-parse HEAD` con `git ls-remote origin refs/heads/main`.

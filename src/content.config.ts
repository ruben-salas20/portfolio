/**
 * Colecciones de contenido. Cada artículo es una carpeta en
 * src/content/articles/ con un archivo por idioma (es.md, en.md o los dos)
 * y sus imágenes al lado, que comparten las dos versiones. El nombre de la
 * carpeta es el slug en las dos rutas.
 * Si al frontmatter le falta un campo, el build falla y dice cuál.
 * Con `draft: true` esa versión solo existe en `npm run dev`.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { recipesLoader } from './loaders/recipes';

const articles = defineCollection({
  loader: glob({
    pattern: '*/{es,en}.md',
    base: './src/content/articles',
    // "mi-articulo/es.md" → "mi-articulo/es". Sin esto el id podría salir
    // del frontmatter; src/data/articles.ts lo parte en carpeta e idioma.
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    // El sitio separa lo que escribe Rubén de lo que hace con IA: una
    // traducción hecha con IA lo dice bajo el título.
    translatedWithAI: z.boolean().default(false),
  }),
});

// Recetas del repo ruben-salas20/recipes, descargadas al construir el sitio
// (ver src/loaders/recipes.ts). El id es "<modelo>/<idioma>".
const recipes = defineCollection({
  loader: recipesLoader(),
  schema: z.object({
    title: z.string(),
    // Nombre de la carpeta en el repo; también es el slug.
    model: z.string(),
    kind: z.enum(['image', 'text']),
    summary: z.string(),
    // Posición en la lista, la misma que en el README del repo.
    order: z.number(),
  }),
});

export const collections = { articles, recipes };

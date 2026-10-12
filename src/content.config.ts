/**
 * Colecciones de contenido. Cada artículo es una carpeta en
 * src/content/articles/ con su texto en index.md y sus imágenes al lado,
 * para que las imágenes de todos los artículos no acaben en una sola
 * carpeta. El nombre de la carpeta es el slug.
 * Si al frontmatter le falta un campo, el build falla y dice cuál.
 * Con `draft: true` el artículo solo existe en `npm run dev`.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/articles',
    // Sin esto el id sale del frontmatter o de la ruta del archivo, y
    // aquí todos los archivos se llaman index.md.
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };

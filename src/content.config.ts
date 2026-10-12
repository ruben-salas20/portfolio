/**
 * Colecciones de contenido. Cada artículo es un .md en
 * src/content/articles/; el nombre del archivo, sin extensión, es su slug.
 * Si al frontmatter le falta un campo, el build falla y dice cuál.
 * Con `draft: true` el artículo solo existe en `npm run dev`.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };

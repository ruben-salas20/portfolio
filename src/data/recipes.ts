/**
 * Utilidades de las recetas, compartidas por sus páginas. Cada receta tiene
 * las dos versiones, así que no hay versiones de respaldo como en los
 * artículos.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export const recipesPath: Record<Lang, string> = {
  es: '/recetas/',
  en: '/en/recipes/',
};

export const recipesRepo = 'https://github.com/ruben-salas20/recipes';

export function recipeHref(lang: Lang, slug: string) {
  return `${recipesPath[lang]}${slug}/`;
}

/** Las recetas de un idioma, en el orden del README del repo. */
export async function getRecipes(lang: Lang): Promise<CollectionEntry<'recipes'>[]> {
  const entries = await getCollection('recipes', (entry) => entry.id.endsWith(`/${lang}`));
  return entries.sort((a, b) => a.data.order - b.data.order);
}

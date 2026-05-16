/**
 * Skills agrupadas por categoría.
 * Los nombres de tecnología no se traducen; solo la etiqueta del grupo.
 */

export interface SkillGroup {
  label: { en: string; es: string };
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: { en: 'Languages', es: 'Lenguajes' },
    items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'Bash'],
  },
  {
    label: { en: 'Frontend', es: 'Frontend' },
    items: ['React', 'Astro', 'Tailwind CSS'],
  },
  {
    label: { en: 'Backend & Data', es: 'Backend y Datos' },
    items: ['Node.js', 'PocketBase', 'SQLite'],
  },
  {
    label: { en: 'AI / ML', es: 'IA / ML' },
    items: ['Vercel AI SDK', 'Ollama', 'RAG', 'Claude API'],
  },
  {
    label: { en: 'Tooling & Infra', es: 'Tooling e Infra' },
    items: ['Docker', 'Git', 'Linux (Arch)', 'Neovim', 'Vitest'],
  },
];

// /index.txt — la portada en español para la terminal (ver src/data/terminal.ts).
import type { APIRoute } from 'astro';
import { terminalCard } from '../data/terminal';

export const GET: APIRoute = async ({ site }) =>
  new Response(await terminalCard('es', site!), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

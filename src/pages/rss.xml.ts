// /rss.xml — RSS de los artículos en español (ver src/data/feed.ts).
import type { APIRoute } from 'astro';
import { articlesFeed } from '../data/feed';

export const GET: APIRoute = ({ site }) => articlesFeed('es', site!);

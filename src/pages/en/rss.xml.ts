// /en/rss.xml — RSS de los artículos en inglés (ver src/data/feed.ts).
import type { APIRoute } from 'astro';
import { articlesFeed } from '../../data/feed';

export const GET: APIRoute = ({ site }) => articlesFeed('en', site!);

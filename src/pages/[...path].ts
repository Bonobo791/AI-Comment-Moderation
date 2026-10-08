import { readFile } from 'node:fs/promises';
export const prerender = false;

export async function ALL() {
  const html = import.meta.env.DEV
    ? '<h1>Page not found</h1><a href="/">Return to the guide</a>'
    : await readFile('dist/client/404.html', 'utf8');
  return new Response(html, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

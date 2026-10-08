import { readFile } from 'node:fs/promises';

export const prerender = false;

export async function GET() {
  // Keep build metadata outside the public static directory so caching is explicit.
  return new Response(await readFile('dist/build.json'), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}

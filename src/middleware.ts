import { defineMiddleware } from 'astro:middleware';
import { securityHeaders } from './lib/hosting-headers.mjs';

export const onRequest = defineMiddleware(async (_context, next) => {
  // Vite development uses inline styles and an HMR websocket.
  if (import.meta.env.DEV) return next();
  const response = await next();
  const html = response.headers.get('Content-Type')?.includes('text/html')
    ? await response.clone().text()
    : '';
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(securityHeaders(html))) headers.set(key, value);
  if (response.status >= 400) {
    headers.set('Cache-Control', 'no-store');
    headers.set('X-Robots-Tag', 'noindex, follow');
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});

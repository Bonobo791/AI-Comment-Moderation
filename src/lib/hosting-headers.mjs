import { createHash } from 'node:crypto';

/** @param {string} html */
export function securityHeaders(html) {
  const hashes = new Set();
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/.test(match[1]) || !match[2].trim()) continue;
    hashes.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);
  }
  const csp = `default-src 'self'; script-src 'self' ${[...hashes].join(' ')}; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`;
  return (
    [
      `add_header Content-Security-Policy "${csp}" always;`,
      'add_header X-Content-Type-Options "nosniff" always;',
      'add_header Referrer-Policy "strict-origin-when-cross-origin" always;',
      'add_header X-Frame-Options "DENY" always;',
      'add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;',
    ].join('\n') + '\n'
  );
}

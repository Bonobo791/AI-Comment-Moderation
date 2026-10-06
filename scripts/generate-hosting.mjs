import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { securityHeaders } from '../src/lib/hosting-headers.mjs';
const html = await readFile('dist/index.html', 'utf8');
const errorHtml = await readFile('dist/404.html', 'utf8');
if (!html.includes('Choose an AI comment moderation workflow'))
  throw new Error('Cannot prepare hosting without the expected built guide');
await mkdir('deploy/generated', { recursive: true });
await writeFile('deploy/generated/security-headers.conf', securityHeaders(html + '\n' + errorHtml));
await writeFile('dist/healthz.txt', 'ok\n');
console.log('Prepared artifact-specific CSP hashes and static health file');

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { securityHeaders } from '../src/lib/hosting-headers.mjs';
import { buildMarker } from '../src/lib/build-provenance.mjs';
let html = await readFile('dist/client/index.html', 'utf8');
let errorHtml = await readFile('dist/client/404.html', 'utf8');
if (!html.includes('Choose an AI comment moderation workflow'))
  throw new Error('Cannot prepare hosting without the expected built guide');
const headers = securityHeaders(html + '\n' + errorHtml);
// Static HTML aliases bypass the adapter's header registry. Keep the script policy
// in the HTML too; frame-ancestors requires an HTTP header and is omitted here.
const policy = headers['Content-Security-Policy'].replace("; frame-ancestors 'none'", '');
const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}">`;
html = html.replace('</head>', `${meta}</head>`);
errorHtml = errorHtml.replace('</head>', `${meta}</head>`);
await writeFile('dist/client/index.html', html);
await writeFile('dist/client/404.html', errorHtml);
const publicFiles = [];
async function collect(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) await collect(path);
    else if (!['build.json', 'healthz.txt'].includes(item.name))
      publicFiles.push([relative('dist/client', path).replaceAll('\\', '/'), await readFile(path)]);
  }
}
await collect('dist/client');
const marker = buildMarker(publicFiles, process.env);
const routes = ['/', '/404', '/404/'];
await writeFile(
  'dist/_headers.json',
  JSON.stringify(
    routes.map((pathname) => ({
      pathname,
      headers: Object.entries({
        ...headers,
        'Cache-Control': pathname === '/' ? 'no-cache' : 'no-store',
        ...(pathname !== '/' ? { 'X-Robots-Tag': 'noindex, follow' } : {}),
      }).map(([key, value]) => ({ key, value })),
    })),
    null,
    2,
  ),
);
await writeFile('dist/build.json', `${JSON.stringify(marker, null, 2)}\n`);
console.log('Prepared standalone Node headers, CSP hashes and source/artifact marker');

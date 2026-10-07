import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { securityHeaders } from '../src/lib/hosting-headers.mjs';
import { buildMarker } from '../src/lib/build-provenance.mjs';
const html = await readFile('dist/index.html', 'utf8');
const errorHtml = await readFile('dist/404.html', 'utf8');
if (!html.includes('Choose an AI comment moderation workflow'))
  throw new Error('Cannot prepare hosting without the expected built guide');
const publicFiles = [];
async function collect(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) await collect(path);
    else if (!['build.json', 'healthz.txt'].includes(item.name))
      publicFiles.push([relative('dist', path).replaceAll('\\', '/'), await readFile(path)]);
  }
}
await collect('dist');
const marker = buildMarker(publicFiles, process.env);
await mkdir('deploy/generated', { recursive: true });
await writeFile('deploy/generated/security-headers.conf', securityHeaders(html + '\n' + errorHtml));
await writeFile('dist/healthz.txt', 'ok\n');
await writeFile('dist/build.json', `${JSON.stringify(marker, null, 2)}\n`);
console.log('Prepared artifact-specific CSP hashes, static health file and source/artifact marker');

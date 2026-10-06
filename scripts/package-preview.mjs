import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { resolve } from 'node:path';
let html = await readFile('dist/index.html', 'utf8');
for (const match of [...html.matchAll(/<link rel="stylesheet" href="(\/_astro\/[^"]+)"[^>]*>/g)])
  html = html.replace(match[0], `<style>${await readFile(`dist${match[1]}`, 'utf8')}</style>`);
for (const match of [
  ...html.matchAll(/<script type="module" src="(\/_astro\/[^"]+)"><\/script>/g),
]) {
  const result = await build({
    entryPoints: [resolve(`dist${match[1]}`)],
    bundle: true,
    write: false,
    minify: true,
    platform: 'browser',
    format: 'iife',
  });
  html = html.replace(
    match[0],
    `<script>${result.outputFiles[0].text.replaceAll('</script', '<\\/script')}</script>`,
  );
}
html = html.replaceAll('href="/#', 'href="#').replaceAll('href="/"', 'href="#main"');
const icon = await readFile('public/favicon.svg');
html = html.replace(
  'href="/favicon.svg"',
  `href="data:image/svg+xml;base64,${icon.toString('base64')}"`,
);
if (html.includes('src="/_astro/') || html.includes('href="/_astro/'))
  throw new Error('Preview still depends on server assets');
await mkdir('deliverables', { recursive: true });
await writeFile('deliverables/AICommentModeration-preview.html', html);
console.log(
  `Packaged self-contained noindex preview (${Buffer.byteLength(html)} bytes). No hosting or publication occurred.`,
);

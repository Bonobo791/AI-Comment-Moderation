import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { allowedExternalUrl, siteConfig } from '../src/lib/site-config.mjs';
import { scenarios } from '../src/data/scenarios.mjs';
const config = siteConfig(process.env);
const html = await readFile('dist/index.html', 'utf8');
assert.match(
  html,
  /class="hero-visual"[^>]*role="group"/,
  'Named workflow illustration needs a group role',
);
assert.match(
  html,
  /id="checklist-count"[^>]*\bhidden\b/,
  'No-JS count must stay hidden until enhancement',
);
assert.match(
  html,
  /id="reset-checklist"[^>]*\bhidden\b/,
  'No-JS reset must stay hidden until enhancement',
);
const expectedIds = [
  'what-this-covers',
  'try-the-examples',
  'choose-a-workflow',
  'native-settings',
  'review-tradeoffs',
  'rules-and-review',
  'moderaty',
  'questions',
  'sources',
  'privacy-and-ownership',
  'other-platforms',
];
assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
assert.ok(html.includes('Choose an AI comment moderation workflow'));
assert.ok(html.includes('AI Comment Moderation: Workflows, Examples and Review Choices'));
assert.match(html, /rel="canonical" href="https:\/\/aicommentmoderation\.com\/"/);
assert.ok(html.includes(config.release ? 'index,follow' : 'noindex,follow'));
assert.ok(html.includes('Illustrative rules, not a live AI prediction'));
assert.ok(html.includes('the team behind Moderaty'));
assert.ok(html.includes('top-level YouTube comments'));
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
assert.equal(ids.size, [...html.matchAll(/\bid="([^"]+)"/g)].length, 'IDs must be unique');
for (const id of expectedIds) assert.ok(ids.has(id), `Missing required anchor ${id}`);
for (const match of html.matchAll(/href="#([^"]+)"/g))
  assert.ok(ids.has(match[1]), `Missing link target ${match[1]}`);
for (const match of html.matchAll(/href="(https:[^"]+)"/g))
  assert.ok(
    match[1].startsWith('https://aicommentmoderation.com/') ||
      allowedExternalUrl(match[1].replaceAll('&amp;', '&')),
    `Unapproved external URL ${match[1]}`,
  );
for (const scenario of scenarios)
  assert.ok(html.includes(scenario.id), `Missing pre-rendered fictional fixture ${scenario.id}`);
const error = await readFile('dist/404.html', 'utf8');
assert.ok(error.includes('Page not found'));
assert.ok(!error.includes('rel="canonical"'));
assert.ok(error.includes('noindex,follow'));
const robots = await readFile('dist/robots.txt', 'utf8');
assert.ok(robots.includes('Sitemap: https://aicommentmoderation.com/sitemap.xml'));
assert.ok(robots.includes(config.release ? 'Allow: /' : 'Disallow: /'));
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 1);
assert.ok(sitemap.includes('<loc>https://aicommentmoderation.com/</loc>'));
const files = [];
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk('dist');
for (const path of files.filter((p) => /\.(?:html|js|txt|xml|json)$/.test(p))) {
  const body = await readFile(path, 'utf8');
  for (const forbidden of [
    'youtubeaimoderation.com',
    'aicommentmoderation.net',
    'localStorage',
    'sessionStorage',
    'googletagmanager',
    'gtag(',
    'umami',
    'Authorization:',
    'sk-proj-',
    'API_KEY',
  ])
    assert.ok(
      !body.toLowerCase().includes(forbidden.toLowerCase()),
      `${path}: forbidden ${forbidden}`,
    );
}
for (const match of html.matchAll(/(?:src|href)="(\/(?:_astro\/|favicon|social)[^"]+)"/g))
  await readFile(join('dist', match[1]));
const size = files.reduce(
  async (promise, path) => (await promise) + (await readFile(path)).byteLength,
  Promise.resolve(0),
);
console.log(
  `Built-output contracts passed: ${expectedIds.length} anchors, ${scenarios.length} fixtures, one canonical URL, ${files.length} files, ${await size} bytes`,
);

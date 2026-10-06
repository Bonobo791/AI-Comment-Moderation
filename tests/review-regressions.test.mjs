import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { scenarios } from '../src/data/scenarios.mjs';

test('Astro npm commands use a portable Node launcher instead of shell environment assignments', async () => {
  const { scripts } = JSON.parse(await readFile('package.json', 'utf8'));
  for (const command of ['dev', 'check', 'build', 'build:release', 'preview']) {
    assert.ok(scripts[command].startsWith(`node scripts/astro.mjs ${command}`), command);
    assert.doesNotMatch(scripts[command], /(?:^|\s)[A-Z_]+=/, command);
  }
});

test('the canonical origin rejects an explicit default port rather than silently normalizing it', async () => {
  const { siteConfig } = await import('../src/lib/site-config.mjs');
  assert.throws(() => siteConfig({ SITE_URL: 'https://aicommentmoderation.com:443' }), /origin/);
});

test('the keyboard skip target has an explicit visible inward focus outline', async () => {
  const css = await readFile('src/styles/site.css', 'utf8');
  assert.doesNotMatch(css, /main:focus\s*\{[^}]*outline:\s*none/);
  assert.match(css, /main:focus-visible\s*\{[^}]*outline:\s*3px solid[^}]*outline-offset:\s*-3px/s);
});

const anchors = [
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
const escape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
function example(scenario) {
  return `<article data-static-scenario id="example-${scenario.id}"><h3>${escape(scenario.label)}</h3><blockquote>${escape(scenario.text)}</blockquote><p>${escape(scenario.context)}</p><p><strong>Cautious:</strong> ${escape(scenario.decisions.cautious.reason)}</p><p><strong>Stricter:</strong> ${escape(scenario.decisions.stricter.reason)}</p><p>${escape(scenario.missingContext)}</p></article>`;
}
function guide(examples) {
  return `<html><head><title>AI Comment Moderation: Workflows, Examples and Review Choices</title><link rel="canonical" href="https://aicommentmoderation.com/"><meta name="robots" content="noindex,follow"></head><body><h1>Choose an AI comment moderation workflow</h1><div class="hero-visual" role="group"></div><span id="checklist-count" hidden></span><button id="reset-checklist" hidden></button><p>Illustrative rules, not a live AI prediction; the team behind Moderaty; top-level YouTube comments</p>${anchors.map((id) => `<section id="${id}"></section>`).join('')}<select>${scenarios.map((scenario) => `<option value="${scenario.id}">${escape(scenario.label)}</option>`).join('')}</select><details class="all-examples"><div class="static-example-grid">${examples}</div></details></body></html>`;
}
async function checkOutput(html) {
  const dir = await mkdtemp(join(tmpdir(), 'aicm-output-review-'));
  try {
    await mkdir(join(dir, 'dist'));
    await writeFile(join(dir, 'dist/index.html'), html);
    await writeFile(join(dir, 'dist/404.html'), 'Page not found noindex,follow');
    await writeFile(
      join(dir, 'dist/robots.txt'),
      'Disallow: /\nSitemap: https://aicommentmoderation.com/sitemap.xml',
    );
    await writeFile(join(dir, 'dist/sitemap.xml'), '<loc>https://aicommentmoderation.com/</loc>');
    return spawnSync(process.execPath, [resolve('scripts/check-output.mjs')], {
      cwd: dir,
      encoding: 'utf8',
      env: { ...process.env, SITE_RELEASE: 'false' },
    });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test('built-output fixture coverage accepts complete prerendered examples', async () => {
  const run = await checkOutput(guide(scenarios.map(example).join('')));
  assert.equal(run.status, 0, run.stderr);
});
test('built-output fixture coverage rejects a missing article even when its option ID remains', async () => {
  const run = await checkOutput(guide(scenarios.slice(1).map(example).join('')));
  assert.notEqual(run.status, 0, run.stdout);
  assert.match(run.stderr, /pre-rendered fictional fixture/);
});
test('built-output fixture coverage rejects missing fictional comment text', async () => {
  const html = guide(scenarios.map(example).join('')).replace(
    /<blockquote>[^<]*<\/blockquote>/,
    '',
  );
  const run = await checkOutput(html);
  assert.notEqual(run.status, 0, run.stdout);
  assert.match(run.stderr, /fictional comment text/);
});
test('built-output fixture coverage rejects a missing policy explanation', async () => {
  const html = guide(scenarios.map(example).join('')).replace(
    /<p><strong>Stricter:<\/strong>[^<]*<\/p>/,
    '',
  );
  const run = await checkOutput(html);
  assert.notEqual(run.status, 0, run.stdout);
  assert.match(run.stderr, /stricter policy/);
});
test('built-output fixture coverage rejects articles outside the readable example grid', async () => {
  const html = guide(scenarios.map(example).join('')).replace(
    'class="static-example-grid"',
    'class="wrong-grid"',
  );
  const run = await checkOutput(html);
  assert.notEqual(run.status, 0, run.stdout);
  assert.match(run.stderr, /pre-rendered fictional fixture/);
});
test('built-output fixture coverage rejects a missing context explanation', async () => {
  const html = guide(scenarios.map(example).join('')).replace(
    `<p>${escape(scenarios[0].context)}</p>`,
    '',
  );
  const run = await checkOutput(html);
  assert.notEqual(run.status, 0, run.stdout);
  assert.match(run.stderr, /fixture context/);
});
test('offline stylesheet packaging avoids nested template literals', async () => {
  const source = await readFile('scripts/package-preview.mjs', 'utf8');
  assert.doesNotMatch(source, /`<style>\$\{await readFile\(`/);
});

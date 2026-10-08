import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

test('print styles override pale dark-section text after making its background white', async () => {
  const css = await readFile('src/styles/site.css', 'utf8');
  const print = css.slice(css.indexOf('@media print'));
  for (const selector of [
    '.dark-section .eyebrow',
    '.dark-section .small-label',
    '.dark-section a',
  ])
    assert.ok(print.includes(selector), `Missing dark print override: ${selector}`);
  assert.match(print, /\.dark-section a\s*\{\s*color:\s*(?:black|#000);/);
});
test('Playwright uses its installed Chromium unless an explicit executable override is selected', async () => {
  const saved = process.env.CHROMIUM_PATH;
  delete process.env.CHROMIUM_PATH;
  try {
    const { default: config } = await import(
      `../playwright.config.mjs?default-browser=${Date.now()}`
    );
    assert.equal(config.use.launchOptions.executablePath, undefined);
  } finally {
    if (saved !== undefined) process.env.CHROMIUM_PATH = saved;
  }
});
test('offline preview stays noindex even when packaged from a release artifact', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aicm-preview-indexing-'));
  try {
    await mkdir(join(dir, 'dist/client'), { recursive: true });
    await mkdir(join(dir, 'public'));
    await writeFile(
      join(dir, 'dist/client/index.html'),
      '<html><head><meta name="robots" content="index,follow"><link rel="icon" href="/favicon.svg"></head><body>Guide</body></html>',
    );
    await writeFile(
      join(dir, 'public/favicon.svg'),
      '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    );
    const run = spawnSync(process.execPath, [resolve('scripts/package-preview.mjs')], {
      cwd: dir,
      encoding: 'utf8',
    });
    assert.equal(run.status, 0, run.stderr);
    const html = await readFile(join(dir, 'deliverables/AICommentModeration-preview.html'), 'utf8');
    assert.ok(html.includes('content="noindex,follow"'));
    assert.equal(html.includes('content="index,follow"'), false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

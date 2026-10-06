import assert from 'node:assert/strict';
const target = process.argv[2];
if (!target) throw new Error('Pass the approved local preview base URL');
const base = new URL(target);
if (
  !['127.0.0.1', 'localhost'].includes(base.hostname) ||
  base.protocol !== 'http:' ||
  base.username ||
  base.password ||
  base.search ||
  base.hash ||
  base.pathname !== '/'
)
  throw new Error('Smoke test accepts an isolated HTTP loopback preview only');
async function get(path) {
  return fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(5000) });
}
const root = await get('/');
assert.equal(root.status, 200);
const html = await root.text();
assert.ok(html.includes('Choose an AI comment moderation workflow'));
assert.ok(html.includes('noindex,follow'), 'Use a preview build for this smoke test');
const csp = root.headers.get('content-security-policy');
assert.ok(csp?.includes("connect-src 'none'"));
assert.ok(!csp.includes('unsafe-inline'));
assert.equal(root.headers.get('x-content-type-options'), 'nosniff');
assert.equal((await get('/healthz')).status, 200);
assert.equal((await get('/missing-page/')).status, 404);
const missing = await get('/missing-page/');
assert.ok((await missing.text()).includes('Page not found'));
assert.ok(missing.headers.get('content-security-policy'));
assert.ok(missing.headers.get('x-robots-tag')?.includes('noindex'));
assert.equal((await get('/404.html')).status, 404);
for (const match of html.matchAll(/(?:src|href)="(\/(?:_astro\/|favicon|social)[^"]+)"/g)) {
  const response = await get(match[1]);
  assert.equal(response.status, 200, match[1]);
  assert.ok(response.headers.get('content-security-policy'));
}
const scripts = [...html.matchAll(/src="(\/_astro\/[^"]+\.js)"/g)];
if (scripts.length) {
  const asset = await get(scripts[0][1]);
  assert.ok(asset.headers.get('content-type')?.includes('javascript'));
  assert.ok(asset.headers.get('cache-control')?.includes('immutable'));
}
console.log(
  'Local static-host smoke passed: root/assets/health, real 404, CSP/headers and preview indexing',
);

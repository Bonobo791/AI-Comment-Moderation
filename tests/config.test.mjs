import test from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig, canonical, allowedExternalUrl } from '../src/lib/site-config.mjs';

test('preview defaults are safe and release requires explicit intended origin', () => {
  assert.deepEqual(siteConfig({}), { origin: 'https://aicommentmoderation.com', release: false });
  assert.throws(() => siteConfig({ SITE_RELEASE: 'true' }), /SITE_URL/);
  assert.deepEqual(
    siteConfig({ SITE_URL: 'https://aicommentmoderation.com/', SITE_RELEASE: 'true' }),
    { origin: 'https://aicommentmoderation.com', release: true },
  );
});
test('release origin rejects corrected-away, copied, preview and lookalike hosts', () => {
  for (const origin of [
    'https://aicommentmoderation.net',
    'https://youtubeaimoderation.com',
    'http://aicommentmoderation.com',
    'https://www.aicommentmoderation.com',
    'http://localhost:4321',
    'https://preview.aicommentmoderation.com',
    'https://aicommentmoderation.com.evil.invalid',
    'https://aicommentmoderation.com:444',
    'https://aicommentmoderation.com/?x=1',
    'https://user:pass@aicommentmoderation.com',
    'https://aicommentmoderation.com/other',
    'not-a-url',
  ]) {
    assert.throws(() => siteConfig({ SITE_URL: origin, SITE_RELEASE: 'true' }), /origin/);
  }
});
test('release flag accepts only explicit true or false', () => {
  for (const value of ['', 'yes', 'TRUE', '1', ' true '])
    assert.throws(() => siteConfig({ SITE_RELEASE: value }), /SITE_RELEASE/);
});
test('canonical strips queries and fragments without switching hosts', () => {
  assert.equal(
    canonical('/?utm_source=anything#try-the-examples'),
    'https://aicommentmoderation.com/',
  );
  assert.equal(
    canonical('/guide?email=sensitive#source'),
    'https://aicommentmoderation.com/guide/',
  );
  for (const path of ['//evil.invalid', 'https://evil.invalid', '/\\evil.invalid'])
    assert.throws(() => canonical(path), /path/);
});
test('external links are HTTPS and exact-host allowlisted', () => {
  assert.equal(allowedExternalUrl('https://moderaty.com/pricing'), true);
  assert.equal(allowedExternalUrl('https://www.drupal.org/project/ai_comment_moderation'), true);
  for (const url of [
    'javascript:alert(1)',
    'https://moderaty.com.evil.invalid',
    'http://moderaty.com',
    'https://a:b@moderaty.com',
    'https://moderaty.com:444',
    'https://example.invalid',
  ])
    assert.equal(allowedExternalUrl(url), false);
});

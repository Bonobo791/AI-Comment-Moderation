import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
const html = await readFile('deliverables/AICommentModeration-preview.html', 'utf8');
function createDOM(enhance = true, restore = () => {}) {
  const dom = new JSDOM(html, {
    url: 'https://aicommentmoderation.com/',
    runScripts: 'outside-only',
  });
  dom.window.matchMedia = () => ({
    addEventListener() {},
    removeEventListener() {},
    matches: false,
  });
  restore(dom.window.document);
  if (enhance)
    for (const script of dom.window.document.querySelectorAll(
      'script:not([type="application/ld+json"])',
    ))
      dom.window.eval(script.textContent);
  return dom;
}
test('built scripts update real DOM for selection, policy, repeated reset and category scope', () => {
  const dom = createDOM();
  const { document, Event } = dom.window;
  const select = document.querySelector('#scenario-select');
  select.value = 'harmless-blocked-word';
  select.dispatchEvent(new Event('change'));
  const strict = document.querySelector('[name=review-mode][value=stricter]');
  strict.checked = true;
  strict.dispatchEvent(new Event('change'));
  assert.equal(document.querySelector('#decision-label').textContent, 'Consider review');
  assert.match(document.querySelector('#decision-reason').textContent, /false positive/);
  for (let i = 0; i < 3; i++) document.querySelector('#reset-demo').click();
  assert.equal(select.value, 'audio-criticism');
  assert.equal(document.querySelector('#decision-label').textContent, 'Allow');
  for (const category of ['social', 'cms', 'api']) {
    document.querySelector(`[data-category=${category}]`).click();
    assert.equal(document.querySelector('#workflow-moderaty').hidden, true);
    assert.equal(
      document.querySelector(`[data-category=${category}]`).getAttribute('aria-pressed'),
      'true',
    );
  }
  document.querySelector('[data-category=youtube]').click();
  assert.equal(document.querySelector('#workflow-moderaty').hidden, false);
  assert.equal(dom.window.localStorage.length, 0);
  assert.equal(dom.window.sessionStorage.length, 0);
  assert.equal(document.querySelector('#scenario-text a'), null);
  dom.window.close();
});
test('built checklist updates, resets and uses no-JS truthful fallback', () => {
  const dom = createDOM();
  const { document } = dom.window;
  document.querySelector('#check-0').click();
  document.querySelector('#check-1').click();
  assert.equal(document.querySelector('#checklist-count').textContent, '2 of 6 ready');
  document.querySelector('#reset-checklist').click();
  assert.equal(document.querySelector('#checklist-count').textContent, '0 of 6 ready');
  dom.window.close();
  const fallback = createDOM(false);
  const doc = fallback.window.document;
  doc.querySelector('#check-0').click();
  assert.equal(doc.querySelector('#checklist-count').hidden, true);
  assert.equal(doc.querySelector('#reset-checklist').hidden, true);
  assert.equal(doc.querySelectorAll('[data-static-scenario]').length, 10);
  assert.equal(doc.querySelector('#scenario-select').disabled, true);
  fallback.window.close();
});
test('browser-restored controls reconcile with decision and checklist output on initialization', () => {
  const dom = createDOM(true, (document) => {
    document.querySelector('#scenario-select').value = 'harmless-blocked-word';
    document.querySelector('[name=review-mode][value=stricter]').checked = true;
    document.querySelector('#check-0').checked = true;
  });
  assert.equal(dom.window.document.querySelector('#decision-label').textContent, 'Consider review');
  assert.equal(dom.window.document.querySelector('#checklist-count').textContent, '1 of 6 ready');
  dom.window.close();
});
test('navigation toggles and Escape closes the menu in built DOM', () => {
  const dom = createDOM();
  const { document, KeyboardEvent } = dom.window;
  const button = document.querySelector('#nav-toggle');
  button.click();
  assert.equal(button.getAttribute('aria-expanded'), 'true');
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  dom.window.close();
});

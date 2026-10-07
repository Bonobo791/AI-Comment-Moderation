import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios } from '../src/data/scenarios.mjs';
import { evaluateScenario, resetDemo, workflowFor } from '../src/lib/scenario-rules.mjs';
import { expectedPolicy } from './fixture-policy.mjs';
const compareFixtureIds = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

test('every fixture decision matches the independent published policy', () => {
  assert.deepEqual(
    scenarios.map((scenario) => scenario.id).sort(compareFixtureIds),
    Object.keys(expectedPolicy).sort(compareFixtureIds),
  );
  for (const scenario of scenarios)
    for (const mode of ['cautious', 'stricter'])
      assert.equal(
        evaluateScenario(scenario, mode).outcome,
        expectedPolicy[scenario.id][mode],
        `${scenario.id} / ${mode}`,
      );
});

test('ten fictional fixtures have complete unique content and decision explanations', () => {
  assert.equal(scenarios.length, 10);
  assert.equal(new Set(scenarios.map((s) => s.id)).size, 10);
  for (const scenario of scenarios) {
    assert.equal(scenario.synthetic, true);
    for (const key of ['id', 'label', 'text', 'context', 'dimension', 'missingContext'])
      assert.ok(scenario[key]?.trim());
    for (const mode of ['cautious', 'stricter']) {
      const result = evaluateScenario(scenario, mode);
      assert.ok(['allow', 'review', 'action'].includes(result.outcome));
      assert.ok(result.reason.trim());
    }
  }
});
test('criticism and product complaints remain allowed in both modes', () => {
  for (const id of ['audio-criticism', 'product-complaint'])
    for (const mode of ['cautious', 'stricter'])
      assert.equal(
        evaluateScenario(
          scenarios.find((s) => s.id === id),
          mode,
        ).outcome,
        'allow',
      );
});
test('missing context and reported insults cannot bypass review', () => {
  for (const id of ['quoted-insult', 'friendly-teasing', 'ambiguous-hostility'])
    for (const mode of ['cautious', 'stricter'])
      assert.equal(
        evaluateScenario(
          scenarios.find((s) => s.id === id),
          mode,
        ).outcome,
        'review',
      );
});
test('harmless blocked-word case shows a stricter-review false positive', () => {
  const scenario = scenarios.find((s) => s.id === 'harmless-blocked-word');
  assert.equal(evaluateScenario(scenario, 'cautious').outcome, 'allow');
  assert.equal(evaluateScenario(scenario, 'stricter').outcome, 'review');
});
test('unknown fixtures or modes cannot produce an authoritative decision', () => {
  assert.throws(() => evaluateScenario({ id: 'unknown' }, 'cautious'), /fixture/);
  assert.throws(() => evaluateScenario(undefined, 'cautious'), /fixture/);
  assert.throws(() => evaluateScenario(null, 'stricter'), /fixture/);
  assert.throws(() => evaluateScenario({}, 'cautious'), /fixture/);
  assert.throws(() => evaluateScenario(scenarios[0], 'invalid'), /mode/);
});
test('decision results are fresh copies and caller-supplied policy cannot replace published fixtures', () => {
  const fixture = {
    id: 'audio-criticism',
    decisions: { cautious: { outcome: 'action', reason: 'forged' } },
  };
  const result = evaluateScenario(fixture, 'cautious');
  assert.equal(result.outcome, 'allow');
  assert.notEqual(result.reason, 'forged');
  assert.notEqual(result, evaluateScenario(fixture, 'cautious'));
  result.outcome = 'action';
  result.reason = 'changed by a caller';
  const fresh = evaluateScenario(fixture, 'cautious');
  assert.equal(fresh.outcome, 'allow');
  assert.notEqual(fresh.reason, 'changed by a caller');
});
test('reset returns the first example and cautious mode with fresh state', () => {
  assert.deepEqual(resetDemo(), { scenarioId: 'audio-criticism', mode: 'cautious' });
  const state = resetDemo();
  state.mode = 'stricter';
  assert.equal(resetDemo().mode, 'cautious');
});
test('only YouTube workflow can offer the disclosed Moderaty path', () => {
  assert.equal(workflowFor('youtube').moderaty, true);
  assert.equal(workflowFor('youtube').anchor, '#native-settings');
  for (const category of ['social', 'cms', 'api']) {
    const result = workflowFor(category);
    assert.equal(result.moderaty, false);
    assert.ok(result.title && result.nextStep);
    assert.equal(result.anchor, '#other-platforms');
  }
  assert.throws(() => workflowFor('unknown'), /category/);
  for (const category of ['toString', '__proto__', 'constructor'])
    assert.throws(() => workflowFor(category), /category/);
});
test('each workflow supplies a useful category-specific next step and a fresh result', () => {
  for (const [category, titleTerm, guidanceTerm] of [
    ['youtube', 'YouTube Studio', 'native comment settings'],
    ['social', 'exact social platform', 'comment surfaces'],
    ['cms', 'website or CMS', 'moderator permissions'],
    ['api', 'API and human-review', 'does not change a comment'],
  ]) {
    const result = workflowFor(category);
    assert.ok(result.title.includes(titleTerm), category);
    assert.ok(result.nextStep.includes(guidanceTerm), category);
    assert.notEqual(result, workflowFor(category));
    result.title = 'caller replacement';
    result.nextStep = 'caller replacement';
    result.moderaty = !result.moderaty;
    result.anchor = '#caller-replacement';
    const fresh = workflowFor(category);
    assert.ok(fresh.title.includes(titleTerm), category);
    assert.ok(fresh.nextStep.includes(guidanceTerm), category);
    assert.equal(fresh.moderaty, category === 'youtube');
    assert.equal(fresh.anchor, category === 'youtube' ? '#native-settings' : '#other-platforms');
  }
});

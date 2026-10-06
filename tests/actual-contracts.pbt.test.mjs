import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { canonical, siteConfig, allowedExternalUrl } from '../src/lib/site-config.mjs';
import { evaluateScenario, workflowFor } from '../src/lib/scenario-rules.mjs';
import { scenarios } from '../src/data/scenarios.mjs';
import { expectedPolicy } from './fixture-policy.mjs';

const numRuns = process.env.FC_NUM_RUNS === undefined ? 100 : Number(process.env.FC_NUM_RUNS);
if (!Number.isSafeInteger(numRuns) || numRuns <= 0)
  throw new Error('FC_NUM_RUNS must be a positive safe integer');
const options = { numRuns };
if (process.env.FC_SEED !== undefined) {
  const seed = Number(process.env.FC_SEED);
  if (
    !/^-?\d+$/.test(process.env.FC_SEED) ||
    !Number.isInteger(seed) ||
    seed < -2147483648 ||
    seed > 2147483647
  )
    throw new Error('FC_SEED must be a signed 32-bit integer');
  options.seed = seed;
}
if (process.env.FC_PATH !== undefined) {
  if (options.seed === undefined || !/^\d+(?::\d+)*$/.test(process.env.FC_PATH))
    throw new Error('FC_PATH needs a seed and a valid shrink path');
  options.path = process.env.FC_PATH;
}

test('property: arbitrary query and fragment cannot leak into canonical', () => {
  fc.assert(
    fc.property(fc.string(), fc.string(), (query, fragment) => {
      const value = canonical(`/?q=${encodeURIComponent(query)}#${encodeURIComponent(fragment)}`);
      assert.equal(value, 'https://aicommentmoderation.com/');
    }),
    options,
  );
});
test('property: arbitrary foreign hostname cannot become production origin', () => {
  fc.assert(
    fc.property(
      fc
        .array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'), {
          minLength: 1,
          maxLength: 40,
        })
        .map((s) => s.join('')),
      (label) => {
        assert.throws(
          () => siteConfig({ SITE_URL: `https://${label}.invalid`, SITE_RELEASE: 'true' }),
          /origin/,
        );
        assert.equal(allowedExternalUrl(`https://moderaty.com.${label}.invalid`), false);
      },
    ),
    options,
  );
});
test('property: preset evaluation is deterministic and does not mutate fixtures', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 9 }),
      fc.constantFrom('cautious', 'stricter'),
      (index, mode) => {
        const scenario = scenarios[index];
        const before = JSON.stringify(scenario);
        assert.deepEqual(evaluateScenario(scenario, mode), evaluateScenario(scenario, mode));
        assert.equal(JSON.stringify(scenario), before);
        assert.ok(['allow', 'review', 'action'].includes(evaluateScenario(scenario, mode).outcome));
        assert.equal(evaluateScenario(scenario, mode).outcome, expectedPolicy[scenario.id][mode]);
        if (scenario.requiresContext)
          assert.equal(evaluateScenario(scenario, mode).outcome, 'review');
      },
    ),
    options,
  );
});
test('property: non-YouTube selections never recommend Moderaty compatibility', () => {
  fc.assert(
    fc.property(
      fc.array(fc.constantFrom('social', 'cms', 'api'), { minLength: 1, maxLength: 30 }),
      (operations) => {
        for (const category of operations) assert.equal(workflowFor(category).moderaty, false);
      },
    ),
    options,
  );
});

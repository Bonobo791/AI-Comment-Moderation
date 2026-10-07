import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { propertyOptions } from './helpers/property-options.mjs';

test('property options default to 100 runs with no replay controls', () => {
  assert.deepEqual(propertyOptions({}), { numRuns: 100 });
  assert.deepEqual(propertyOptions({ FC_NUM_RUNS: undefined }), { numRuns: 100 });
});

test('property options accept positive decimal safe-integer run counts', () => {
  for (const value of ['1', '100', '1000', '9007199254740991'])
    assert.deepEqual(propertyOptions({ FC_NUM_RUNS: value }), { numRuns: Number(value) });
});

test('property options reject invalid lexical, nonpositive and unsafe run counts', () => {
  for (const value of [
    '',
    '0',
    '-0',
    '-1',
    '01',
    '1.0',
    '1.2',
    '1e2',
    '0x64',
    '+100',
    ' 100 ',
    'abc',
    'NaN',
    'Infinity',
    '9007199254740992',
  ])
    assert.throws(
      () => propertyOptions({ FC_NUM_RUNS: value }),
      /FC_NUM_RUNS must be a positive safe integer/,
      value,
    );
});

test('property options accept the complete signed 32-bit seed bounds', () => {
  for (const value of ['-2147483648', '-42', '-0', '0', '42', '2147483647'])
    assert.deepEqual(propertyOptions({ FC_SEED: value }), { numRuns: 100, seed: Number(value) });
});

test('property options reject malformed and out-of-range seeds', () => {
  for (const value of [
    '',
    'bad',
    '+1',
    '1.0',
    '1.2',
    '1e2',
    ' 42 ',
    'NaN',
    'Infinity',
    '-2147483649',
    '2147483648',
    '9007199254740992',
  ])
    assert.throws(
      () => propertyOptions({ FC_SEED: value }),
      /FC_SEED must be a signed 32-bit integer/,
      value,
    );
});

test('property options accept numeric colon replay paths only with an explicit seed', () => {
  for (const path of ['0', '0:1', '0:1:999'])
    assert.deepEqual(propertyOptions({ FC_NUM_RUNS: '1000', FC_SEED: '-42', FC_PATH: path }), {
      numRuns: 1000,
      seed: -42,
      path,
    });
});

test('property options require a seed for every supplied replay path', () => {
  for (const path of ['', '0', '0:1', 'bad'])
    assert.throws(() => propertyOptions({ FC_PATH: path }), /FC_PATH requires FC_SEED/, path);
});

test('property options reject malformed replay paths even when the seed is valid', () => {
  for (const path of ['', ':0', '0:', '0::1', '-1', '0:-1', '1.2', '1/2', ' 0:1 ', 'bad'])
    assert.throws(
      () => propertyOptions({ FC_SEED: '42', FC_PATH: path }),
      /FC_PATH must be a replay path/,
      path,
    );
});

test('property options preserve the input environment and return fresh results', () => {
  const env = Object.freeze({
    FC_NUM_RUNS: '1000',
    FC_SEED: '-42',
    FC_PATH: '0:1',
    UNRELATED_SETTING: 'unchanged',
  });
  const before = { ...env };
  const result = propertyOptions(env);
  assert.deepEqual(result, { numRuns: 1000, seed: -42, path: '0:1' });
  result.numRuns = 1;
  assert.deepEqual(env, before);
  assert.deepEqual(propertyOptions(env), { numRuns: 1000, seed: -42, path: '0:1' });
});

for (const value of ['1e2', '0x64', '+100', ' 100 ']) {
  test(`the actual property suite rejects FC_NUM_RUNS=${JSON.stringify(value)}`, () => {
    const env = { ...process.env, FC_NUM_RUNS: value };
    delete env.FC_SEED;
    delete env.FC_PATH;
    // A fresh Node runner must not inherit the parent runner's child execution mode.
    delete env.NODE_TEST_CONTEXT;
    const run = spawnSync(
      process.execPath,
      [
        '--test',
        '--test-name-pattern=property: arbitrary query and fragment cannot leak into canonical',
        'tests/actual-contracts.pbt.test.mjs',
      ],
      { encoding: 'utf8', env },
    );
    assert.ifError(run.error);
    assert.equal(run.signal, null);
    assert.notEqual(run.status, 0, `Invalid FC_NUM_RUNS=${JSON.stringify(value)} was accepted`);
    assert.match(`${run.stdout}\n${run.stderr}`, /FC_NUM_RUNS must be a positive safe integer/);
  });
}

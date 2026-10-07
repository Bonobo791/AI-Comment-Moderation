import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

test('the lint gate includes both operational TypeScript routes', async () => {
  const { ESLint } = await import('eslint');
  const eslint = new ESLint();
  for (const file of ['src/pages/robots.txt.ts', 'src/pages/sitemap.xml.ts']) {
    assert.equal(await eslint.isPathIgnored(file), false, file);
    const config = await eslint.calculateConfigForFile(file);
    assert.ok(config.languageOptions.parser.parseForESLint, file);
  }
});

async function launcher() {
  assert.ok(existsSync('scripts/run-mutation.mjs'), 'Portable mutation launcher is missing');
  return import('../scripts/run-mutation.mjs');
}

test('mutation dependencies and scripts use exact official versions and the portable launcher', async () => {
  const manifest = await readJson('package.json');
  assert.equal(manifest.devDependencies['@stryker-mutator/core'], '10.0.0');
  assert.equal(manifest.devDependencies['@stryker-mutator/tap-runner'], '10.0.0');
  assert.equal(manifest.scripts['test:mutation'], 'node scripts/run-mutation.mjs');
  assert.equal(manifest.scripts['test:mutation:dry'], 'node scripts/run-mutation.mjs --dry-run');
});

test('mutation scope includes both real policy modules and all independent policy properties', async () => {
  assert.ok(existsSync('stryker.config.json'), 'Scoped Stryker configuration is missing');
  const config = await readJson('stryker.config.json');
  assert.deepEqual(config.mutate, ['src/lib/site-config.mjs', 'src/lib/scenario-rules.mjs']);
  assert.equal(config.testRunner, 'tap');
  assert.deepEqual(config.plugins, ['@stryker-mutator/tap-runner']);
  assert.equal(config.coverageAnalysis, 'perTest');
  assert.equal(config.ignoreStatic, true);
  assert.equal(config.concurrency, 1);
  assert.equal(config.incremental, false);
  assert.equal(config.inPlace, false);
  assert.deepEqual(config.tap.testFiles, [
    'tests/config.test.mjs',
    'tests/scenarios.test.mjs',
    'tests/actual-contracts.pbt.test.mjs',
  ]);
  assert.deepEqual(config.tap.nodeArgs, [
    '--test-reporter=tap',
    '-r',
    '{{hookFile}}',
    '{{testFile}}',
  ]);
  assert.equal(config.tap.forceBail, true);
  assert.deepEqual(config.reporters, ['clear-text', 'progress', 'html', 'json']);
  assert.equal(config.htmlReporter.fileName, 'reports/mutation/index.html');
  assert.equal(config.jsonReporter.fileName, 'reports/mutation/mutation.json');
  assert.deepEqual(config.thresholds, { high: 80, low: 60, break: null });
  assert.equal(config.mutator?.excludedMutations?.length ?? 0, 0);
  for (const generated of [
    'dist/**',
    'node_modules/**',
    '.astro/**',
    'evidence/**',
    'deliverables/**',
    'reports/**',
    'test-results/**',
    'playwright-report/**',
    'deploy/generated/**',
  ])
    assert.ok(
      config.ignorePatterns.includes(generated),
      `${generated} must stay outside the sandbox`,
    );
});

test('mutation launcher sets deterministic defaults and uses the known Stryker Node executable', async () => {
  const { mutationPlan, runCommands } = await launcher();
  const runner = await import('../scripts/astro.mjs');
  assert.equal(runCommands, runner.runCommands);
  const env = { PATH: process.env.PATH, PRESERVED_VALUE: 'space ; $(literal) ü' };
  const plan = mutationPlan([], env);
  assert.deepEqual(env, { PATH: process.env.PATH, PRESERVED_VALUE: 'space ; $(literal) ü' });
  assert.deepEqual(plan.env, { ...env, FC_SEED: '20261006', FC_NUM_RUNS: '100' });
  assert.equal(plan.steps.length, 1);
  assert.equal(plan.steps[0][0], process.execPath);
  assert.match(plan.steps[0][1], /@stryker-mutator[/\\]core[/\\]bin[/\\]stryker\.js$/);
  assert.deepEqual(plan.steps[0].slice(2), ['run', 'stryker.config.json']);
  assert.deepEqual(mutationPlan(['--dry-run'], env).steps[0].slice(2), [
    'run',
    'stryker.config.json',
    '--dryRunOnly',
  ]);
});

test('mutation launcher validates property controls and rejects narrow replay or scope overrides', async () => {
  const { mutationPlan } = await launcher();
  const env = { FC_SEED: '-2147483648', FC_NUM_RUNS: '25' };
  assert.deepEqual(mutationPlan([], env).env, env);
  for (const FC_NUM_RUNS of ['0', '-1', '1.5', '', '9007199254740992'])
    assert.throws(() => mutationPlan([], { FC_NUM_RUNS }), /FC_NUM_RUNS/);
  for (const FC_SEED of ['2147483648', '-2147483649', '1.5', '', ' 1'])
    assert.throws(() => mutationPlan([], { FC_SEED }), /FC_SEED/);
  for (const FC_PATH of ['', '0', '0:1'])
    assert.throws(() => mutationPlan([], { FC_PATH }), /FC_PATH.*authoritative/);
  for (const args of [
    ['--mutate', 'other.mjs'],
    ['--dry-run', '--dry-run'],
    ['--thresholds.break', '0'],
  ])
    assert.throws(() => mutationPlan(args, {}), /Unsupported mutation arguments/);
});

import { mkdtemp, mkdir, cp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const dir = await mkdtemp(join(tmpdir(), 'aicm-canonical-fault-'));
try {
  await mkdir(join(dir, 'src/lib'), { recursive: true });
  await mkdir(join(dir, 'tests'));
  await cp('src/lib/site-config.mjs', join(dir, 'src/lib/site-config.mjs'));
  await cp('tests/config.test.mjs', join(dir, 'tests/config.test.mjs'));
  const path = join(dir, 'src/lib/site-config.mjs');
  const original = await readFile(path, 'utf8');
  const needle = 'return `${url.origin}${pathname}`;';
  if (!original.includes(needle)) throw new Error('Canonical mutation target not found');
  await writeFile(path, original.replace(needle, 'return url.href;'));
  const run = spawnSync(
    process.execPath,
    [
      '--test',
      '--test-name-pattern=canonical strips queries and fragments without switching hosts',
      'tests/config.test.mjs',
    ],
    { cwd: dir, encoding: 'utf8' },
  );
  if (run.status === 0 || !run.stdout.includes('utm_source'))
    throw new Error(`Fault did not fail for expected query leakage: ${run.stdout}\n${run.stderr}`);
  console.log(
    'Deliberate canonical-query-leak fault was detected (expected failed assertion). Production source was never modified.',
  );
  await mkdir(join(dir, 'src/data'), { recursive: true });
  await cp('src/data/scenarios.mjs', join(dir, 'src/data/scenarios.mjs'));
  await cp('src/lib/scenario-rules.mjs', join(dir, 'src/lib/scenario-rules.mjs'));
  await cp('tests/scenarios.test.mjs', join(dir, 'tests/scenarios.test.mjs'));
  await cp('tests/fixture-policy.mjs', join(dir, 'tests/fixture-policy.mjs'));
  const fixturePath = join(dir, 'src/data/scenarios.mjs');
  const fixtureSource = await readFile(fixturePath, 'utf8');
  const start = fixtureSource.indexOf("id: 'prize-invitation'");
  const end = fixtureSource.indexOf("id: 'quoted-insult'", start);
  const section = fixtureSource.slice(start, end);
  if (!section.includes("outcome: 'action'")) throw new Error('Prize mutation target not found');
  await writeFile(
    fixturePath,
    fixtureSource.slice(0, start) +
      section.replace("outcome: 'action'", "outcome: 'allow'") +
      fixtureSource.slice(end),
  );
  const policy = spawnSync(
    process.execPath,
    [
      '--test',
      '--test-name-pattern=every fixture decision matches the independent published policy',
      'tests/scenarios.test.mjs',
    ],
    { cwd: dir, encoding: 'utf8' },
  );
  if (policy.status === 0 || !policy.stdout.includes('prize-invitation / stricter'))
    throw new Error(`Policy fault was not detected: ${policy.stdout}\n${policy.stderr}`);
  console.log(
    'Deliberate prize-action→allow fault was detected by the independent 10×2 policy oracle. Production fixtures were never modified.',
  );
} finally {
  await rm(dir, { recursive: true, force: true });
}

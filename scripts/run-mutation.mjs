import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCommands } from './astro.mjs';
import { propertyOptions } from '../tests/helpers/property-options.mjs';

export { runCommands };

export function mutationPlan(args = [], env = process.env) {
  if (args.length > 1 || (args.length === 1 && args[0] !== '--dry-run'))
    throw new Error('Unsupported mutation arguments: only --dry-run is allowed');
  if (env.FC_PATH !== undefined)
    throw new Error('FC_PATH is not allowed for an authoritative mutation run');
  const controls = { FC_SEED: '20261006', FC_NUM_RUNS: '100', ...env };
  propertyOptions(controls);
  const bin = fileURLToPath(
    new URL('./bin/stryker.js', import.meta.resolve('@stryker-mutator/core/package.json')),
  );
  const options = args.length ? ['--dryRunOnly'] : [];
  return {
    env: controls,
    steps: [[process.execPath, bin, 'run', 'stryker.config.json', ...options]],
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const plan = mutationPlan(process.argv.slice(2));
    process.exitCode = await runCommands(plan.steps, plan.env);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

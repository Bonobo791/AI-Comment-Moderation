import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
const workflow = await readFile('.github/workflows/checks.yml', 'utf8');
async function checker() {
  assert.ok(
    existsSync('scripts/ci-policy.mjs'),
    'Structured verification-workflow policy is missing',
  );
  return (await import('../scripts/ci-policy.mjs')).assertVerificationWorkflow;
}
test('the selected source/browser/container workflow uses only nonpublishing actions and bounded artifacts', async () => {
  const check = await checker();
  assert.doesNotThrow(() => check(workflow));
});
test('the workflow policy detects a build-push action even with no docker push CLI text', async () => {
  const check = await checker();
  const changed = workflow.replace(
    'steps:',
    'steps:\n      - uses: docker/build-push-action@' +
      'a'.repeat(40) +
      '\n        with:\n          push: true',
  );
  assert.throws(() => check(changed), /Unapproved CI action/);
});
test('the workflow policy rejects privileged triggers and unbounded or hidden-file evidence', async () => {
  const check = await checker();
  assert.throws(
    () => check(workflow.replace('[push, pull_request]', '[push, pull_request_target]')),
    /trigger/,
  );
  assert.throws(
    () => check(workflow.replace('retention-days: 7', 'retention-days: 90')),
    /retention/,
  );
  assert.throws(
    () => check(workflow.replace('include-hidden-files: false', 'include-hidden-files: true')),
    /hidden/,
  );
  assert.throws(() => check(workflow.replace('evidence/desktop.png', '.env')), /artifact path/);
});
test('the workflow policy rejects missing verification jobs and unbounded execution', async () => {
  const check = await checker();
  assert.throws(
    () => check('on: [push, pull_request]\npermissions:\n  contents: read\njobs: {}'),
    /verification jobs/,
  );
  assert.throws(
    () => check(workflow.replace('timeout-minutes: 12', 'timeout-minutes: 360')),
    /timeout/,
  );
  assert.throws(() => check('null'), /verification workflow/);
});

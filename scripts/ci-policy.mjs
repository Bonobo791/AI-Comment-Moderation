import { parseDocument } from 'yaml';

const approvedActions = new Set([
  'actions/checkout',
  'actions/setup-node',
  'actions/upload-artifact',
]);
const browserPaths = new Set([
  'test-results/',
  'playwright-report/',
  'evidence/desktop.png',
  'evidence/mobile.png',
]);

/** Validate this project's verification-only workflow, not arbitrary GitHub workflows. */
export function assertVerificationWorkflow(source) {
  const document = parseDocument(source, { uniqueKeys: true });
  if (document.errors.length) throw new Error('Invalid verification workflow YAML');
  const workflow = document.toJS({ maxAliasCount: 100 });
  if (!workflow || typeof workflow !== 'object' || Array.isArray(workflow))
    throw new Error('Invalid verification workflow YAML');
  const triggers = Array.isArray(workflow.on) ? workflow.on : Object.keys(workflow.on ?? {});
  if (!triggers.length || triggers.some((event) => !['push', 'pull_request'].includes(event)))
    throw new Error('Unapproved verification workflow trigger');
  if (workflow.permissions?.contents !== 'read' || Object.keys(workflow.permissions).length !== 1)
    throw new Error('Verification workflow permissions must stay contents: read');
  if (!workflow.jobs?.check || !workflow.jobs?.container)
    throw new Error('Required source and container verification jobs are missing');
  for (const job of Object.values(workflow.jobs ?? {})) {
    if (
      !Number.isInteger(job['timeout-minutes']) ||
      job['timeout-minutes'] < 1 ||
      job['timeout-minutes'] > 15
    )
      throw new Error('Verification job timeout must be bounded to fifteen minutes');
    if (!Array.isArray(job.steps) || !job.steps.length)
      throw new Error('Verification jobs require actual steps');
    if (job.permissions && Object.values(job.permissions).some((value) => value !== 'read'))
      throw new Error('Verification job must not request write permissions');
    for (const step of job.steps ?? []) {
      if (step.uses) {
        const match = /^([^@]+)@([a-f0-9]{40})$/.exec(step.uses);
        if (!match || !approvedActions.has(match[1])) throw new Error('Unapproved CI action');
        if (step.with?.push === true || step.with?.push === 'true')
          throw new Error('CI image publication is not selected');
        if (match[1] === 'actions/upload-artifact') {
          if (
            !Number.isInteger(step.with?.['retention-days']) ||
            step.with['retention-days'] < 1 ||
            step.with['retention-days'] > 7
          )
            throw new Error('Browser evidence retention must be bounded to seven days');
          if (step.with?.['include-hidden-files'] !== false)
            throw new Error('Browser evidence must exclude hidden files');
          const paths = String(step.with?.path ?? '')
            .trim()
            .split(/\r?\n/)
            .map((path) => path.trim());
          if (paths.some((path) => !browserPaths.has(path)))
            throw new Error('Unapproved browser artifact path');
        }
      }
      if (
        /\b(?:docker|podman)\s+(?:push|login)\b|\b(?:docker|podman)\b[^\n]*--push\b|\bnpm\s+publish\b/.test(
          step.run ?? '',
        )
      )
        throw new Error('Verification workflow contains a publication command');
    }
  }
}

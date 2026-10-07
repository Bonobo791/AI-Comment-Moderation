import { scenarios } from '../data/scenarios.mjs';

/** @param {{ id?: string } | undefined} fixture @param {string} mode */
export function evaluateScenario(fixture, mode) {
  if (mode !== 'cautious' && mode !== 'stricter') throw new Error('Unknown review mode');
  const scenario = scenarios.find((entry) => entry.id === fixture?.id);
  if (!scenario) throw new Error('Unknown fictional fixture');
  return { ...scenario.decisions[mode] };
}

export function resetDemo() {
  return { scenarioId: 'audio-criticism', mode: 'cautious' };
}

const workflows = {
  youtube: {
    title: 'Start with YouTube Studio',
    nextStep:
      'Choose native comment settings and a review routine. Add a dedicated tool only if you need more rules, a queue or feedback summaries.',
    moderaty: true,
    anchor: '#native-settings',
  },
  social: {
    title: 'Check support for the exact social platform',
    nextStep:
      'List the accounts and comment surfaces you need, then verify permissions, ad-comment support and human review with the provider.',
    moderaty: false,
    anchor: '#other-platforms',
  },
  cms: {
    title: 'Choose a workflow for your website or CMS',
    nextStep:
      'Keep comment submission, held queues and moderator permissions inside your publishing system. Review plugin maintenance and data handling before installation.',
    moderaty: false,
    anchor: '#other-platforms',
  },
  api: {
    title: 'Design an API and human-review integration',
    nextStep:
      'An engineer needs to define your policy, provider data flow, failure behavior and moderation actions. A classification result alone does not change a comment.',
    moderaty: false,
    anchor: '#other-platforms',
  },
};
/** @param {string} category */
export function workflowFor(category) {
  if (!Object.hasOwn(workflows, category)) throw new Error('Unknown workflow category');
  return { ...workflows[/** @type {keyof typeof workflows} */ (category)] };
}

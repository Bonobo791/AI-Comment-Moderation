export const FIXTURE_VERSION = '1.0.0';

/** @typedef {{ outcome: 'allow'|'review'|'action', reason: string }} Decision */
/** @typedef {{ id: string, label: string, text: string, context: string, dimension: string, missingContext: string, synthetic: boolean, requiresContext: boolean, decisions: { cautious: Decision, stricter: Decision } }} Scenario */
/** @type {Scenario[]} */
export const scenarios = [
  {
    id: 'audio-criticism',
    label: 'Constructive criticism',
    text: 'The music covers your voice at 02:10. Could you lower it in the next video?',
    context: 'A viewer names a specific audio problem and asks for a change.',
    dimension: 'Criticism versus personal abuse',
    missingContext:
      'No personal attack appears in this example. A reviewer can check the named timestamp.',
    synthetic: true,
    requiresContext: false,
    decisions: {
      cautious: {
        outcome: 'allow',
        reason:
          'Keep the feedback. A negative experience and a specific request do not breach this example policy.',
      },
      stricter: {
        outcome: 'allow',
        reason:
          'Keep the feedback in stricter mode too. A policy should preserve useful criticism.',
      },
    },
  },
  {
    id: 'repeated-promotion',
    label: 'Repeated promotion',
    text: 'Check out my course at https://promotion.example.invalid. I pasted this on five videos.',
    context: 'The fictional comment includes an unrelated promotion and states that it repeats.',
    dimension: 'Unrelated commercial promotion',
    missingContext:
      'Check whether you invited recommendations and whether the promotion relates to the discussion.',
    synthetic: true,
    requiresContext: false,
    decisions: {
      cautious: {
        outcome: 'review',
        reason:
          'Review the promotion against your community rule. A link alone is incomplete evidence of spam.',
      },
      stricter: {
        outcome: 'action',
        reason:
          'This example rule flags repeated, unrelated promotion for possible removal. A real moderator or connected tool must take any action.',
      },
    },
  },
  {
    id: 'prize-invitation',
    label: 'Prize invitation',
    text: 'You won a prize! Pay a collection fee at https://prize.example.invalid to claim it.',
    context: 'A fictional unsolicited prize message asks the viewer to pay a fee.',
    dimension: 'Scam-like solicitation',
    missingContext:
      'An example cannot verify an offer or sender. Use your platform reporting process for suspected scams.',
    synthetic: true,
    requiresContext: false,
    decisions: {
      cautious: {
        outcome: 'review',
        reason:
          'Prioritize review of the unsolicited payment request. Do not visit or send money to an unverified offer.',
      },
      stricter: {
        outcome: 'action',
        reason:
          'This example rule flags an unsolicited prize-fee request for possible removal. Nothing is removed by this demo.',
      },
    },
  },
  {
    id: 'quoted-insult',
    label: 'Reported insult',
    text: 'Someone called the host an [insult]. That is unfair. Can a moderator check that reply?',
    context:
      'The viewer reports harmful wording rather than directing it at the host. The insult is sanitized.',
    dimension: 'Quotation and reporting',
    missingContext: 'The reviewer needs the original reply and surrounding conversation.',
    synthetic: true,
    requiresContext: true,
    decisions: {
      cautious: {
        outcome: 'review',
        reason:
          'Read the thread before deciding. Reporting an insult can trigger a keyword rule even when the viewer opposes it.',
      },
      stricter: {
        outcome: 'review',
        reason:
          'Keep this in contextual review. Stricter filtering does not establish the viewer’s intent.',
      },
    },
  },
  {
    id: 'friendly-teasing',
    label: 'Friendly teasing',
    text: 'You absolute potato. Same time next week?',
    context: 'The words could be affectionate teasing or an unwelcome personal remark.',
    dimension: 'Relationship context',
    missingContext: 'The relationship, earlier messages and recipient’s preference are unknown.',
    synthetic: true,
    requiresContext: true,
    decisions: {
      cautious: {
        outcome: 'review',
        reason: 'Ask for context before treating the phrase as either harmless or abusive.',
      },
      stricter: {
        outcome: 'review',
        reason:
          'A stricter rule still needs the relationship context. Do not infer consent from the tone alone.',
      },
    },
  },
  {
    id: 'heated-disagreement',
    label: 'Heated disagreement',
    text: 'I strongly disagree with your conclusion. Your own chart shows the opposite.',
    context: 'A viewer disputes the argument and points to evidence without a personal attack.',
    dimension: 'Disagreement and evidence',
    missingContext:
      'A reviewer may want to check the chart. Disagreement alone is not a breach of this policy.',
    synthetic: true,
    requiresContext: false,
    decisions: {
      cautious: {
        outcome: 'allow',
        reason:
          'Allow the disagreement. The viewer challenges the claim rather than attacking a person.',
      },
      stricter: {
        outcome: 'allow',
        reason:
          'Keep evidence-based disagreement in the conversation, even when it sounds frustrated.',
      },
    },
  },
  {
    id: 'harmless-blocked-word',
    label: 'Harmless blocked word',
    text: 'That was a killer guitar solo. Which pedal did you use?',
    context: 'The example’s stricter keyword rule flags the word “killer” in a music discussion.',
    dimension: 'Keyword false positive',
    missingContext:
      'The music context gives the word a harmless meaning; an exact-word filter may miss that.',
    synthetic: true,
    requiresContext: false,
    decisions: {
      cautious: {
        outcome: 'allow',
        reason: 'Keep the music question. Here, “killer” expresses praise.',
      },
      stricter: {
        outcome: 'review',
        reason:
          'The stricter keyword rule sends this harmless use to review. This is an illustrative false positive, not proof of abuse.',
      },
    },
  },
  {
    id: 'ambiguous-hostility',
    label: 'Ambiguous phrase',
    text: 'You will regret that choice.',
    context: 'The viewer might mean a poor purchase decision or a hostile warning.',
    dimension: 'Missing context',
    missingContext: 'The reviewer needs the topic, thread and any pattern of targeting.',
    synthetic: true,
    requiresContext: true,
    decisions: {
      cautious: {
        outcome: 'review',
        reason:
          'Prioritize contextual review. The text alone does not establish which meaning the viewer intended.',
      },
      stricter: {
        outcome: 'review',
        reason: 'Keep human review required. A stronger filter cannot fill in missing context.',
      },
    },
  },
  {
    id: 'repeated-praise',
    label: 'Identical praise',
    text: 'Amazing video! Thanks for sharing.',
    context: 'Several fictional accounts post the same short compliment.',
    dimension: 'Repetition and coordinated spam',
    missingContext:
      'Account behavior and frequency are unknown. Common wording alone does not prove coordination.',
    synthetic: true,
    requiresContext: false,
    decisions: {
      cautious: {
        outcome: 'allow',
        reason:
          'Allow the benign words while checking broader patterns if repetition becomes a problem.',
      },
      stricter: {
        outcome: 'review',
        reason:
          'Review the repetition under this stricter example policy. Do not accuse the accounts based only on matching text.',
      },
    },
  },
  {
    id: 'product-complaint',
    label: 'Product complaint',
    text: 'The app lost my draft twice. I need a fix before I can recommend it.',
    context: 'A customer describes a specific failure and withholds a recommendation.',
    dimension: 'Reputation versus safety',
    missingContext: 'A support team can investigate the failure without suppressing the comment.',
    synthetic: true,
    requiresContext: false,
    decisions: {
      cautious: {
        outcome: 'allow',
        reason:
          'Preserve the complaint. Protecting a product’s reputation is not a reason to hide useful feedback.',
      },
      stricter: {
        outcome: 'allow',
        reason:
          'Keep the complaint in stricter mode. No abuse or unsolicited promotion appears here.',
      },
    },
  },
];

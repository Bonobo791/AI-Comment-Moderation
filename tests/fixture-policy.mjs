// Independent contract from the written scenario specification, not generated from data.
export const expectedPolicy = {
  'audio-criticism': { cautious: 'allow', stricter: 'allow' },
  'repeated-promotion': { cautious: 'review', stricter: 'action' },
  'prize-invitation': { cautious: 'review', stricter: 'action' },
  'quoted-insult': { cautious: 'review', stricter: 'review' },
  'friendly-teasing': { cautious: 'review', stricter: 'review' },
  'heated-disagreement': { cautious: 'allow', stricter: 'allow' },
  'harmless-blocked-word': { cautious: 'allow', stricter: 'review' },
  'ambiguous-hostility': { cautious: 'review', stricter: 'review' },
  'repeated-praise': { cautious: 'allow', stricter: 'review' },
  'product-complaint': { cautious: 'allow', stricter: 'allow' },
};

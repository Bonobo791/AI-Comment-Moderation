import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'evidence/**',
      'test-results/**',
      'playwright-report/**',
      'deliverables/**',
    ],
  },
  js.configs.recommended,
  ...astro.configs.recommended,
  { files: ['**/*.astro'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
];

import { defineConfig } from 'astro/config';
import { siteConfig } from './src/lib/site-config.mjs';
import { sourceCommit } from './src/lib/build-provenance.mjs';
const config = siteConfig(process.env);
sourceCommit(process.env);
export default defineConfig({
  site: config.origin,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});

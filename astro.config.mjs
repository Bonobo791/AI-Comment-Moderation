import { defineConfig } from 'astro/config';
import { siteConfig } from './src/lib/site-config.mjs';
const config = siteConfig(process.env);
export default defineConfig({
  site: config.origin,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});

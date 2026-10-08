import node from '@astrojs/node';
import { defineConfig } from 'astro/config';
import { siteConfig } from './src/lib/site-config.mjs';
import { sourceCommit } from './src/lib/build-provenance.mjs';
try {
  process.loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const config = siteConfig(process.env);
sourceCommit(process.env);
export default defineConfig({
  site: config.origin,
  output: 'static',
  adapter: node({ mode: 'standalone', staticHeaders: true }),
  session: false,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Coolify Docker build is locked, preview-safe and static-only at runtime', async () => {
  const docker = await readFile('Dockerfile', 'utf8');
  assert.match(docker, /FROM node:24\.19\.0-bookworm-slim AS build/);
  assert.match(docker, /ARG SITE_RELEASE=false/);
  assert.match(docker, /RUN npm ci/);
  assert.match(docker, /FROM nginx:1\.30\.5-alpine AS runtime/);
  assert.match(docker, /COPY --from=build \/app\/dist/);
  assert.match(docker, /USER nginx/);
  assert.match(docker, /EXPOSE 8080/);
  assert.match(docker, /HEALTHCHECK/);
  assert.doesNotMatch(docker, /npm start|astro preview|COPY.*\.env/);
});
test('static Nginx uses real errors, no SPA homepage fallback, safe headers and no access logs', async () => {
  const nginx = await readFile('deploy/nginx.conf', 'utf8');
  assert.match(nginx, /listen 8080;/);
  assert.match(nginx, /error_page 404 \/404\.html;/);
  assert.match(nginx, /try_files \$uri \$uri\/index\.html =404;/);
  assert.match(nginx, /location = \/healthz/);
  assert.match(nginx, /include \/etc\/nginx\/security-headers\.conf;/);
  assert.match(nginx, /access_log off;/);
  assert.doesNotMatch(nginx, /try_files[^;]* \/index\.html;/);
});

# Coolify hosting preparation

Prepared 6 October 2026. Configuration is ready for a container-capable review environment; Docker/Nginx runtime execution and Coolify deployment are **not verified**. No Docker, Podman or nginx executable is available in this workspace. No Coolify UI, SSH, DNS, production service or repository push was used.

## Selected build method

Use Coolify’s **Dockerfile** build pack for this source repository. The multi-stage Dockerfile installs from the npm lockfile, runs real source checks and builds Astro, then copies only the static output into Nginx. No Node server, development preview process, provider credential, database or writable content volume is needed at runtime.

Coolify’s Static build pack packages files already present in a repository and does not run a framework build. This repository intentionally ignores `dist/`, so choosing Static directly would omit the built website. [Current Static docs](https://coolify.io/docs/applications/builds/static), [Dockerfile docs](https://coolify.io/docs/applications/builds/dockerfile).

## Settings for a separately authorized deployment

| Setting                         | Value                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| Repository                      | Bonobo791/AI-Comment-Moderation, after an authorized push                             |
| Build pack                      | Dockerfile                                                                            |
| Base Directory                  | `/`                                                                                   |
| Dockerfile Location             | `/Dockerfile`                                                                         |
| Ports Exposes                   | `8080`                                                                                |
| Domain                          | `https://aicommentmoderation.com` only when public release is authorized              |
| SITE_URL                        | `https://aicommentmoderation.com`, Build Variable enabled                             |
| SITE_RELEASE                    | `false` for preview; explicit `true` only for approved public release                 |
| Runtime variables/secrets       | None required                                                                         |
| Persistent storage              | None                                                                                  |
| Pre/post-deployment commands    | None                                                                                  |
| Inject Build Args to Dockerfile | Disable automatic injection; the Dockerfile already declares the required public ARGs |
| Health                          | Image-owned HTTP `/healthz` on internal port 8080                                     |

The process listens on all interfaces on port 8080. Nginx runs as the existing `nginx` user and writes its PID/temp files in `/tmp`. The final image contains the BusyBox wget/grep commands used by its health check. Coolify detects an image HEALTHCHECK for a non-Compose Dockerfile application, so do not expect a dashboard check to override it. [Health documentation](https://coolify.io/docs/applications/configuration/health-checks), [variable scopes](https://coolify.io/docs/applications/configuration/environment-variables).

These are source instructions, not a record that those UI settings were changed.

## Build and smoke commands in a permitted container environment

```sh
docker build --build-arg SITE_URL=https://aicommentmoderation.com \
  --build-arg SITE_RELEASE=false -t aicommentmoderation:preview .
docker run --rm --entrypoint nginx aicommentmoderation:preview -t
docker run --rm -d --name aicm-preview -p 127.0.0.1:8080:8080 aicommentmoderation:preview
docker inspect --format '{{json .State.Health}}' aicm-preview
node scripts/smoke-host.mjs http://127.0.0.1:8080
docker stop aicm-preview
```

Run those commands against an isolated local preview, not production. They remain unrun here. A health success proves the static server/health file responds; it does not prove crawler access, UI correctness, TLS, privacy or deployed source identity.

## Server behavior

- Unknown paths use a real 404 error page; there is no SPA/homepage fallback
- The 404 file is internal and has no homepage canonical; errors receive noindex/no-store
- Hashed `/_astro/` assets cache for a year; ordinary documents revalidate
- CSP hashes come from the exact built inline scripts, preserving the navigation script without unsafe-inline
- Security headers include CSP, nosniff, Referrer-Policy, frame denial and limited permissions; locations with their own add_header repeat the security include to preserve Nginx inheritance
- Container access logs are disabled; warning/error logs and Coolify/proxy logs still need an actual retention/privacy review
- Health is an operational exception, excluded from the sitemap

Nginx directive references: [try_files/error_page](https://nginx.org/en/docs/http/ngx_http_core_module.html), [header inheritance/always](https://nginx.org/en/docs/http/ngx_http_headers_module.html).

The container does not force HTTPS using its internal HTTP scheme. Coolify’s authorized proxy must terminate TLS, handle HTTP/apex/www redirects and isolate previews. HSTS should be added only after that TLS/hostname policy is verified. Serve the website at the apex root; a path-prefix deployment is not supported by this build.

## Image and reproducibility limits

The build uses version-pinned `node:24.19.0-bookworm-slim` to match the tested local runtime and `nginx:1.30.5-alpine`. The current [official image manifest](https://github.com/docker-library/official-images/blob/master/library/nginx) lists the Nginx tag. Current Node manifest lists newer 24.21 releases rather than the historical 24.19 tag; the official historical Dockerfile at nodejs/docker-node commit 36fd5916b750 confirms the 24.19.0 Bookworm-slim build, while registry pull/digest retrieval was unavailable. A container operator must verify both pulls and pin approved immutable digests before a production release. No digest, successful image build or security scan is fabricated.

The npm lockfile is frozen and local clean install/checks are verified. Container-layer reproducibility still needs actual image resolution/build evidence. Updating a Node image also requires updating/test-running runtime pins and CI, rather than hiding an engine mismatch.

## Remaining release gates

Browser/visual/keyboard/200% zoom evidence, image build/Nginx syntax/smoke tests, legal operator/contact/license, public content review, Coolify access and explicit push/deployment/DNS approval, actual TLS/redirect/header/privacy/crawler behavior and CI remain pending. Do not set SITE_RELEASE=true on an unprotected external preview or treat an indexable artifact as permission to publish.

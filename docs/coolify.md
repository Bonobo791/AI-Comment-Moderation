# Coolify hosting preparation

Reviewed 6 October 2026. The owner authorized review-branch publication and [draft PR #1](https://github.com/Bonobo791/AI-Comment-Moderation/pull/1). At published head [de0ba448](https://github.com/Bonobo791/AI-Comment-Moderation/commit/de0ba448cb3e6a6fe39565e11ed9d23551d48cc6), both the [push CI run](https://github.com/Bonobo791/AI-Comment-Moderation/actions/runs/37536172124) and [PR CI run](https://github.com/Bonobo791/AI-Comment-Moderation/actions/runs/37537165673) passed a real Docker build, `nginx -t`, image health and isolated HTTP smoke. Later revisions require their own exact-head checks; consult the draft PR for current results.

No Docker, Podman or nginx executable is available in this workspace. No Coolify UI, SSH, DNS, production service or deployment was changed. Actual Coolify proxy/TLS and deployed-host behavior remain unverified.

## Selected build method

Use Coolify’s **Dockerfile** build pack for this source repository. The multi-stage Dockerfile installs from the npm lockfile, runs real source checks and builds Astro, then copies only the static output into Nginx. No Node server, development preview process, provider credential, database or writable content volume is needed at runtime.

Coolify’s Static build pack packages files already present in a repository and does not run a framework build. This repository intentionally ignores `dist/`, so choosing Static directly would omit the built website. [Current Static docs](https://coolify.io/docs/applications/builds/static), [Dockerfile docs](https://coolify.io/docs/applications/builds/dockerfile).

## Settings for a separately authorized deployment

| Setting                         | Value                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| Repository                      | Bonobo791/AI-Comment-Moderation, at the separately approved release commit            |
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

Run those commands against an isolated preview. The CI equivalents passed at the published head; local execution remains unavailable. A health success proves the static server/health file responds; it does not prove crawler access, UI correctness, TLS, privacy or deployed source identity.

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

The build uses version-pinned `node:24.19.0-bookworm-slim` to match the tested runtime and `nginx:1.30.5-alpine`. The published-head CI build resolved:

- `node:24.19.0-bookworm-slim`: `sha256:a9f5f7c91a432850b2a8a7797adf5eadb6c733ceed61167806cee7ea7fbc29df`
- `nginx:1.30.5-alpine`: `sha256:0985e772fb9f729e6fa0980da05fca5d9c468e870eed43071545afa9d2e27d94`

These are observed CI resolutions. The Dockerfile still uses tags; a production operator must verify and pin approved immutable digests before release. No vulnerability scan is claimed. The npm lockfile and isolated container build passed at the published head. Updating a Node image requires updating and testing runtime pins and CI too.

## Remaining release gates

Automated Chromium/axe and isolated container checks passed at the published head. Manual screenshots, focus/assistive-technology/200% zoom review, legal operator/contact/license, public content review, Coolify access and explicit deployment/DNS approval remain pending. The release commit needs its own CI result and deployed identity/proxy/TLS/redirect/header/privacy/crawler verification. Do not set SITE_RELEASE=true on an unprotected external preview or treat an indexable artifact as permission to publish.

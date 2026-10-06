# Verification record

Original local artifact review date: 6 October 2026. The current build includes the guide and Coolify files-only preparation. No remote push, publication, DNS, account, credential or production action occurred.

## Passed

- Clean npm ci completed with 419 packages from the committed lockfile; lock SHA remained 3ebc9e52b7ade372ceecb0b96aa76dee1a3da12bf8eb999672b6e31007d8814b
- Final Astro check: 12 source files, zero errors, warnings or hints
- Final ESLint and Prettier checks passed
- Normal Node suite: 22 tests, 22 passed; includes four fast-check properties
- Focused FC_NUM_RUNS=1000 suite: 22/22 passed; four properties sampled 1000 runs each
- Both deliberate-fault checks failed as intended in disposable copies: canonical query leakage and prize-action→allow; original source was never mutated
- Static production build passed; eleven section anchors, ten pre-rendered fictional cases, one canonical/sitemap URL, twelve output files totalling 132153 bytes
- Built-DOM integration suite: 4/4 passed, exercising compiled scripts, selection/policy/reset/scope, checklist/no-JS, restored controls and navigation state
- Artifact-specific CSP generator covers index and 404; a distinct 404 inline-script regression failed before the fix and now passes
- Original 1200×630 social-card PNG pixels inspected; relevant text-color pairs manually calculated at 4.55–6.64:1
- Independent guide source review and separate Coolify source review found no remaining blocking source-level issue after corrections

The self-contained offline preview is 68632 bytes, SHA-256 85426de5925d7218ca0aba36f0eea1c9420ca1034812d8c65758d0abd696519b. It contains all guide styles/scripts and requires no server or runtime third-party asset. It is a noindex, unpublished preview.

## Blocked or not run

- CLI Chromium launch failed because the execution runtime denied its socket
- The supported cloud browser rejected the local preview route; offline file inspection was denied again after one authorization-evidence retry
- Playwright startup failed; real browser assertions, axe run, phone/desktop screenshots, keyboard focus/live-announcement checks, reduced motion, true 200% zoom and visual/performance QA are not claimed passed
- Docker, Podman and nginx executables are unavailable; image pulls/digests, docker build, nginx -t and real container HTTP smoke are not executed
- Coolify UI/SSH/production/DNS/deployment, public status/headers/TLS/redirects, actual CI/protections, crawler/indexing/AI settings and field metrics are unverified and unchanged
- Public license, guide legal operator/contact, selected host/privacy retention and release authorization remain pending

DOM tests prove DOM/script contracts, not a browser rendering engine, accessibility certification or Nginx HTTP behavior. Source/hosting configuration is prepared for a permitted review environment. Full UI/container/public readiness remains gated by the items above.

## Deliverables

Full original source with npm lockfile, tests, Docker/Nginx configuration and readable runbooks, plus the standalone offline HTML preview. Archive metadata records the local commit and built-file hashes. No screenshots were fabricated or substituted for real UI evidence.

## Review-branch publication

The owner subsequently authorized a source push for GitHub checks. Main and the owner’s README are preserved. The fuller developer guide is in docs/development.md. Browser preview now explicitly uses foreground --ignore-lock, based on the installed Astro CLI’s agent auto-background behavior. A disposable Docker/Nginx/health/HTTP CI job is included, with no image registry push or deployment. Remote commit, PR and actual CI status are reported separately; this original local record does not pre-claim their success.

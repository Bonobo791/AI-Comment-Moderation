# Verification record

Reviewed 6 October 2026. The owner authorized source publication on a review branch and a draft PR. Main and the owner's README remain preserved. No merge, deployment, DNS, account, credential or production action occurred.

## Published-head GitHub CI

The published review head is [de0ba448cb3e6a6fe39565e11ed9d23551d48cc6](https://github.com/Bonobo791/AI-Comment-Moderation/commit/de0ba448cb3e6a6fe39565e11ed9d23551d48cc6), in [draft PR #1](https://github.com/Bonobo791/AI-Comment-Moderation/pull/1). Both the [push run 37536172124](https://github.com/Bonobo791/AI-Comment-Moderation/actions/runs/37536172124) and [PR run 37537165673](https://github.com/Bonobo791/AI-Comment-Moderation/actions/runs/37537165673) succeeded for that source head.

- Clean install, Astro check, lint, formatting, deliberate-fault checks and static build passed
- The deterministic/property suite passed 25 tests, including four real fast-check properties
- The compiled-script DOM suite passed 4 tests
- Chromium passed 9 Playwright tests, including axe checks, 320/375/768/1280 responsive overflow checks, reduced motion, keyboard tasks, no-JS and failed-module fallback
- Docker built an isolated preview image; `nginx -t`, image health and HTTP root/assets/real-404/cache/security smoke passed
- Image resolution recorded `node:24.19.0-bookworm-slim` at `sha256:a9f5f7c91a432850b2a8a7797adf5eadb6c733ceed61167806cee7ea7fbc29df` and `nginx:1.30.5-alpine` at `sha256:0985e772fb9f729e6fa0980da05fca5d9c468e870eed43071545afa9d2e27d94`

Those results apply to the linked source head and isolated GitHub runners. Later revisions must establish their own exact-head CI result; consult the draft PR for the current source head and checks. The recorded image resolutions do not constitute a vulnerability scan or a digest-pinned production deployment.

## PR #1 local review corrections

This section records local triage on 6 October 2026, before its corrections were published. The prior head de0ba448 recorded a `javascript:S4624` CodeAnt antipattern failure. Its corrected remote result must be verified against the later source head, not inferred from this local record.

- Replaced POSIX environment prefixes in the five Astro npm commands with a dependency-free Node launcher. It preserves literal arguments, disables telemetry, shares release mode across all build stages, forwards interruption and stops after a failed stage. Linux subprocess tests pass; an actual Windows runtime has not been tested.
- Strengthened the build check to require all ten real fixture articles inside the readable example grid, including comment text, context and both policy explanations. Tests reject missing/misplaced articles and incomplete content even when select-option IDs remain.
- Restored an inward visible outline for the keyboard skip target and added computed-outline assertions to the existing browser test. The revised real-browser test has not run locally.
- Rejected explicit default `:443` origins as well as non-default ports, matching the documented exact literal apex constraint.
- Added the missing DOM command to AGENTS and corrected stale verification documentation without replacing historical evidence.
- Fixed `javascript:S4624` in `scripts/package-preview.mjs` by reading the stylesheet path and content into separate variables before interpolation. Script escaping is unchanged. Against the same pre-triage built files, `cmp` verified byte-identical preview output: 68632 bytes and SHA-256 `85426de5925d7218ca0aba36f0eea1c9420ca1034812d8c65758d0abd696519b`.

Two suggestions did not warrant source changes. Amazon Q's healthcheck-injection claim was not reproduced: response bytes are grep input, with no shell-evaluation path. Gitar's punctuation claim contradicted the actual Astro compiler and built output, which attach the period directly to the correction link.

Local Astro check, ESLint, Prettier, all 40 deterministic/property tests, both deliberately wrong disposable fault checks, static build and all 4 compiled-DOM tests pass. New defect regressions were observed failing before their fixes. An independent final source review found no introduced blocking issue. The lockfile is unchanged. The current built output is 132194 bytes across twelve files; the regenerated offline preview is 68673 bytes, SHA-256 `ba765cc5a2a9fabed8d0878f1d1068b8fbb96827eb7015e61b6e97a5a82fab45`. Its extra bytes come from the focus-style correction, not the stylesheet-extraction refactor.

Fresh browser/container/CodeAnt results require an authorized push and exact-head checks. Historical successful CI is not a pass for later revisions. No public review replies, merge or deployment occurred during this triage.

## Original local artifact evidence

The following results describe the earlier local artifact, before review-branch publication. Counts, sizes and hashes remain historical evidence for that artifact.

- Clean npm ci completed with 419 packages from the committed lockfile; lock SHA remained 3ebc9e52b7ade372ceecb0b96aa76dee1a3da12bf8eb999672b6e31007d8814b
- Astro check: 12 source files, zero errors, warnings or hints
- ESLint and Prettier checks passed
- Normal Node suite: 22 tests, 22 passed; includes four fast-check properties
- Focused FC_NUM_RUNS=1000 suite: 22/22 passed; four properties sampled 1000 runs each
- Both deliberate-fault checks failed as intended in disposable copies: canonical query leakage and prize-action→allow; original source was never mutated
- Static production build passed; eleven section anchors, ten pre-rendered fictional cases, one canonical/sitemap URL, twelve output files totalling 132153 bytes
- Built-DOM integration suite: 4/4 passed, exercising compiled scripts, selection/policy/reset/scope, checklist/no-JS, restored controls and navigation state
- Artifact-specific CSP generator covers index and 404; a distinct 404 inline-script regression failed before the fix and now passes
- Original 1200×630 social-card PNG pixels inspected; relevant text-color pairs manually calculated at 4.55–6.64:1
- Independent guide source review and separate Coolify source review found no remaining blocking source-level issue after corrections

The original self-contained offline preview was 68632 bytes, SHA-256 85426de5925d7218ca0aba36f0eea1c9420ca1034812d8c65758d0abd696519b. It contained all guide styles/scripts and required no server or runtime third-party asset. It was a noindex, unpublished preview; these figures do not identify a later artifact.

## Local execution limits and remaining gates

- CLI Chromium launch failed because the execution runtime denied its socket
- The supported cloud browser rejected the local preview route; offline file inspection was denied again after one authorization-evidence retry
- Local Playwright startup failed; the successful Chromium/axe assertions above ran in GitHub CI, not this workspace
- Docker, Podman and nginx executables are unavailable locally; image build, syntax and HTTP checks above ran in GitHub CI
- Manual review of phone/desktop screenshots, visible focus and screen-reader announcements, assistive-technology testing, true 200% zoom and visual/performance QA remain pending
- Coolify UI/SSH/deployment, actual proxy/TLS/redirect/header behavior, deployed commit/artifact identity, protected preview access, host log retention, branch protections, crawler/indexing/AI settings and field metrics remain unverified
- Public license, guide legal operator/contact, selected host/privacy retention and release authorization remain pending

DOM tests establish DOM/script contracts. Chromium/axe and container smoke add browser and HTTP evidence in their tested environments. They do not establish accessibility certification or behavior on a future Coolify/public host.

## Deliverables

Full source with npm lockfile, tests, Docker/Nginx configuration and readable runbooks, plus the standalone offline HTML preview. Original archive metadata records its local commit and built-file hashes. No screenshots were fabricated or substituted for real UI evidence.

## Review-branch publication

The fuller developer guide is in docs/development.md. Browser preview uses foreground --ignore-lock, based on the installed Astro CLI's agent auto-background behavior. GitHub CI builds a disposable Docker/Nginx/health/HTTP preview with no image registry push or deployment. Source publication, exact-head CI, manual UI verification and public release remain separate approvals and evidence.

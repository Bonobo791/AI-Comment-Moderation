# Bootstrap status

Reviewed 6 October 2026. This is a static source build for AICommentModeration.com with an authorized review-branch publication and draft PR. The website has not been deployed.

## Published verification baseline

Published head [de0ba448cb3e6a6fe39565e11ed9d23551d48cc6](https://github.com/Bonobo791/AI-Comment-Moderation/commit/de0ba448cb3e6a6fe39565e11ed9d23551d48cc6) passed the [push workflow](https://github.com/Bonobo791/AI-Comment-Moderation/actions/runs/37536172124) and [PR workflow](https://github.com/Bonobo791/AI-Comment-Moderation/actions/runs/37537165673) in [draft PR #1](https://github.com/Bonobo791/AI-Comment-Moderation/pull/1). GitHub CI passed 25 deterministic/property tests, 4 compiled-DOM tests, 9 Chromium/axe tests and an isolated Docker build, Nginx syntax, health and HTTP/status/security smoke. Image digests and scope are in docs/verification.md.

The requirement status below uses that published baseline. Later review revisions require their own exact-head checks. Local Chromium/container limits still apply; manual screenshots, 200% zoom, assistive technology and actual Coolify/public-host behavior remain pending.

## Decision record

- Purpose: a broad useful guide, fictional preset decisions and a disclosed YouTube-only product path
- Stack: Astro 7.3.6 static output; Node 24.19.0/npm 11.9.0; one npm lockfile
- Compatibility: [Astro installation requirements](https://docs.astro.build/en/install-and-setup/) checked October 6; installed ESLint/Astro plugin requires Node ≥24.16; current runtime satisfies it
- Workspace: isolated local repository on build/local; the owner later authorized review-branch publication to Bonobo791/AI-Comment-Moderation; main and the owner's README remain preserved
- Bootstrap reference: Site-Bootstrap-ADM current/pinned 916df29d7410b4a9a5048ed69819b5da448a2ecf, AGENTS/shared/static/testing/example references inspected through GitHub; bundled reference access failed, so pinned public references supplied the evidence
- Host/provider/CMS/contact/analytics: none configured; source review publication only, with no account, database, paid AI or live channel access
- Origin: intended HTTPS apex, exact-host validation; default output noindex and robots disallow
- Scope/route/data/content records: docs/project-specification.md, routes.md, environment.md, data-inventory.md and content-evidence.md
- Browser evidence: automated Chromium/axe checks passed in GitHub CI. Local Chromium socket launch failed; supported cloud-browser local routes were blocked or denied. Manual visual/assistive-technology review and the deployed host remain unverified

## Requirement status

| IDs     | Status                                  | Evidence or blocker                                                                                       |
| ------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| C01–C06 | Verified local contracts                | Isolated inventory/pins/scripts/config; actual tests and failure boundaries                               |
| C07     | Published-head CI verified              | Both linked workflows passed at de0ba448; branch protections and later local edits are unverified         |
| C08     | Partly verified                         | Original clean source/assets; UNLICENSED until the owner chooses a public license                         |
| C09     | Verified source handoff                 | README, commands and separate gates recorded; no claim of browser-complete readiness                      |
| S01     | Verified build                          | Static output, intended origin and assets inspected                                                       |
| S02     | Automated browser checks verified       | DOM, responsive and keyboard CI passed; manual focus/announcements, assistive technology and zoom pending |
| S03     | Verified                                | Ten synthetic fixtures, complete fields, independent outcome table and primary claims                     |
| S04     | Not applicable                          | No CMS selected                                                                                           |
| S05     | Partly verified                         | Original assets/social pixels and responsive CI passed; manual screenshots/performance pending            |
| S06     | Verified built contracts                | One title/H1/canonical, truthful schema, one sitemap root, intentional preview robots/meta                |
| S07     | Isolated HTTP 404 verified              | Real 404 passed in browser/container CI; actual public host/redirects pending. No migration               |
| S08–S09 | Published browser/container CI verified | Built output, DOM, Chromium/axe and container smoke passed; manual/public-host checks pending             |
| T01–T04 | Verified                                | Normal deterministic/property discovery, independent invariants and replay controls                       |
| T05     | Published integration layers verified   | Output, DOM, no-JS/failed-module Chromium and container smoke passed; future deployed host pending        |
| T06     | Verified scoped fault evidence          | Query-leak and prize-action→allow mutants fail in disposable copies; no universal Stryker score claimed   |
| T07     | Verified evidence record                | Counts, commands, review fixes and limits recorded                                                        |
| H01–H07 | Not applicable                          | No server endpoint, adapter, contact, search or runtime config                                            |
| L01     | Host/operator portion pending           | Fictional/local data behavior verified; actual host logs/retention undecided                              |
| P01–P05 | Not applicable to collection            | No analytics/provider collection selected; no consent banner needed for a nonexistent tracker             |
| D01–D08 | Pending release selection/authorization | Host, TLS/DNS, real redirects/headers/cache, deployed identity and rollback not observed                  |

## Original local command evidence

These results predate review-branch publication. The 22-test counts describe that original artifact; the published-head CI counts above supersede them for de0ba448.

| Command                     | Observed result                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| npm install with exact pins | Passed; lockfile established; corrected ESLint 9/astro-plugin 3 peer mismatch to supported ESLint 10                      |
| npm run check               | 11 files, 0 errors/warnings/hints after Node types were added                                                             |
| npm run lint                | Passed after explicit TypeScript parser setup                                                                             |
| npm run format:check        | Passed                                                                                                                    |
| npm test                    | 22/22 passed, including four actual properties                                                                            |
| FC_NUM_RUNS=1000 npm test   | 22/22 passed; four properties ×1000 generated runs                                                                        |
| npm run test:fault          | Expected red for raw-query canonical and prize-action→allow; production never mutated                                     |
| npm run build               | Passed; 11 required anchors, ten fixtures, one canonical, twelve static files                                             |
| npm run test:dom            | 4/4 compiled-script DOM tests passed: selection/reset/scope/storage, checklist/no-JS, restored controls, navigation state |
| npm run test:e2e            | Blocked at server/browser startup; no browser assertions claimed executed                                                 |
| Source review               | Independent reviewer verified policy/output checks and scope; important findings corrected                                |

Original clean locked-install evidence and artifact hashes are recorded in docs/verification.md. Development logs use the container's clock; editorial review date is October 6 UTC.

## Corrections with failure evidence

- No-JS checklist initially showed a stale count: built-output assertion failed, then count/reset were hidden until enhancement
- Policy oracle originally missed a prize decision mutation: an independent literal 10×2 table now detects it
- Inherited workflow keys were accepted: toString/**proto**/constructor regression failed, then Object.hasOwn rejects them
- Restored controls initially disagreed with output: built-DOM test failed, then initialization/pageshow reconcile state
- Generic hero accessible name: source assertion failed, then an explicit group role was added
- Browser test locators/assertions were corrected from actual markup; the published-head suite later passed in GitHub Chromium CI

## Readiness

The published source passed automated browser/container review checks. Local review changes need their own verification. Manual UI review and public release still require operator/content/license/host decisions, exact-release CI and observed deployed behavior. No credentials, account, infrastructure, production data or website deployment was changed.

## Coolify extension

The owner requested hosting preparation for Coolify. Dockerfile build-pack configuration, nonroot Nginx port 8080, real 404/cache/security behavior, artifact-specific CSP hashes covering root and 404, a static health check, safe build variables and isolated smoke instructions were added. A distinct-404-script regression failed before CSP generation was expanded. GitHub CI later verified image resolution/build, nginx -t, health and container HTTP smoke. Docker, Podman and nginx remain unavailable locally. Actual Coolify deployment/proxy/TLS and public release remain unauthorized and unverified. See docs/coolify.md.

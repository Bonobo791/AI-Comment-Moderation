# Bootstrap status

Reviewed 6 October 2026. This is an isolated static source build for AICommentModeration.com, not a deployed website.

## Decision record

- Purpose: a broad useful guide, fictional preset decisions and a disclosed YouTube-only product path
- Stack: Astro 7.3.6 static output; Node 24.19.0/npm 11.9.0; one npm lockfile
- Compatibility: [Astro installation requirements](https://docs.astro.build/en/install-and-setup/) checked October 6; installed ESLint/Astro plugin requires Node ≥24.16; current runtime satisfies it
- Workspace: new isolated local repository on build/local; origin records the user-named Bonobo791/AI-Comment-Moderation; no push
- Bootstrap reference: Site-Bootstrap-ADM current/pinned 916df29d7410b4a9a5048ed69819b5da448a2ecf, AGENTS/shared/static/testing/example references inspected through GitHub; bundled reference access failed, so pinned public references supplied the evidence
- Host/provider/CMS/contact/analytics: none selected; no external writes, account, database, paid AI or live channel access
- Origin: intended HTTPS apex, exact-host validation; default output noindex and robots disallow
- Scope/route/data/content records: docs/project-specification.md, routes.md, environment.md, data-inventory.md and content-evidence.md
- Browser/visual/served-host evidence: pending. Chromium socket launch failed; supported cloud-browser local route was blocked; same offline file inspection was denied after one evidence-supported retry. No alternative bypass was used

## Requirement status

| IDs     | Status                                  | Evidence or blocker                                                                                       |
| ------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| C01–C06 | Verified local contracts                | Isolated inventory/pins/scripts/config; actual tests and failure boundaries                               |
| C07     | Pending actual CI                       | Read-only, pinned-action workflow prepared; no remote SHA/CI/protection observed                          |
| C08     | Partly verified                         | Original clean source/assets and private UNLICENSED state; owner license/publication decision pending     |
| C09     | Verified source handoff                 | README, commands and separate gates recorded; no claim of browser-complete readiness                      |
| S01     | Verified build                          | Static output, intended origin and assets inspected                                                       |
| S02     | Partly verified                         | Semantic/source/DOM behavior; actual mobile/desktop/keyboard/assistive-technology/zoom pending            |
| S03     | Verified                                | Ten synthetic fixtures, complete fields, independent outcome table and primary claims                     |
| S04     | Not applicable                          | No CMS selected                                                                                           |
| S05     | Partly verified                         | Original SVG/PNG assets, 1200×630 social image inspected, system fonts; actual layout/performance pending |
| S06     | Verified built contracts                | One title/H1/canonical, truthful schema, one sitemap root, intentional preview robots/meta                |
| S07     | Partly verified                         | Real 404 file/no canonical; actual HTTP status/host redirects pending. No migration                       |
| S08–S09 | Browser gate pending                    | Built output and DOM pass; live browser/served target blocked                                             |
| T01–T04 | Verified                                | Normal deterministic/property discovery, independent invariants and replay controls                       |
| T05     | Partly verified                         | Built-output and compiled-script DOM tests pass; browser/host stages pending                              |
| T06     | Verified scoped fault evidence          | Query-leak and prize-action→allow mutants fail in disposable copies; no universal Stryker score claimed   |
| T07     | Verified evidence record                | Counts, commands, review fixes and limits recorded                                                        |
| H01–H07 | Not applicable                          | No server endpoint, adapter, contact, search or runtime config                                            |
| L01     | Host/operator portion pending           | Fictional/local data behavior verified; actual host logs/retention undecided                              |
| P01–P05 | Not applicable to collection            | No analytics/provider collection selected; no consent banner needed for a nonexistent tracker             |
| D01–D08 | Pending release selection/authorization | Host, TLS/DNS, real redirects/headers/cache, deployed identity and rollback not observed                  |

## Executed local command evidence

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

Final clean locked-install/aggregate evidence and artifact hashes are recorded in docs/verification.md after the final command chain. Development logs use the container’s clock; editorial review date is October 6 UTC.

## Corrections with failure evidence

- No-JS checklist initially showed a stale count: built-output assertion failed, then count/reset were hidden until enhancement
- Policy oracle originally missed a prize decision mutation: an independent literal 10×2 table now detects it
- Inherited workflow keys were accepted: toString/**proto**/constructor regression failed, then Object.hasOwn rejects them
- Restored controls initially disagreed with output: built-DOM test failed, then initialization/pageshow reconcile state
- Generic hero accessible name: source assertion failed, then an explicit group role was added
- Browser test locators/assertions were corrected from actual markup; they remain unexecuted in a real browser

## Readiness

The source and local non-browser contracts are ready for review. Full local UI readiness requires a permitted real browser; public release requires operator/content/license/host/CI approval and observed served behavior. No credentials, account, infrastructure, production data or website deployment was changed.

## Coolify extension

The owner subsequently requested hosting preparation for Coolify. Dockerfile build-pack configuration, nonroot Nginx port 8080, real 404/cache/security behavior, artifact-specific CSP hashes covering root and 404, a static health check, safe build variables and isolated smoke instructions were added. Source tests pass; a distinct-404-script regression failed before CSP generation was expanded. See docs/coolify.md. Docker, Podman and nginx are unavailable, so image build, nginx -t, container HTTP and actual Coolify deployment remain unrun. This extends preparation only, not release authority.

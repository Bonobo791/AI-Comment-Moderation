# AICommentModeration.com

A one-page English-language guide to choosing an AI-assisted comment moderation workflow. Built with static Astro HTML and small local interactions. It contains ten fictional scenarios, a workflow chooser, a review checklist, current YouTube native options and a disclosed Moderaty product section.

## Status

The recorded source head [de0ba448](https://github.com/Bonobo791/AI-Comment-Moderation/commit/de0ba448cb3e6a6fe39565e11ed9d23551d48cc6) passed GitHub CI: 25 deterministic/property tests, 4 compiled-DOM tests, 9 Chromium/axe tests and isolated Docker/Nginx/health/HTTP smoke. See `docs/verification.md` for exact run links. Later revisions require their own exact-head result; consult the draft PR for current checks.

The source is on an authorized review branch in [Bonobo791/AI-Comment-Moderation](https://github.com/Bonobo791/AI-Comment-Moderation), with [draft PR #1](https://github.com/Bonobo791/AI-Comment-Moderation/pull/1). The website has not been deployed. Manual screenshot/200% zoom/assistive-technology review, a public license, legal operator/contact, actual Coolify/proxy/TLS behavior, deployed identity, crawler/training preferences and release approval remain pending. `UNLICENSED` is intentional until the owner chooses a license. Local browser/container execution is still blocked or unavailable; the successful runtime checks ran in GitHub CI.

## Run locally

Use Node 24.19.0 and npm 11.9.0. No account or provider credentials are required.

Astro commands use a Node launcher instead of shell-specific environment assignments. The launcher disables tooling telemetry, preserves literal arguments and stops the build pipeline on failure or interruption. Linux subprocess checks pass; an actual Windows runtime has not been tested.

```sh
npm ci
npm run check
npm run lint
npm run format:check
npm test
npm run test:fault
npm run build
npm run test:dom
npm run preview
```

The ordinary `npm test` suite includes deterministic tests and four real fast-check properties. `test:dom` checks the compiled browser scripts against a DOM implementation and creates a self-contained preview at `deliverables/AICommentModeration-preview.html`. Open that HTML file in a browser to inspect the unpublished guide without a server. It includes all styles/scripts and remains noindex.

For real browser checks, install Playwright's Chromium or use an existing Chromium. This example uses a POSIX shell:

```sh
npx playwright install chromium
CHROMIUM_PATH=/path/to/chromium npm run test:e2e
```

In Windows PowerShell, set `$env:CHROMIUM_PATH = 'C:\path\to\chrome.exe'`, then run `npm run test:e2e`.

The Playwright suite targets the built preview at port 4531. It covers interaction, routing, no-JS, responsive widths and axe checks. A suitable execution environment must permit the server/browser. Do not reinterpret a launch failure as a passed test.

## Coolify

The repository includes a multi-stage Dockerfile and nonroot Nginx configuration for Coolify's Dockerfile build pack, internal port 8080, real 404, artifact-specific CSP hashes and an image health check. GitHub CI verified the isolated container at the published head. See `docs/coolify.md` for image resolutions, exact settings and smoke commands. Docker/Podman/nginx are unavailable here. No Coolify resource or deployment was created.

## Build behavior

`npm run build` creates a noindex preview in `dist/`. `SITE_URL` defaults to the intended apex only for preview. For a separately authorized release artifact, `SITE_URL=https://aicommentmoderation.com npm run build:release` in a POSIX shell requires explicit exact-host configuration and emits indexable HTML. In Windows PowerShell, set `$env:SITE_URL = 'https://aicommentmoderation.com'`, then run `npm run build:release`. That command does not authorize deployment; see `docs/release-runbook.md`.

No CMS generation, database, server adapter, account, form, analytics, cookies, OAuth or model API is selected. The explorer computes fixed fictional decisions locally. All ten cases and both mode explanations are in HTML. Checklist state lasts only in the tab. The guide sends no runtime third-party requests.

## Project files

- `src/pages/index.astro`: one guide with stable S01–S11 anchors
- `src/data/scenarios.mjs`: versioned fictional fixtures
- `src/lib/scenario-rules.mjs`: deterministic preset and workflow rules
- `src/lib/site-config.mjs`: exact-origin, canonical and external-link policy
- `tests/fixture-policy.mjs`: independent literal 10×2 outcome oracle
- `scripts/check-output.mjs`: built HTML/asset/canonical/privacy contracts
- `scripts/verify-fault.mjs`: two deliberately wrong disposable copies that must fail
- `docs/bootstrap.md`: observed requirement status and command results
- `docs/content-evidence.md`: content sources and limits

Original CSS, workflow illustration, icon and social SVG/PNG were authored for this project. No platform logos, user comments, customer data, copied testimonials or external fonts are used. The bootstrap reference is [Site-Bootstrap-ADM at 916df29d](https://github.com/Bonobo791/Site-Bootstrap-ADM/commit/916df29d7410b4a9a5048ed69819b5da448a2ecf); its guidance was inspected, not another site's source copied.

# AICommentModeration.com

A one-page English-language guide to choosing an AI-assisted comment moderation workflow. Built with static Astro HTML and small local interactions. It contains ten fictional scenarios, a workflow chooser, a review checklist, current YouTube native options and a disclosed Moderaty product section.

## Status

Source implementation, unit/property checks, built-output checks and built-DOM interaction checks pass. This website build is not deployed. Real browser/visual/assistive-technology verification and served-host status checks remain pending because the available browser routes were blocked. DOM simulation is not a browser pass.

The intended repository is [Bonobo791/AI-Comment-Moderation](https://github.com/Bonobo791/AI-Comment-Moderation). Source is prepared for an authorized review-branch publication; its remote commit and CI are tracked in the draft PR. A public license, legal operator/contact, hosting, DNS/TLS, crawler/training preferences, successful CI and release approval remain unresolved. `UNLICENSED` is intentional until the owner chooses a license.

## Run locally

Use Node 24.19.0 and npm 11.9.0. No account or provider credentials are required.

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

For real browser checks, install Playwright's Chromium or use an existing Chromium:

```sh
npx playwright install chromium
CHROMIUM_PATH=/path/to/chromium npm run test:e2e
```

The Playwright suite targets the built preview at port 4531. It covers interaction, routing, no-JS, responsive widths and axe checks. A suitable execution environment must permit the server/browser. Do not reinterpret a launch failure as a passed test.

## Coolify

The repository now includes a multi-stage Dockerfile and nonroot Nginx configuration for Coolify’s Dockerfile build pack, internal port 8080, real 404, artifact-specific CSP hashes and an image health check. See `docs/coolify.md` for exact settings and isolated smoke commands. Docker/Podman/nginx are unavailable here, so container/Nginx/HTTP verification is pending. No Coolify resource or deployment was created.

## Build behavior

`npm run build` creates a noindex preview in `dist/`. `SITE_URL` defaults to the intended apex only for preview. For a separately authorized release artifact, `SITE_URL=https://aicommentmoderation.com npm run build:release` requires explicit exact-host configuration and emits indexable HTML. That command does not authorize deployment; see `docs/release-runbook.md`.

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

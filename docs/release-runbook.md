# Release gates and recovery

The owner authorized review-branch source publication and [draft PR #1](https://github.com/Bonobo791/AI-Comment-Moderation/pull/1). This does not authorize merge or public website release. Intended origin: https://aicommentmoderation.com/. No host, runtime account, production service or DNS change was made. Recorded exact-head CI evidence is in docs/verification.md; later revisions need their own checks.

## Before publication

1. Confirm legal operator/contact, site name/asset rights, public source license and final content/product/privacy review
2. Select and authorize host, budget and responsible release person; decide apex/www/HTTP handling, log retention, crawler/training preferences and security headers
3. Run clean locked install, check/lint/format, all unit/property/fault/build/DOM checks and real browser/axe/keyboard/zoom/no-JS/failed-module tests
4. Verify actual HTTP root/assets/404, MIME/cache behavior, redirects and protected preview access on the selected host
5. Confirm CI on the exact source commit and branch-required checks; a workflow file alone is not observed CI or branch protection
6. Confirm authorization for release publication and public deployment/DNS/terms/spend as applicable
7. Build the separately approved release artifact with explicit SITE_URL; verify indexable meta, robots, canonical and sitemap together
8. Publish only that reviewed artifact, record its hash/commit/time, then observe served identity, content, asset/status/header and interaction parity
9. Check webmaster discovery and effective Google AI settings/inheritance read-only; record actual Bing/OAI-SearchBot/Perplexity evidence separately from a spoofed user-agent probe

No analytics or cross-domain source tag dispatch is selected. No broader 90-day observation schedule was activated.

## Host header requirements

Apply appropriate TLS/HSTS policy only after hostname/HTTPS validation. The prepared container uses a CSP with self-only assets, no connections/forms/objects/frames and exact hashes for built inline scripts. Astro emits an inline script; `script-src 'self'` alone would break it. Generate hashes from the final artifact rather than copying a stale policy. The isolated CI container passed CSP, nosniff, Referrer-Policy and MIME/status smoke. The selected public host and Coolify proxy must establish their effective headers and TLS behavior too.

## Rollback

Keep the previous approved immutable artifact and host-specific rollback command before first release. Roll back within authorized scope for wrong affiliation, secret/data exposure, unexpected provider calls, misleading actions, wrong canonical or a serious interaction/accessibility defect. This files-only build has no database or migration to restore. Actual host rollback/cache/monitoring evidence remains pending.

## Current stopping point

Published head de0ba448 passed source/build/DOM, real Chromium/axe and isolated Docker/Nginx/health/HTTP CI checks. Local browser/container execution remains blocked or unavailable. Manual screenshots, focus/assistive-technology/200% zoom review and actual deployed-host/proxy/TLS/crawler gates remain pending. Later local edits need new exact-head checks. No deployment, indexing, citation, conversion, legal or WCAG certification claim is made.

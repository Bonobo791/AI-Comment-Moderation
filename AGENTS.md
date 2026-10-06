# AICommentModeration.com guide

This is an isolated source-only build, not a deployed site. Follow docs/project-specification.md. One main public guide URL; operational assets and a real 404 are exceptions.

Use Node 24.19.0 and npm 11.9.0. Run npm ci, npm run check, npm run lint, npm run format:check, npm test, npm run test:fault, npm run build, npm run test:dom, npm run test:e2e. The normal suite includes real fast-check properties. Record results against the tested commit and environment; prior GitHub CI passes do not verify later local edits. See docs/verification.md for published-head evidence and remaining manual/host gates.

Default builds are noindex previews. SITE_RELEASE=true only prepares an indexable artifact; it does not authorize publication. Authorized publication is limited to the approved review branch in Bonobo791/AI-Comment-Moderation and its draft PR. Preserve main and the owner’s README. No merge, deployment, DNS, provider setup, paid services, credentials, analytics, external inference or real moderation actions are authorized.

Do not copy source, identifiers, logos, tracking or private data from other projects. Fixtures are fictional. Do not claim independent product reviews, guaranteed accuracy, compatibility beyond YouTube comments or a live AI model. Keep local source strings rendered as text and public destinations allowlisted.

Generated output and dependencies remain ignored. Source remains UNLICENSED until the owner chooses a license. Review-branch publication, local readiness, provider integration and public website release are separate gates.

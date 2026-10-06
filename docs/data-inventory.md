# Data and privacy inventory

| Surface                                      | Data                                                              | Destination/storage                             | Status                                          |
| -------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| Fictional explorer                           | Ten original synthetic comment presets, chosen ID and review mode | Local JS/HTML; no network or persistent storage | Source and DOM effects verified                 |
| Workflow helper                              | One of four fixed categories                                      | Current tab; no network                         | Scope tests verified                            |
| Checklist                                    | Six boolean choices                                               | Memory/DOM in current tab                       | Reset/no-JS/restored-state tests verified       |
| Assets and fonts                             | Original CSS/SVG/PNG, system fonts                                | Same static origin                              | No remote assets                                |
| Analytics, accounts, forms, OAuth, model API | None                                                              | None                                            | Not selected                                    |
| Host/CDN request logs                        | Potential IP/request metadata                                     | Host not selected                               | Retention, deletion and operator review pending |
| External editorial links                     | Browser navigation chosen by reader                               | Named external website                          | Each website has its own policy                 |
| Public correction report                     | Information voluntarily posted by reader                          | GitHub issues                                   | Page warns against private account/comment data |

The build includes no tracker, browser storage or cookie-writing code. DOM tests and published-head Chromium CI observed no local/session storage after the tested interactions; Chromium also observed no external requests during the explorer flow. Exact-head evidence is in docs/verification.md. Actual deployed-host/proxy request logging and retention still need review before a public privacy statement is finalized. Do not copy Moderaty's policy onto this distinct guide or promise that hosting collects no metadata.

The visible publisher relationship is the team behind Moderaty. The guide’s legal operator/contact details are not confirmed. Legal/privacy pages are not fabricated; the current resource includes a factual implementation section and links external product policies as external policies.

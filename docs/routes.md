# Route contracts

| Route                             | Output                         | Audience/mutations                              | Indexing                                                     | Verification                                                    |
| --------------------------------- | ------------------------------ | ----------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| `/`                               | Pre-rendered `dist/index.html` | Public guide, local preset/checklist state only | Preview noindex; authorized release self-canonical/indexable | Published-head browser/container CI passed; public host pending |
| `#section`                        | Same document                  | Local navigation                                | No independent canonical/sitemap entry                       | Eleven required IDs and all fragment links checked              |
| `/?query#fragment`                | Same content                   | No personalized data behavior                   | Canonical omits arbitrary query/fragment                     | Unit/property tests passed                                      |
| `/robots.txt`                     | Static text                    | Read only                                       | Preview disallows all; release allows crawlers               | Output directives checked; actual bot/CDN behavior pending      |
| `/sitemap.xml`                    | Static XML                     | Read only                                       | Root canonical only                                          | One literal canonical entry checked                             |
| Unknown paths                     | 404 using `dist/404.html`      | Helpful return link only                        | Noindex; no homepage canonical                               | Genuine HTTP 404 passed in CI; public host pending              |
| `/_astro/*`, favicon, social card | Static assets                  | Read only                                       | Assets, not extra marketing URLs                             | All local references resolve                                    |

The slash policy is `/` with Astro `trailingSlash: always`. The only marketing/resource URL is the root. No old-domain, www or HTTP redirect is configured because no host/migration was selected. A host must implement real 404 handling and the intended one-hop HTTPS/apex redirects before release. Do not enable a blanket homepage fallback.

Local preview is not protected access merely because it has robots/noindex. An external preview requires approved authentication/access controls. No external preview was created.

## Prepared Nginx runtime

Docker runtime adds operational GET /healthz backed by a generated static health file, outside the sitemap and with noindex/no-store. Direct /healthz.txt is intentionally 404. Internal /404.html preserves unknown-path 404 status. Isolated container HTTP/status/MIME/cache/security smoke passed at published head de0ba448; exact evidence is in docs/verification.md. Hashed assets receive immutable caching, documents revalidate and errors do not cache. Actual Coolify proxy/TLS, public redirects and deployed behavior remain pending; local Docker execution is unavailable.

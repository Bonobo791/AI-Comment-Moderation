# Configuration and environment registry

| Name                     | Use                         | Default                  | Validation                                                  | Owner/status                                   |
| ------------------------ | --------------------------- | ------------------------ | ----------------------------------------------------------- | ---------------------------------------------- |
| SITE_URL                 | Public build-time canonical | Intended apex in preview | HTTPS exact apex; no credentials, port, path, query or hash | Owner confirmed domain; actual host unverified |
| SITE_RELEASE             | Build-time indexing gate    | false                    | Literal true/false only; true requires explicit SITE_URL    | Releaser must have separate authorization      |
| ASTRO_TELEMETRY_DISABLED | Build/dev tooling only      | 1 in scripts/CI          | Fixed disable setting                                       | No public runtime telemetry                    |
| FC_NUM_RUNS              | Test-only sample count      | 100                      | Positive safe integer                                       | Test operator                                  |
| FC_SEED                  | Test-only replay            | Unset                    | Signed 32-bit integer                                       | Test operator                                  |
| FC_PATH                  | Test-only shrink replay     | Unset                    | Numeric colon path; requires seed                           | Test operator                                  |
| CHROMIUM_PATH            | Test/CI browser executable  | /usr/bin/chromium        | Operator-provided installed browser                         | Real browser stage currently blocked           |

There are no secret variables, provider IDs, production accounts or private runtime configuration. Static files cannot consume host runtime secrets. Optional analytics is not implemented or accidentally enabled by an ID. Development/test/preview perform no external writes.

Invalid production origins tested include the corrected-away .net, canceled YouTube domain, localhost, www, preview subdomain, credentials, query/path, non-HTTPS and lookalike hosts. Tests reject inherited workflow keys too.

Coolify uses SITE_URL and SITE_RELEASE as public build-only variables through declared Docker ARGs. No runtime variable is required. The container listens on fixed port 8080; no injected PORT or private config is consumed. Image versions are in Dockerfile and need operator-verified immutable digests before production.

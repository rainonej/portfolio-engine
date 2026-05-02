# Security Policy

## Supported versions

Portfolio Engine is currently pre-1.0.

Security support applies to the default branch and the latest published package versions once packages are publicly released.

| Version | Supported |
| ------- | --------- |
| main/default branch | Yes |
| latest published packages | Yes, once published |
| old pre-release versions | Best effort |

## Reporting a vulnerability

Please do **not** report security vulnerabilities through public GitHub issues.

Report vulnerabilities privately by emailing:

```text
security@example.com
```

Replace this placeholder with the maintainer's preferred security contact before publishing.

Please include affected package or path, vulnerability description, reproduction steps, impact, suggested fix if known, downstream impact, and whether secrets/private content may be exposed.

## Response expectations

The maintainer will make a best-effort attempt to acknowledge the report, assess severity, coordinate a fix, release a patch if needed, and credit the reporter if appropriate and desired.

Because the project is currently small and maintainer-led, exact response times are not guaranteed.

## Scope

Security-sensitive issues include secret leakage, unsafe file handling, private downstream content exposure, unsafe GitHub Actions, unsafe package publishing, dependency confusion, unsafe preview/deploy behavior, and arbitrary code execution in workflow-kit/admin-tools.

## Out of scope

Unsupported old branches, purely theoretical attacks without reproduction, social engineering, and denial-of-service against third-party services outside project control are generally out of scope.

## AI and security

Do not paste secrets, credentials, or sensitive downstream content into public AI tools while investigating security issues.

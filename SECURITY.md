# Security Policy

## Supported Versions

Security fixes are applied to the latest release on the `main` branch. The project does not maintain parallel release branches.

| Version        | Supported |
| -------------- | --------- |
| Latest release | Yes       |
| Older releases | No        |

## Reporting a Vulnerability

Do not report security vulnerabilities in a public issue. Use [GitHub's private vulnerability reporting form](https://github.com/JeevaVenkidu/quick-extension-manager/security/advisories/new) and include:

- A clear description of the issue and its impact.
- Reproduction steps or a minimal proof of concept.
- Affected version, browser version, and operating system.
- Any suggested mitigation, if available.

Please do not attach passwords, personal data, browser profiles, or complete extension inventories. If sensitive files are required, request a secure exchange method in the initial email.

## Response Expectations

- We will acknowledge receipt within 5 business days.
- We will investigate, ask clarifying questions when needed, and provide an assessment as soon as practical.
- Confirmed issues will be fixed or mitigated in a supported release when feasible.
- We will coordinate disclosure timing with the reporter and credit them only with permission.

## Security Policy

Quick Extension Manager is a local-only extension. It requests the Chrome `management` permission to read installed extension metadata and change enabled state. It has no backend, login, telemetry, content scripts, or remote code. Changes that add permissions, network access, or third-party runtime code require explicit security review in the pull request.

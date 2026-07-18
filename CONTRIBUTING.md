# Contributing to Quick Extension Manager

Thank you for helping improve Quick Extension Manager. Contributions should keep the extension fast, understandable, privacy-conscious, and limited to the smallest permission set that solves the problem.

## Before You Start

- Search existing issues and pull requests before opening a new one.
- For security vulnerabilities, follow [SECURITY.md](SECURITY.md) instead of filing a public issue.
- For larger changes, open a feature request first so the scope can be agreed before implementation.

## Forking and Local Setup

1. Fork [the repository](https://github.com/JeevaVenkidu/quick-extension-manager).
2. Clone your fork and add the upstream repository.
3. Load the repository as an unpacked extension from `chrome://extensions` with Developer mode enabled.
4. Make a focused change and reload the extension after editing source files.

```bash
git clone https://github.com/<your-user>/quick-extension-manager.git
cd quick-extension-manager
git remote add upstream https://github.com/JeevaVenkidu/quick-extension-manager.git
```

## Branch Naming

Create branches from `main` using a short purpose-based name:

- `fix/search-empty-state`
- `feat/keyboard-navigation`
- `docs/installation-guide`
- `chore/ci-validation`

Do not include credentials, issue contents, or unrelated work in branch names or commits.

## Commit Messages

Use imperative, concise commit subjects with a conventional prefix:

```text
feat: add extension count to status
fix: handle management API failures
docs: clarify manual installation
chore: tighten archive validation
```

Keep the first line under 72 characters. Explain user-visible behavior and migration details in the body when they are not obvious.

## Coding Standards

- Use plain browser JavaScript and platform APIs already used by the project.
- Prefer DOM APIs and `textContent` for user-provided values; do not add unsafe HTML injection.
- Keep Manifest V3 permissions minimal and document any permission change in the pull request.
- Preserve keyboard accessibility, visible focus, useful labels, and reduced-motion behavior.
- Avoid network calls, analytics, remote scripts, and new dependencies unless the change is explicitly justified.
- Keep source files readable and use the existing two-space indentation style.
- Update documentation and the changelog for user-visible changes.

## Validation

Run these commands before opening a pull request:

```bash
node --check popup.js
node -e "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8')); console.log('manifest.json is valid JSON')"
```

Load the extension in Chrome and manually verify search, individual toggles, bulk actions, empty states, and reload behavior. GitHub Actions runs the same checks plus archive and formatting validation.

## Pull Requests

1. Rebase or merge the latest `main` into your branch if it has changed substantially.
2. Open a pull request using the repository template.
3. Describe the problem, the solution, permission changes, and manual verification steps.
4. Include screenshots or a short recording for visible UI changes when useful.
5. Keep the pull request focused and respond to review feedback.

A maintainer may request changes to scope, accessibility, security, browser compatibility, or documentation before merging.

## Reporting Bugs

Use the [bug report template](https://github.com/JeevaVenkidu/quick-extension-manager/issues/new?template=bug_report.yml). Include Chrome version, operating system, extension version, reproduction steps, expected behavior, actual behavior, and relevant console errors. Do not include private extension names or other sensitive browser data unless necessary.

## Feature Requests

Use the [feature request template](https://github.com/JeevaVenkidu/quick-extension-manager/issues/new?template=feature_request.yml). Explain the user problem, proposed behavior, alternatives considered, and whether the change requires a new Chrome permission.

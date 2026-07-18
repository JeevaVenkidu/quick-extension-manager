# Supported Versions

Quick Extension Manager follows a latest-release support policy.

## Browser Support

The project targets Google Chrome and Chromium-based browsers that support Manifest V3 and the `chrome.management` API. Browser vendors can restrict management operations, so compatibility is ultimately determined by the browser's implementation and extension policy.

The project is tested primarily against the current stable version of Google Chrome on Windows. Reports from current stable Chrome on macOS and Linux are welcome. Older browser versions, developer-channel builds, and Chromium forks may work but are not guaranteed.

## Extension Versions

| Version        | Status        | Notes                                 |
| -------------- | ------------- | ------------------------------------- |
| Latest release | Supported     | Receives bug fixes and security fixes |
| Older releases | Not supported | Upgrade before reporting an issue     |

Use the version shown on `chrome://extensions` when filing a bug. Development checkouts are supported only when the report includes the commit or branch used.

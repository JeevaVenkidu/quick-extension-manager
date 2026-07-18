# Architecture

## Runtime Model

Quick Extension Manager is a Manifest V3 browser action with a single popup document. There is no service worker, content script, options page, external API, database, or build pipeline.

```text
Chrome toolbar
    |
    v
popup.html --> popup.css
    |
    v
popup.js --> chrome.management.getAll()
    |
    v
Rendered list --> chrome.management.setEnabled(id, enabled)
```

## Startup Flow

1. Chrome opens `popup.html` when the toolbar action is selected.
2. `popup.js` waits for `DOMContentLoaded` and locates the list, search field, status, and bulk action controls.
3. `chrome.management.getAll()` retrieves installed extension metadata.
4. The manager filters out non-extension items and its own extension ID, then sorts the remaining items by name.
5. The popup renders active and inactive groups and updates the status count.
6. A four-second timeout prevents a permanently loading UI if the API does not settle.

## Interaction Flow

- Search filters the in-memory list by extension name and never sends query text outside the popup.
- An individual toggle calls `chrome.management.setEnabled()` for one extension. The control is disabled while the callback is pending and reverts on failure.
- The bulk button determines whether the next action is enable-all or disable-all, asks for confirmation, then submits one management request per target.
- Extension names and descriptions used in rendered text are inserted with `textContent` or escaped before being placed in the empty-state template.

## Permissions and Trust Boundaries

The manifest requests only `management`. This permission is necessary to enumerate installed extensions and change their enabled state. The extension does not request browsing history, tabs, storage, scripting, host permissions, or network permissions.

The Chrome Management API is the trusted source of extension state. The popup treats API failures as recoverable UI errors and does not persist stale state beyond the popup lifetime. A future permission change must be reviewed for privacy impact and documented in `SECURITY.md` and the pull request.

## Packaging

Release packaging copies the manifest, popup source, and three PNG icons into a ZIP with no parent directory. The archive is validated by checking the manifest JSON, required files, and ZIP root before it is uploaded to the GitHub Release.

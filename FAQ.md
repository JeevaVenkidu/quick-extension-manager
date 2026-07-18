# Frequently Asked Questions

## Why does the extension request the `management` permission?

Chrome requires this permission to list installed extensions and change whether they are enabled. Quick Extension Manager does not request host access, browsing history, tabs, storage, or scripting permissions.

## Does it collect or upload my installed extension list?

No. The list is read from Chrome and rendered locally in the popup. The project has no backend, account system, analytics, or telemetry.

## Why is an extension missing from the list?

The popup shows extension-type items that Chrome returns from `chrome.management.getAll()`. Chrome may omit or restrict system-managed items, and the manager intentionally excludes itself. Check `chrome://extensions` to confirm the extension is installed and available to your browser profile.

## Why did a toggle fail?

Chrome can reject management changes for policy-controlled, protected, or otherwise unavailable extensions. Reload the popup and check `chrome://extensions`. If the failure is repeatable for a normal extension, open a [bug report](https://github.com/JeevaVenkidu/quick-extension-manager/issues/new?template=bug_report.yml) with browser and extension versions.

## Why does the popup say there are no extensions?

The management API may be unavailable when the files are opened outside Chrome, when the extension is not loaded correctly, or when Chrome does not return any eligible items. Load the directory through `chrome://extensions` rather than opening `popup.html` directly.

## How do I apply source changes?

Open `chrome://extensions`, enable Developer mode, and press **Reload** on Quick Extension Manager. Close and reopen the popup to load the updated document.

## Does it support Firefox or Edge?

It targets Chrome and Chromium-compatible Manifest V3 implementations. Edge may work because it is Chromium-based, but it is not the primary test target. Firefox compatibility is not guaranteed because extension management APIs differ.

## How can I request a feature?

Search existing issues and then use the [feature request template](https://github.com/JeevaVenkidu/quick-extension-manager/issues/new?template=feature_request.yml). Explain the user problem and whether the proposal needs additional browser permissions.

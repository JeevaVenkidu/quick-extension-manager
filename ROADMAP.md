# Roadmap

The roadmap prioritizes fast, local, low-permission improvements. Items are goals rather than promises and may change as browser APIs and maintainer capacity change.

## Near Term

- Improve error messaging when Chrome rejects an enable or disable request.
- Add stronger manual coverage for keyboard navigation and screen-reader announcements.
- Verify behavior against current stable Chrome on Windows, macOS, and Linux.
- Add a maintained screenshot or short demo to the project documentation.

## Medium Term

- Add optional sorting choices while preserving alphabetical sorting as the default.
- Make bulk actions clearer when a filtered search result is active.
- Improve handling of extension state changes made outside the popup.
- Publish a signed, reproducible release checklist for contributors.

## Long Term

- Evaluate browser support beyond Chrome only when equivalent management APIs and permission models are available.
- Consider lightweight persisted preferences only if a concrete user need justifies storage permission or local state.
- Explore Chrome Web Store distribution after the release and privacy documentation are mature.

## Out of Scope

- Running extension code on websites.
- Collecting usage analytics or extension inventories.
- Bundling remote code or a hosted account service.

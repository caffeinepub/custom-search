# Specification

## Summary
**Goal:** Fix the "access denied" issue by replacing Google with DuckDuckGo as the search backend, and improve the in-app browser to handle iframe load failures gracefully.

**Planned changes:**
- Update the Motoko backend actor to construct HTTP outcall URLs targeting the DuckDuckGo API (`api.duckduckgo.com`) and remove any Google-related URLs.
- Update the `InAppBrowser` component to detect iframe load errors (e.g., X-Frame-Options blocks) and display a user-friendly error message with an "Open in new tab" button as a fallback.

**User-visible outcome:** Searching no longer redirects to a Google access-denied page — results come from DuckDuckGo. If a page cannot be displayed inside the in-app browser, the user sees a clear error message and a button to open the link in a new tab.

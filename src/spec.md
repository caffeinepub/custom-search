# Specification

## Summary
**Goal:** Make all URLs in search results clickable and open in the same tab.

**Planned changes:**
- Modify SearchInterface component to automatically detect and render all URLs in search results as clickable anchor tags
- Ensure all links open in the same browser tab (remove target="_blank" attributes)
- Make search result titles clickable and navigate directly to their URLs

**User-visible outcome:** Users can click any URL appearing in search results (in titles, abstracts, or related topics) to navigate directly to that URL in the same tab without opening new windows.

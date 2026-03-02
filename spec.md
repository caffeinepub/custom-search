# Specification

## Summary
**Goal:** Remove all remaining Google API, OAuth, and domain references from both the backend and frontend, ensuring all search traffic routes exclusively through DuckDuckGo.

**Planned changes:**
- Audit and remove any HTTP outcalls to Google domains (google.com, googleapis.com, etc.) from the backend Motoko actor, replacing them with DuckDuckGo API calls
- Audit `useSearch.ts` and `SearchInterface` component to remove any Google-specific URLs, API keys, or OAuth flow references
- Ensure all search queries are routed exclusively to the DuckDuckGo API endpoint in both backend and frontend

**User-visible outcome:** Search results load successfully from DuckDuckGo with no access-denied or OAuth-related errors appearing in the search UI.

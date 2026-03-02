# Specification

## Summary
**Goal:** Regenerate a full-stack DuckDuckGo search application on ICP with a Motoko backend and a React frontend featuring a dark-themed UI.

**Planned changes:**
- Implement a Motoko backend actor in `backend/main.mo` that performs HTTP outcalls to the DuckDuckGo API, parses the JSON response, and returns results or descriptive error messages
- Implement a `useSearch` custom hook that URL-encodes queries, calls the backend, validates JSON responses, and exposes `results`, `isLoading`, `error`, and `search` state
- Implement a `SearchInterface` component with a search form, loading/error/empty states, and flattened DuckDuckGo topic results that open in an in-app browser overlay
- Implement an `InAppBrowser` component as a fullscreen modal overlay with an iframe, loading spinner, close button, and fallback "Open in new tab" link
- Apply a dark-themed design system using OKLCH-based CSS custom properties, Tailwind semantic color tokens, card-based result layout, and centered responsive typography

**User-visible outcome:** Users can enter a search query, see results fetched from DuckDuckGo displayed as cards in a dark-themed UI, and open result links in a fullscreen in-app browser overlay.

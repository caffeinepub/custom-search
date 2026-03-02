import { useState } from 'react';
import { useActor } from './useActor';

export function useSearch() {
  const { actor, isFetching: isActorFetching } = useActor();
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractErrorMessage = (err: unknown): string => {
    if (!err) return 'An unknown error occurred';

    if (typeof err === 'object') {
      const e = err as Record<string, unknown>;

      if (typeof e.message === 'string') {
        const msg = e.message;

        // Check for node provider / HTTP outcall authorization issues first
        if (
          msg.toLowerCase().includes('not authorized') ||
          msg.toLowerCase().includes('node provider') ||
          msg.toLowerCase().includes('http outcall') ||
          msg.toLowerCase().includes('status code 0') ||
          msg.toLowerCase().includes('network error')
        ) {
          return 'Search is unavailable in this environment. HTTP outcalls require a production deployment with an authorized node provider.';
        }

        // Extract meaningful part from ICP canister trap messages
        // The trap text can span multiple lines — capture everything after the colon
        const trapMatch = msg.match(/Canister trapped[^:]*:\s*([\s\S]+)/i);
        if (trapMatch) {
          const trapText = trapMatch[1].trim();
          // Re-check the extracted trap text for known patterns
          if (
            trapText.toLowerCase().includes('not authorized') ||
            trapText.toLowerCase().includes('node provider') ||
            trapText.toLowerCase().includes('http outcall')
          ) {
            return 'Search is unavailable in this environment. HTTP outcalls require a production deployment with an authorized node provider.';
          }
          // Return a reasonable slice of the trap message
          return trapText.slice(0, 200);
        }

        const rejectMatch = msg.match(/Reject text:\s*([\s\S]+)/i);
        if (rejectMatch) {
          const rejectText = rejectMatch[1].trim();
          if (
            rejectText.toLowerCase().includes('not authorized') ||
            rejectText.toLowerCase().includes('node provider') ||
            rejectText.toLowerCase().includes('http outcall')
          ) {
            return 'Search is unavailable in this environment. HTTP outcalls require a production deployment with an authorized node provider.';
          }
          return rejectText.slice(0, 200);
        }

        if (msg.length < 300) return msg;
      }

      if (typeof e.code === 'string' || typeof e.code === 'number') {
        return `Request failed (code: ${e.code})`;
      }
    }

    if (typeof err === 'string') {
      const s = err;
      if (
        s.toLowerCase().includes('not authorized') ||
        s.toLowerCase().includes('node provider') ||
        s.toLowerCase().includes('http outcall')
      ) {
        return 'Search is unavailable in this environment. HTTP outcalls require a production deployment with an authorized node provider.';
      }
      if (s.length < 300) return s;
    }

    return 'Failed to perform search. Please try again.';
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    if (!actor) {
      if (isActorFetching) {
        setError('Connecting to backend, please try again in a moment.');
      } else {
        setError('Backend connection not available. Please refresh the page.');
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const results = await actor.search(encodedQuery);

      if (!results || results.trim() === '') {
        setError('No response received from the search service. Please try again.');
        return;
      }

      // Validate JSON
      try {
        JSON.parse(results);
      } catch {
        if (
          results.toLowerCase().includes('error') ||
          results.toLowerCase().includes('failed')
        ) {
          setError(`Search service error: ${results.slice(0, 150)}`);
        } else {
          setError('Received an invalid response from the search service. Please try again.');
        }
        return;
      }

      setSearchResults(results);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchResults,
    isLoading,
    isActorFetching,
    error,
    performSearch,
  };
}

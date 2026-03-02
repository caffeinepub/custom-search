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

        // Extract meaningful part from ICP canister trap messages
        const trapMatch = msg.match(/Canister trapped[^:]*:\s*(.+)/i);
        if (trapMatch) return trapMatch[1].trim();

        const rejectMatch = msg.match(/Reject text:\s*(.+)/i);
        if (rejectMatch) return rejectMatch[1].trim();

        // HTTP outcall / node provider errors
        if (
          msg.includes('HTTP outcall') ||
          msg.includes('node provider') ||
          msg.includes('status code 0')
        ) {
          return 'Search service is temporarily unavailable. HTTP outcalls may not be enabled in this environment.';
        }

        if (msg.length < 200) return msg;
      }

      if (typeof e.code === 'string' || typeof e.code === 'number') {
        return `Request failed (code: ${e.code})`;
      }
    }

    if (typeof err === 'string' && err.length < 200) {
      return err;
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

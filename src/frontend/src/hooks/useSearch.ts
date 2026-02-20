import { useState } from 'react';
import { useActor } from './useActor';

export function useSearch() {
  const { actor } = useActor();
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (query: string) => {
    if (!actor) {
      setError('Backend connection not available');
      return;
    }

    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      // URL-encode the query to handle spaces and special characters
      const encodedQuery = encodeURIComponent(query.trim());
      const results = await actor.search(encodedQuery);
      
      // Validate that we received a response
      if (!results || results.trim() === '') {
        setError('No results returned from search');
        return;
      }

      // Try to parse the JSON to validate it's valid
      try {
        JSON.parse(results);
        setSearchResults(results);
      } catch (parseError) {
        console.error('Failed to parse search results:', parseError);
        setError('Received invalid response from search service');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchResults,
    isLoading,
    error,
    performSearch,
  };
}

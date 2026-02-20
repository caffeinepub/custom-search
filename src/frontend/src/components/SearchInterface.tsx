import { useState } from 'react';
import { Search, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSearch } from '../hooks/useSearch';
import { linkifyText } from '../utils/urlFormatter';

interface SearchResult {
  AbstractText?: string;
  AbstractURL?: string;
  AbstractSource?: string;
  Heading?: string;
  RelatedTopics?: Array<{
    Text?: string;
    FirstURL?: string;
    Icon?: { URL?: string };
  }>;
  Results?: Array<{
    Text?: string;
    FirstURL?: string;
  }>;
}

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const { searchResults, isLoading, error, performSearch } = useSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  const parsedResults: SearchResult | null = searchResults
    ? (() => {
        try {
          return JSON.parse(searchResults);
        } catch {
          return null;
        }
      })()
    : null;

  const hasAbstract = parsedResults?.AbstractText && parsedResults.AbstractText.length > 0;
  const hasRelatedTopics =
    parsedResults?.RelatedTopics && parsedResults.RelatedTopics.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent via-primary to-accent-foreground flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">SearchHub</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Search Form */}
          <div className="mb-12">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for anything..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-14 text-lg pl-6 pr-32 rounded-2xl border-2 focus-visible:ring-2 focus-visible:ring-accent transition-all"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute right-2 top-2 h-10 px-6 rounded-xl font-semibold"
                  size="default"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {parsedResults && !isLoading && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Abstract/Main Result */}
              {hasAbstract && (
                <Card className="rounded-2xl border-2 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {parsedResults.Heading || 'Result'}
                    </CardTitle>
                    {parsedResults.AbstractSource && (
                      <CardDescription className="text-base">
                        Source: {parsedResults.AbstractSource}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      {linkifyText(parsedResults.AbstractText || '')}
                    </p>
                    {parsedResults.AbstractURL && (
                      <a
                        href={parsedResults.AbstractURL}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Learn more
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Related Topics */}
              {hasRelatedTopics && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Related Topics</h2>
                  <div className="grid gap-4">
                    {parsedResults.RelatedTopics?.slice(0, 10).map((topic, index) => {
                      if (!topic.Text) return null;
                      
                      return (
                        <Card
                          key={index}
                          className="rounded-xl border hover:border-accent hover:shadow-sm transition-all"
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              {topic.Icon?.URL && (
                                <img
                                  src={topic.Icon.URL}
                                  alt=""
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-foreground leading-relaxed mb-2">
                                  {linkifyText(topic.Text)}
                                </p>
                                {topic.FirstURL && (
                                  <a
                                    href={topic.FirstURL}
                                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                                  >
                                    View details
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No Results */}
              {!hasAbstract && !hasRelatedTopics && (
                <Card className="rounded-2xl border-2">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground">
                      Try searching for something else or use different keywords.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Empty State */}
          {!parsedResults && !isLoading && !error && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 via-primary/20 to-accent/20 mx-auto mb-6 flex items-center justify-center">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Start Your Search</h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Enter a query above to discover information from across the web.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SearchHub. All rights reserved.</p>
            <p>
              Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'searchhub'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

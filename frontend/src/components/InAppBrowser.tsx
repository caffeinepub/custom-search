import { useState, useEffect, useRef } from 'react';
import { X, Loader2, ExternalLink, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InAppBrowserProps {
  url: string;
  onClose: () => void;
}

export default function InAppBrowser({ url, onClose }: InAppBrowserProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const loadStartTime = useRef<number>(Date.now());

  // Reset state whenever the URL changes
  useEffect(() => {
    setIsLoading(true);
    setIsBlocked(false);
    loadStartTime.current = Date.now();
  }, [url]);

  const handleLoad = () => {
    const elapsed = Date.now() - loadStartTime.current;
    // If the iframe fires onLoad extremely fast (< 500ms), it almost certainly
    // got blocked by X-Frame-Options / CSP and the browser returned an empty
    // document instead of the real page.
    if (elapsed < 500) {
      setIsBlocked(true);
    }
    setIsLoading(false);
  };

  const handleError = () => {
    setIsBlocked(true);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Browser Chrome Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shadow-sm flex-shrink-0">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full flex-shrink-0"
          aria-label="Close browser"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-4 py-2 min-w-0">
          <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground truncate font-mono">{url}</span>
        </div>

        {/* Open in new tab fallback */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
          aria-label="Open in new tab"
        >
          <Button variant="ghost" size="icon" className="rounded-full" asChild={false}>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </a>
      </div>

      {/* Loading indicator */}
      {isLoading && !isBlocked && (
        <div className="absolute inset-0 top-[57px] flex items-center justify-center bg-background z-10">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm">Loading page…</span>
          </div>
        </div>
      )}

      {/* Blocked / access-denied fallback */}
      {isBlocked && (
        <div className="flex-1 flex items-center justify-center bg-background px-6">
          <div className="flex flex-col items-center gap-5 text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                This page can't be displayed here
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The website has blocked embedding in external apps. You can still view it by opening it directly in your browser.
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full gap-2 rounded-xl" size="lg">
                <ExternalLink className="w-4 h-4" />
                Open in new tab
              </Button>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Go back to results
            </button>
          </div>
        </div>
      )}

      {/* iframe */}
      {!isBlocked && (
        <iframe
          src={url}
          className="flex-1 w-full border-none"
          onLoad={handleLoad}
          onError={handleError}
          title="In-app browser"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      )}
    </div>
  );
}

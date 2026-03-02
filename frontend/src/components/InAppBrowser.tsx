import { useState } from 'react';
import { X, Loader2, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InAppBrowserProps {
  url: string;
  onClose: () => void;
}

export default function InAppBrowser({ url, onClose }: InAppBrowserProps) {
  const [isLoading, setIsLoading] = useState(true);

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
      {isLoading && (
        <div className="absolute inset-0 top-[57px] flex items-center justify-center bg-background z-10">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm">Loading page…</span>
          </div>
        </div>
      )}

      {/* iframe */}
      <iframe
        src={url}
        title="In-app browser"
        className="flex-1 w-full border-none"
        onLoad={() => setIsLoading(false)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}

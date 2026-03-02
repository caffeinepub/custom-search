import React from 'react';

/**
 * Detects URLs in text and converts them to clickable elements.
 * When onLinkClick is provided, clicking a link calls the callback with the URL
 * instead of navigating natively.
 */
export function linkifyText(
  text: string,
  onLinkClick?: (url: string) => void
): React.ReactNode {
  if (!text) return text;

  const urlPattern = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
  const parts = text.split(urlPattern);

  return parts.map((part, index) => {
    if (part.match(urlPattern)) {
      if (onLinkClick) {
        return (
          <button
            key={index}
            type="button"
            onClick={() => onLinkClick(part)}
            className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors font-medium text-left break-all"
          >
            {part}
          </button>
        );
      }
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors font-medium"
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Checks if a string is a valid URL
 */
export function isUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

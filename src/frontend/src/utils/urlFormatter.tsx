import React from 'react';

/**
 * Detects URLs in text and converts them to clickable anchor tags.
 * Returns JSX with text and links properly formatted.
 */
export function linkifyText(text: string): React.ReactNode {
  if (!text) return text;

  // Comprehensive URL regex pattern
  const urlPattern = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/gi;
  
  const parts = text.split(urlPattern);
  
  return parts.map((part, index) => {
    // Check if this part is a URL
    if (part.match(urlPattern)) {
      return (
        <a
          key={index}
          href={part}
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

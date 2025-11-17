import React from "react"

/**
 * ScrollArea component - Simple wrapper with native scrollbars
 * Replaces Radix UI to ensure scrollbars are always visible
 */
export function ScrollArea({ children, className = "", ...props }) {
  return (
    <div 
      className={`overflow-auto force-scrollbar ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
import * as React from "react"

/**
 * ScrollArea component - Simple wrapper with native scrollbars
 * Replaces Radix UI to ensure scrollbars are always visible
 */
const ScrollArea = React.forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={`overflow-auto force-scrollbar ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
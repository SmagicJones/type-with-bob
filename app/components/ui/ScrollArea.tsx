import type { ReactNode } from "react";

type ScrollAreaProps = {
  /** Names the region, so keyboard users know what they are scrolling. */
  label: string;
  children: ReactNode;
  className?: string;
};

/** A horizontally scrollable region that keyboard users can focus and scroll. */
export function ScrollArea({
  label,
  children,
  className = "",
}: ScrollAreaProps) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={`overflow-x-auto rounded-md focus-visible:outline-4 focus-visible:outline-indigo-600 ${className}`}
    >
      {children}
    </div>
  );
}

import { memo } from "react";

import type { CharStatus } from "~/features/typing-engine";

type TypedCharProps = {
  char: string;
  status: CharStatus;
  isCursor: boolean;
};

// Incorrect and corrected characters carry an underline style as well as a
// colour, so the difference never relies on colour alone.
const STATUS_STYLES: Record<CharStatus, string> = {
  pending: "text-gray-500 dark:text-gray-400",
  correct: "text-gray-900 dark:text-gray-50",
  incorrect:
    "bg-red-100 text-red-800 underline decoration-wavy decoration-2 dark:bg-red-950 dark:text-red-200",
  corrected:
    "text-amber-800 underline decoration-dotted decoration-2 dark:text-amber-300",
};

const CURSOR_STYLE =
  "rounded-sm outline-2 outline-indigo-600 motion-safe:animate-pulse dark:outline-indigo-400";

/** One character of the passage. Memoised so a keystroke only re-renders the characters it changes. */
export const TypedChar = memo(function TypedChar({
  char,
  status,
  isCursor,
}: TypedCharProps) {
  // Show a visible mark for a mistyped space, which would otherwise be invisible.
  const shown = char === " " && status === "incorrect" ? "␣" : char;

  return (
    <span
      data-status={status}
      data-cursor={isCursor || undefined}
      className={`whitespace-pre ${STATUS_STYLES[status]} ${isCursor ? CURSOR_STYLE : ""}`}
    >
      {shown}
    </span>
  );
});

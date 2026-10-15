import { useMemo } from "react";

import type { CharStatus } from "~/features/typing-engine";

import { TypedChar } from "./TypedChar";

type TypingTextProps = {
  target: string;
  chars: readonly CharStatus[];
  position: number;
  className?: string;
};

/** Index ranges of each word plus its trailing space, so lines wrap between words. */
function wordRanges(target: string): [start: number, end: number][] {
  const ranges: [number, number][] = [];
  let start = 0;
  for (let i = 0; i < target.length; i++) {
    if (target[i] === " " || i === target.length - 1) {
      ranges.push([start, i + 1]);
      start = i + 1;
    }
  }
  return ranges;
}

/**
 * The passage with per-character feedback. Hidden from assistive technology:
 * the surrounding typing area describes the passage and announces errors.
 */
export function TypingText({
  target,
  chars,
  position,
  className = "",
}: TypingTextProps) {
  const ranges = useMemo(() => wordRanges(target), [target]);

  return (
    <p
      aria-hidden="true"
      className={`font-mono text-2xl leading-relaxed break-words ${className}`}
    >
      {ranges.map(([start, end]) => (
        <span key={start} className="inline-block">
          {Array.from({ length: end - start }, (_, offset) => {
            const index = start + offset;
            return (
              <TypedChar
                key={index}
                char={target.charAt(index)}
                status={chars[index] ?? "pending"}
                isCursor={index === position}
              />
            );
          })}
        </span>
      ))}
    </p>
  );
}

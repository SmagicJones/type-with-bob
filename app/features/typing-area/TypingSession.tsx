import { useEffect, useId, useRef, useState } from "react";

import {
  charName,
  VisualKeyboard,
  type KeyboardLayout,
} from "~/features/keyboard";
import {
  getExpectedChar,
  getKeyStats,
  getSummary,
  isComplete,
} from "~/features/typing-engine";

import { LiveStats } from "./LiveStats";
import type { SessionResult } from "./sessionResult";
import { TypingText } from "./TypingText";
import { useNow } from "./useNow";
import { useTypingInput } from "./useTypingInput";
import { useTypingSession } from "./useTypingSession";

type TypingSessionProps = {
  target: string;
  layout: KeyboardLayout;
  onComplete: (result: SessionResult) => void;
  className?: string;
};

/**
 * One typing pass: the passage, live stats and the visual keyboard.
 * Remount (change `key`) to restart.
 */
export function TypingSession({
  target,
  layout,
  onComplete,
  className = "",
}: TypingSessionProps) {
  const { state, handleKey } = useTypingSession(target);
  const areaRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const descriptionId = useId();

  const complete = isComplete(state);
  const running = state.startedAt !== null && !complete;
  const now = useNow(running);
  // Between ticks, never measure to a point before the latest keystroke.
  const liveNow = Math.max(now, state.keystrokes.at(-1)?.at ?? now);
  const expected = getExpectedChar(state);
  const onMistake = state.chars[state.position] === "incorrect";

  useTypingInput(areaRef, handleKey, !complete);

  useEffect(() => {
    areaRef.current?.focus();
  }, []);

  const completedRef = useRef(false);
  useEffect(() => {
    if (!complete || state.finishedAt === null || completedRef.current) return;
    completedRef.current = true;
    onComplete({
      summary: getSummary(state, state.finishedAt),
      keyStats: getKeyStats(state),
    });
  }, [complete, state, onComplete]);

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <LiveStats summary={getSummary(state, liveNow)} />

      <div
        ref={areaRef}
        role="textbox"
        tabIndex={0}
        aria-label="Typing area"
        aria-describedby={descriptionId}
        aria-readonly="true"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="relative rounded-xl border-2 border-gray-300 bg-gray-50 p-6 focus:outline-4 focus:outline-offset-2 focus:outline-indigo-600 dark:border-gray-700 dark:bg-gray-900"
      >
        <p id={descriptionId} className="sr-only">
          Type this text: {target}
        </p>
        <TypingText
          target={target}
          chars={state.chars}
          position={state.position}
        />
        {!focused && !complete && (
          <p className="mt-4 text-center text-sm font-medium text-indigo-700 dark:text-indigo-300">
            Click here or press Tab to{" "}
            {state.startedAt === null ? "start" : "keep"} typing
          </p>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {onMistake && expected !== null
          ? `Not quite. The next key is ${charName(expected)}.`
          : ""}
      </p>

      <VisualKeyboard layout={layout} nextChar={expected} />
    </div>
  );
}

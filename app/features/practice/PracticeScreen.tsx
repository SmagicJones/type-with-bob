import { Link } from "react-router";

import type { KeyboardLayout } from "~/features/keyboard";
import type { PracticeAttempt } from "~/features/progress";
import { TypingSession, type SessionResult } from "~/features/typing-area";

import { PracticeResults } from "./PracticeResults";
import type { PracticeLength, TextSource } from "./sources";

type PracticeScreenProps = {
  source: TextSource;
  length: PracticeLength;
  text: string;
  layout: KeyboardLayout;
  /** The saved attempt once the passage is finished, otherwise null. */
  result: PracticeAttempt | null;
  onComplete: (result: SessionResult) => void;
};

export function PracticeScreen({
  source,
  length,
  text,
  layout,
  result,
  onComplete,
}: PracticeScreenProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>
          <strong>{source.name}</strong>, {length.name.toLowerCase()} (
          {length.words} words)
        </span>
        <Link
          to="/practice"
          className="text-indigo-700 underline dark:text-indigo-300"
        >
          Change settings
        </Link>
      </p>
      {result ? (
        <PracticeResults
          result={result}
          sourceId={source.id}
          lengthId={length.id}
        />
      ) : (
        <TypingSession
          key={text}
          target={text}
          layout={layout}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}

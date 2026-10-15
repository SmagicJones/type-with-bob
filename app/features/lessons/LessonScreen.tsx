import { useState } from "react";

import { Button } from "~/components/ui/Button";
import { ButtonLink } from "~/components/ui/ButtonLink";
import { charName, type KeyboardLayout } from "~/features/keyboard";
import { Bob, getBobMood } from "~/features/mascot";
import {
  TypingSession,
  type SessionResult,
  type TypingStatus,
} from "~/features/typing-area";

import type { Lesson, LessonStatus } from "./types";

function bobCompanion(status: TypingStatus) {
  return <Bob mood={getBobMood({ kind: "typing", ...status })} />;
}

type LessonScreenProps = {
  lesson: Lesson;
  text: string;
  status: LessonStatus;
  layout: KeyboardLayout;
  onComplete: (result: SessionResult) => void;
};

export function LessonScreen({
  lesson,
  text,
  status,
  layout,
  onComplete,
}: LessonScreenProps) {
  const [attempt, setAttempt] = useState(0);

  if (status === "locked") {
    return (
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <p>This lesson is locked. Finish the lessons before it to unlock it.</p>
        <ButtonLink to="/lessons">See all lessons</ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <p>{lesson.description}</p>
        {lesson.newKeys.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span id="new-keys-label">New keys:</span>
            <ul
              aria-labelledby="new-keys-label"
              className="flex flex-wrap gap-1"
            >
              {lesson.newKeys.map((key) => (
                <li key={key}>
                  <kbd className="rounded border border-gray-400 px-1.5 font-mono dark:border-gray-600">
                    {charName(key)}
                  </kbd>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-sm text-gray-700 dark:text-gray-300">
          To pass: {lesson.pass.minAccuracy}% accuracy and {lesson.pass.minWpm}{" "}
          words per minute.
        </p>
      </header>

      <TypingSession
        key={attempt}
        target={text}
        layout={layout}
        onComplete={onComplete}
        companion={bobCompanion}
      />

      <div>
        <Button variant="secondary" onClick={() => setAttempt((n) => n + 1)}>
          Start again
        </Button>
      </div>
    </div>
  );
}

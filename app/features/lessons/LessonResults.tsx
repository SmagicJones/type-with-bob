import { ButtonLink } from "~/components/ui/ButtonLink";
import { Card } from "~/components/ui/Card";
import { Bob, getBobMood } from "~/features/mascot";
import { AttemptSummary, KeyBreakdown } from "~/features/stats";
import type { KeyStats } from "~/features/typing-engine";

import type { Lesson } from "./types";

export type LessonResult = {
  wpm: number;
  accuracy: number;
  elapsedMs: number;
  errors: number;
  keyStats: KeyStats;
  passed: boolean;
};

type LessonResultsProps = {
  lesson: Lesson;
  result: LessonResult;
  nextLesson: Lesson | null;
};

export function LessonResults({
  lesson,
  result,
  nextLesson,
}: LessonResultsProps) {
  const { pass } = lesson;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Results: {lesson.title}</h1>
        <p role="status" className="text-xl font-semibold">
          {result.passed ? (
            <>
              <span aria-hidden="true">🎉 </span>Lesson passed!
            </>
          ) : (
            "Not quite there yet. Have another go!"
          )}
        </p>
        <Bob
          mood={getBobMood({
            kind: "result",
            passed: result.passed,
            accuracy: result.accuracy,
          })}
          message={
            result.passed
              ? "Brilliant work! On to the next one?"
              : "So close! Every try makes your fingers smarter."
          }
        />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          To pass you need {pass.minAccuracy}% accuracy and {pass.minWpm} words
          per minute.
        </p>
      </header>

      <AttemptSummary
        wpm={result.wpm}
        accuracy={result.accuracy}
        elapsedMs={result.elapsedMs}
        errors={result.errors}
      />

      <nav aria-label="Next steps" className="flex flex-wrap gap-3">
        {result.passed && nextLesson && (
          <ButtonLink to={`/lessons/${nextLesson.id}`}>
            Next lesson: {nextLesson.title}
          </ButtonLink>
        )}
        <ButtonLink
          to={`/lessons/${lesson.id}`}
          variant={result.passed ? "secondary" : "primary"}
        >
          Try again
        </ButtonLink>
        <ButtonLink to="/lessons" variant="secondary">
          All lessons
        </ButtonLink>
      </nav>

      <Card aria-labelledby="key-breakdown-heading">
        <h2 id="key-breakdown-heading" className="mb-3 text-xl font-semibold">
          Key by key
        </h2>
        <KeyBreakdown keyStats={result.keyStats} />
      </Card>
    </div>
  );
}

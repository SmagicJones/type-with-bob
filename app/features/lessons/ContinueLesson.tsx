import { ButtonLink } from "~/components/ui/ButtonLink";
import { Card } from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/ProgressBar";

import type { Lesson } from "./types";

type ContinueLessonProps = {
  nextLesson: Lesson | null;
  completedCount: number;
  totalCount: number;
  className?: string;
};

export function ContinueLesson({
  nextLesson,
  completedCount,
  totalCount,
  className = "",
}: ContinueLessonProps) {
  const heading =
    completedCount === 0 ? "Start here" : "Continue where you left off";

  return (
    <Card aria-labelledby="continue-heading" className={className}>
      <h2 id="continue-heading" className="mb-3 text-xl font-semibold">
        {nextLesson ? heading : "Every lesson complete!"}
      </h2>
      {nextLesson ? (
        <div className="flex flex-col items-start gap-3">
          <p>
            <strong>{nextLesson.title}</strong>: {nextLesson.description}
          </p>
          <ButtonLink to={`/lessons/${nextLesson.id}`}>
            Start lesson: {nextLesson.title}
          </ButtonLink>
        </div>
      ) : (
        <p>Amazing work. Keep your skills sharp with free practice.</p>
      )}
      <div className="mt-6 flex flex-col gap-2">
        <p className="text-sm">
          {completedCount} of {totalCount} lessons complete
        </p>
        <ProgressBar
          label="Lessons complete"
          value={completedCount}
          max={totalCount}
        />
      </div>
    </Card>
  );
}

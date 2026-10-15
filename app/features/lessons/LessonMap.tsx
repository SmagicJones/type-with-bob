import { LessonMapItem } from "./LessonMapItem";
import type { Lesson, LessonStatus, Stage } from "./types";

type LessonMapProps = {
  stages: readonly Stage[];
  lessons: readonly Lesson[];
  statuses: ReadonlyMap<string, LessonStatus>;
  className?: string;
};

export function LessonMap({
  stages,
  lessons,
  statuses,
  className = "",
}: LessonMapProps) {
  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {stages.map((stage) => {
        const stageLessons = lessons.filter(
          (lesson) => lesson.stage === stage.id,
        );
        if (stageLessons.length === 0) return null;
        const headingId = `stage-${stage.id}`;
        return (
          <section key={stage.id} aria-labelledby={headingId}>
            <h2 id={headingId} className="mb-3 text-xl font-semibold">
              {stage.title}
            </h2>
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stageLessons.map((lesson) => (
                <LessonMapItem
                  key={lesson.id}
                  lesson={lesson}
                  status={statuses.get(lesson.id) ?? "locked"}
                />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

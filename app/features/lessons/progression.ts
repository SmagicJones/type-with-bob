import type { Summary } from "~/features/typing-engine";

import type { Lesson, LessonStatus, PassCriteria } from "./types";

export function hasPassed(criteria: PassCriteria, summary: Summary): boolean {
  return (
    summary.accuracy >= criteria.minAccuracy && summary.wpm >= criteria.minWpm
  );
}

/**
 * Lessons unlock in order: the first is always open, and each later lesson
 * opens once the one before it is complete.
 */
export function getLessonStatuses(
  lessons: readonly Lesson[],
  completedIds: ReadonlySet<string>,
): Map<string, LessonStatus> {
  const statuses = new Map<string, LessonStatus>();
  let previousComplete = true;
  for (const lesson of lessons) {
    const complete = completedIds.has(lesson.id);
    statuses.set(
      lesson.id,
      complete ? "complete" : previousComplete ? "unlocked" : "locked",
    );
    previousComplete = complete;
  }
  return statuses;
}

/** The first lesson that is unlocked but not complete, or null when all are done. */
export function getNextLesson(
  lessons: readonly Lesson[],
  completedIds: ReadonlySet<string>,
): Lesson | null {
  const statuses = getLessonStatuses(lessons, completedIds);
  return (
    lessons.find((lesson) => statuses.get(lesson.id) === "unlocked") ?? null
  );
}

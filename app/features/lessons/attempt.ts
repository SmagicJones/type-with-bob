import type { LessonAttempt } from "~/features/progress";
import { parseSessionResult } from "~/features/typing-area";

import { hasPassed } from "./progression";
import type { Lesson } from "./types";

type AttemptMeta = { id: string; completedAt: number };

/**
 * Builds a lesson attempt from a submitted session result (`{ summary, keyStats }`),
 * deciding pass or fail against the lesson's thresholds. Returns null if the
 * payload is not a valid result.
 */
export function createLessonAttempt(
  lesson: Lesson,
  payload: unknown,
  { id, completedAt }: AttemptMeta,
): LessonAttempt | null {
  const result = parseSessionResult(payload);
  if (!result) return null;
  return {
    id,
    kind: "lesson",
    lessonId: lesson.id,
    completedAt,
    passed: hasPassed(lesson.pass, result.summary),
    ...result.summary,
    keyStats: result.keyStats,
  };
}

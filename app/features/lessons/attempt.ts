import { isAttempt, type LessonAttempt } from "~/features/progress";

import { hasPassed } from "./progression";
import type { Lesson } from "./types";

type AttemptMeta = { id: string; completedAt: number };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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
  if (!isRecord(payload) || !isRecord(payload.summary)) return null;
  const { wpm, accuracy, elapsedMs, errors } = payload.summary;
  const candidate = {
    id,
    kind: "lesson",
    lessonId: lesson.id,
    completedAt,
    passed: false,
    wpm,
    accuracy,
    elapsedMs,
    errors,
    keyStats: payload.keyStats,
  };
  if (!isAttempt(candidate) || candidate.kind !== "lesson") return null;
  return { ...candidate, passed: hasPassed(lesson.pass, candidate) };
}

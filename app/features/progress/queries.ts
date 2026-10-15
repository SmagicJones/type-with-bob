import type { LessonAttempt, ProgressData } from "./types";

export function getLessonAttempts(data: ProgressData): LessonAttempt[] {
  return data.attempts.filter((a): a is LessonAttempt => a.kind === "lesson");
}

export function getCompletedLessonIds(data: ProgressData): Set<string> {
  return new Set(
    getLessonAttempts(data)
      .filter((attempt) => attempt.passed)
      .map((attempt) => attempt.lessonId),
  );
}

export function getLatestLessonAttempt(
  data: ProgressData,
  lessonId: string,
): LessonAttempt | null {
  return (
    getLessonAttempts(data).findLast((a) => a.lessonId === lessonId) ?? null
  );
}

export function getBestLessonAttempt(
  data: ProgressData,
  lessonId: string,
): LessonAttempt | null {
  const attempts = getLessonAttempts(data).filter(
    (a) => a.lessonId === lessonId,
  );
  return attempts.reduce<LessonAttempt | null>(
    (best, attempt) =>
      best === null || attempt.wpm > best.wpm ? attempt : best,
    null,
  );
}

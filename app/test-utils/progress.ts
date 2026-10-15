import {
  createEmptyProgress,
  type LessonAttempt,
  type PracticeAttempt,
  type ProgressData,
} from "~/features/progress";

let counter = 0;

export function buildLessonAttempt(
  overrides: Partial<LessonAttempt> = {},
): LessonAttempt {
  counter += 1;
  return {
    id: `attempt-${counter}`,
    kind: "lesson",
    lessonId: "home-f-j",
    passed: true,
    completedAt: 1_700_000_000_000 + counter,
    wpm: 20,
    accuracy: 95,
    elapsedMs: 30_000,
    errors: 2,
    keyStats: { f: { attempts: 10, errors: 1, avgLatencyMs: 250 } },
    ...overrides,
  };
}

export function buildPracticeAttempt(
  overrides: Partial<PracticeAttempt> = {},
): PracticeAttempt {
  counter += 1;
  return {
    id: `attempt-${counter}`,
    kind: "practice",
    sourceId: "common-words",
    lengthId: "short",
    completedAt: 1_700_000_000_000 + counter,
    wpm: 25,
    accuracy: 92,
    elapsedMs: 45_000,
    errors: 4,
    keyStats: { a: { attempts: 12, errors: 2, avgLatencyMs: 300 } },
    ...overrides,
  };
}

export function buildProgress(
  overrides: Partial<ProgressData> = {},
): ProgressData {
  return { ...createEmptyProgress(), ...overrides };
}

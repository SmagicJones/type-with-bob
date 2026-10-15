import type { PracticeAttempt } from "~/features/progress";
import { parseSessionResult } from "~/features/typing-area";

type PracticeAttemptMeta = {
  id: string;
  completedAt: number;
  sourceId: string;
  lengthId: string;
};

/** Builds a practice attempt from a submitted session result, or null if it is invalid. */
export function createPracticeAttempt(
  payload: unknown,
  { id, completedAt, sourceId, lengthId }: PracticeAttemptMeta,
): PracticeAttempt | null {
  const result = parseSessionResult(payload);
  if (!result) return null;
  return {
    id,
    kind: "practice",
    sourceId,
    lengthId,
    completedAt,
    ...result.summary,
    keyStats: result.keyStats,
  };
}

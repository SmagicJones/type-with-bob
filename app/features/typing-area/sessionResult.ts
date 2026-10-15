import {
  isKeyStats,
  isSummary,
  type KeyStats,
  type Summary,
} from "~/features/typing-engine";

export type SessionResult = {
  summary: Summary;
  keyStats: KeyStats;
};

/** Validates a session result received from outside (for example, a form submission). */
export function parseSessionResult(payload: unknown): SessionResult | null {
  if (typeof payload !== "object" || payload === null) return null;
  const { summary, keyStats } = payload as Record<string, unknown>;
  if (!isSummary(summary) || !isKeyStats(keyStats)) return null;
  const { wpm, accuracy, elapsedMs, errors } = summary;
  return { summary: { wpm, accuracy, elapsedMs, errors }, keyStats };
}

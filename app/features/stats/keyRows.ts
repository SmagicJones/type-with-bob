import type { KeyStats } from "~/features/typing-engine";

export type KeyRow = {
  char: string;
  attempts: number;
  errors: number;
  /** Percentage of attempts typed correctly, 0–100. */
  accuracy: number;
  avgLatencyMs: number | null;
};

/** Per-key rows, trickiest first: lowest accuracy, then slowest, then by character. */
export function toKeyRows(stats: KeyStats): KeyRow[] {
  return Object.entries(stats)
    .filter(([, stat]) => stat.attempts > 0)
    .map(([char, stat]) => ({
      char,
      attempts: stat.attempts,
      errors: stat.errors,
      accuracy: ((stat.attempts - stat.errors) / stat.attempts) * 100,
      avgLatencyMs: stat.avgLatencyMs,
    }))
    .sort(
      (a, b) =>
        a.accuracy - b.accuracy ||
        (b.avgLatencyMs ?? -1) - (a.avgLatencyMs ?? -1) ||
        a.char.localeCompare(b.char),
    );
}

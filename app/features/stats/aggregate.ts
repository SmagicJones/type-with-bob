import type { KeyStats } from "~/features/typing-engine";

type WithKeyStats = { keyStats: KeyStats };

type Totals = {
  attempts: number;
  errors: number;
  latencyTotal: number;
  latencyWeight: number;
};

/**
 * Combines per-key stats from many attempts. Average latency is weighted by
 * each attempt's correct keystrokes for that key, which is how many latency
 * samples it had (give or take the very first keystroke of a session).
 */
export function aggregateKeyStats(items: readonly WithKeyStats[]): KeyStats {
  const totals = new Map<string, Totals>();
  for (const { keyStats } of items) {
    for (const [char, stat] of Object.entries(keyStats)) {
      const entry = totals.get(char) ?? {
        attempts: 0,
        errors: 0,
        latencyTotal: 0,
        latencyWeight: 0,
      };
      entry.attempts += stat.attempts;
      entry.errors += stat.errors;
      const weight = stat.attempts - stat.errors;
      if (stat.avgLatencyMs !== null && weight > 0) {
        entry.latencyTotal += stat.avgLatencyMs * weight;
        entry.latencyWeight += weight;
      }
      totals.set(char, entry);
    }
  }

  const result: KeyStats = {};
  for (const [char, entry] of totals) {
    result[char] = {
      attempts: entry.attempts,
      errors: entry.errors,
      avgLatencyMs:
        entry.latencyWeight > 0
          ? entry.latencyTotal / entry.latencyWeight
          : null,
    };
  }
  return result;
}

type HistoryItem = { completedAt: number; wpm: number; accuracy: number };

export type HistoryOverview = {
  sessions: number;
  bestWpm: number;
  /** Average over the most recent sessions (up to `recentCount`). */
  recentWpm: number;
  recentAccuracy: number;
};

export function getHistoryOverview(
  items: readonly HistoryItem[],
  recentCount = 10,
): HistoryOverview | null {
  if (items.length === 0) return null;
  const recent = [...items]
    .sort((a, b) => a.completedAt - b.completedAt)
    .slice(-recentCount);
  const average = (values: number[]) =>
    values.reduce((sum, v) => sum + v, 0) / values.length;
  return {
    sessions: items.length,
    bestWpm: Math.max(...items.map((item) => item.wpm)),
    recentWpm: average(recent.map((item) => item.wpm)),
    recentAccuracy: average(recent.map((item) => item.accuracy)),
  };
}

/** The most recent `limit` items, oldest first, ready to plot. */
export function getRecentSeries<T extends HistoryItem>(
  items: readonly T[],
  limit = 30,
): T[] {
  return [...items].sort((a, b) => a.completedAt - b.completedAt).slice(-limit);
}

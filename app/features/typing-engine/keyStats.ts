import type { EngineState, KeyStats } from "./types";

type Accumulator = {
  attempts: number;
  errors: number;
  latencyTotal: number;
  latencySamples: number;
};

/**
 * Per-character stats, keyed by the character that was expected (not the key
 * that was pressed), so errors count against the key the user was aiming for.
 *
 * Latency is the time since the previous keystroke, taken only from the
 * keystroke that typed the character correctly. The very first keystroke has
 * no previous one, so it contributes no latency.
 */
export function getKeyStats(state: EngineState): KeyStats {
  const totals = new Map<string, Accumulator>();

  state.keystrokes.forEach((stroke, index) => {
    const entry = totals.get(stroke.expected) ?? {
      attempts: 0,
      errors: 0,
      latencyTotal: 0,
      latencySamples: 0,
    };
    entry.attempts += 1;

    const previous = state.keystrokes[index - 1];
    if (!stroke.correct) {
      entry.errors += 1;
    } else if (previous) {
      entry.latencyTotal += Math.max(0, stroke.at - previous.at);
      entry.latencySamples += 1;
    }

    totals.set(stroke.expected, entry);
  });

  const stats: KeyStats = {};
  for (const [char, entry] of totals) {
    stats[char] = {
      attempts: entry.attempts,
      errors: entry.errors,
      avgLatencyMs:
        entry.latencySamples > 0
          ? entry.latencyTotal / entry.latencySamples
          : null,
    };
  }
  return stats;
}

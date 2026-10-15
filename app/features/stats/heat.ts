import { findCharKey, type KeyboardLayout } from "~/features/keyboard";
import type { KeyStats } from "~/features/typing-engine";

import { aggregateKeyStats } from "./aggregate";

export type HeatMetric = "errors" | "speed";

/** 0 is best, 4 is worst. */
export type HeatLevel = 0 | 1 | 2 | 3 | 4;

export type KeyHeat = {
  level: HeatLevel;
  /** Short text shown on the key, for example "12%" or "320ms". */
  label: string;
  attempts: number;
};

// Upper bounds for levels 0–3; anything above the last is level 4.
const ERROR_RATE_BANDS = [0.02, 0.05, 0.1, 0.2];
const LATENCY_MS_BANDS = [200, 300, 450, 650];

function band(value: number, bands: readonly number[]): HeatLevel {
  const index = bands.findIndex((limit) => value < limit);
  return (index === -1 ? 4 : index) as HeatLevel;
}

/**
 * Heat per physical key. Characters sharing a key (such as "a" and "A") are
 * combined. Keys with no data for the metric are left out.
 */
export function getKeyHeat(
  layout: KeyboardLayout,
  stats: KeyStats,
  metric: HeatMetric,
): Map<string, KeyHeat> {
  // Re-key each character's stats by the physical key that types it, then combine.
  const byKey = aggregateKeyStats(
    Object.entries(stats).flatMap(([char, stat]) => {
      const found = findCharKey(layout, char);
      return found ? [{ keyStats: { [found.key.id]: stat } }] : [];
    }),
  );

  const heat = new Map<string, KeyHeat>();
  for (const [keyId, stat] of Object.entries(byKey)) {
    if (stat.attempts === 0) continue;
    if (metric === "errors") {
      const rate = stat.errors / stat.attempts;
      heat.set(keyId, {
        level: band(rate, ERROR_RATE_BANDS),
        label: `${Math.round(rate * 100)}%`,
        attempts: stat.attempts,
      });
    } else if (stat.avgLatencyMs !== null) {
      heat.set(keyId, {
        level: band(stat.avgLatencyMs, LATENCY_MS_BANDS),
        label: `${Math.round(stat.avgLatencyMs)}ms`,
        attempts: stat.attempts,
      });
    }
  }
  return heat;
}

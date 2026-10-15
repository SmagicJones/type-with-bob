import type { KeyStat, KeyStats, Summary } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function isKeyStat(value: unknown): value is KeyStat {
  return (
    isRecord(value) &&
    isNonNegative(value.attempts) &&
    isNonNegative(value.errors) &&
    (value.avgLatencyMs === null || isNonNegative(value.avgLatencyMs))
  );
}

export function isKeyStats(value: unknown): value is KeyStats {
  return isRecord(value) && Object.values(value).every(isKeyStat);
}

export function isSummary(value: unknown): value is Summary {
  return (
    isRecord(value) &&
    isNonNegative(value.wpm) &&
    isNonNegative(value.accuracy) &&
    value.accuracy <= 100 &&
    isNonNegative(value.elapsedMs) &&
    isNonNegative(value.errors)
  );
}

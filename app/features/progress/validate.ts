import { DEFAULT_LAYOUT_ID } from "~/features/keyboard";
import type { KeyStat, KeyStats } from "~/features/typing-engine";

import type { Attempt, ProgressData, Settings } from "./types";

export function createEmptyProgress(): ProgressData {
  return {
    version: 1,
    attempts: [],
    settings: { layoutId: DEFAULT_LAYOUT_ID },
  };
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNonNegative(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value !== "";
}

function isKeyStat(value: unknown): value is KeyStat {
  return (
    isRecord(value) &&
    isNonNegative(value.attempts) &&
    isNonNegative(value.errors) &&
    (value.avgLatencyMs === null || isNonNegative(value.avgLatencyMs))
  );
}

function isKeyStats(value: unknown): value is KeyStats {
  return isRecord(value) && Object.values(value).every(isKeyStat);
}

export function isAttempt(value: unknown): value is Attempt {
  if (!isRecord(value)) return false;
  const baseValid =
    isNonEmptyString(value.id) &&
    isNonNegative(value.completedAt) &&
    isNonNegative(value.wpm) &&
    isNonNegative(value.accuracy) &&
    value.accuracy <= 100 &&
    isNonNegative(value.elapsedMs) &&
    isNonNegative(value.errors) &&
    isKeyStats(value.keyStats);
  if (!baseValid) return false;

  switch (value.kind) {
    case "lesson":
      return (
        isNonEmptyString(value.lessonId) && typeof value.passed === "boolean"
      );
    case "practice":
      return (
        isNonEmptyString(value.sourceId) && isNonEmptyString(value.lengthId)
      );
    default:
      return false;
  }
}

function parseSettings(value: unknown): Settings {
  const defaults = createEmptyProgress().settings;
  if (!isRecord(value)) return defaults;
  return {
    layoutId: isNonEmptyString(value.layoutId)
      ? value.layoutId
      : defaults.layoutId,
  };
}

/**
 * Turns whatever was stored into valid progress data. Anything unrecognised
 * falls back to an empty start; individual bad attempts are dropped rather
 * than discarding the whole history.
 */
export function parseProgressData(raw: unknown): ProgressData {
  if (!isRecord(raw) || raw.version !== 1) return createEmptyProgress();
  const attempts = Array.isArray(raw.attempts)
    ? raw.attempts.filter(isAttempt)
    : [];
  return { version: 1, attempts, settings: parseSettings(raw.settings) };
}

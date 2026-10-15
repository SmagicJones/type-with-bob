import type { EngineState, Summary } from "./types";

const CHARS_PER_WORD = 5;
const MS_PER_MINUTE = 60_000;

/**
 * - WPM: (characters typed correctly, including corrected ones, ÷ 5) ÷ minutes
 *   elapsed. Zero when no time has elapsed.
 * - Accuracy: correct keystrokes ÷ all keystrokes, as a percentage. 100 before
 *   any typing, so a fresh session does not open on 0%.
 * - Elapsed time runs from the first keystroke to `finishedAt`, or to `now`
 *   while still in progress.
 */
export function getSummary(state: EngineState, now: number): Summary {
  const elapsedMs =
    state.startedAt === null
      ? 0
      : Math.max(0, (state.finishedAt ?? now) - state.startedAt);

  const wpm =
    elapsedMs > 0
      ? state.position / CHARS_PER_WORD / (elapsedMs / MS_PER_MINUTE)
      : 0;

  const total = state.keystrokes.length;
  const errors = state.keystrokes.filter((k) => !k.correct).length;
  const accuracy = total === 0 ? 100 : ((total - errors) / total) * 100;

  return { wpm, accuracy, elapsedMs, errors };
}

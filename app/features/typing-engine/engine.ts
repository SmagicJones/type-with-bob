import type { CharStatus, EngineState } from "./types";

export function createEngine(target: string): EngineState {
  return {
    target,
    position: 0,
    chars: Array.from({ length: target.length }, (): CharStatus => "pending"),
    keystrokes: [],
    startedAt: null,
    finishedAt: null,
  };
}

export function isComplete(state: EngineState): boolean {
  return state.position >= state.target.length;
}

/** The character the user should type next, or null once complete. */
export function getExpectedChar(state: EngineState): string | null {
  return state.target[state.position] ?? null;
}

/**
 * Applies one key press and returns the next state. The input state is never
 * mutated; when the key is ignored, the same state object is returned.
 *
 * - Stop-on-error: a wrong key marks the character incorrect and the cursor
 *   stays put until the right key is typed, which marks it corrected.
 * - Only single characters count. Named keys such as "Backspace", "Enter" and
 *   "Shift" are ignored. Backspace is deliberately not supported: with
 *   stop-on-error there is never a wrong character behind the cursor to fix.
 * - Keys typed after the target is complete are ignored.
 * - The timer starts on the first counted keystroke, right or wrong.
 */
export function applyKey(
  state: EngineState,
  key: string,
  at: number,
): EngineState {
  const expected = getExpectedChar(state);
  if (expected === null || key.length !== 1) {
    return state;
  }

  const correct = key === expected;
  const current = state.chars[state.position];
  const chars = [...state.chars];
  chars[state.position] = correct
    ? current === "incorrect"
      ? "corrected"
      : "correct"
    : "incorrect";

  const position = correct ? state.position + 1 : state.position;

  return {
    ...state,
    position,
    chars,
    keystrokes: [...state.keystrokes, { key, expected, correct, at }],
    startedAt: state.startedAt ?? at,
    finishedAt: position === state.target.length ? at : null,
  };
}

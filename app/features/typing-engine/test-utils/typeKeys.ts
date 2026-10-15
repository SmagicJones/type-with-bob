import { applyKey } from "../engine";
import type { EngineState } from "../types";

type TypeKeysOptions = {
  /** Timestamp of the first keystroke. */
  startAt?: number;
  /** Milliseconds between keystrokes. */
  intervalMs?: number;
};

/** Applies each character of `keys` in turn, one `intervalMs` apart. */
export function typeKeys(
  state: EngineState,
  keys: string,
  { startAt = 0, intervalMs = 100 }: TypeKeysOptions = {},
): EngineState {
  return [...keys].reduce(
    (current, key, index) =>
      applyKey(current, key, startAt + index * intervalMs),
    state,
  );
}

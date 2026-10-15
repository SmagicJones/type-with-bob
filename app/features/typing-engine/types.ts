export type CharStatus = "pending" | "correct" | "incorrect" | "corrected";

export type Keystroke = {
  key: string;
  expected: string;
  correct: boolean;
  /** Caller-supplied timestamp in milliseconds. */
  at: number;
};

export type EngineState = {
  target: string;
  /** Index of the next character to type. Equals `target.length` when complete. */
  position: number;
  /** Status per target character. */
  chars: readonly CharStatus[];
  /** Every character keystroke recorded, including wrong ones. */
  keystrokes: readonly Keystroke[];
  /** Timestamp of the first keystroke, or null before typing starts. */
  startedAt: number | null;
  /** Timestamp of the keystroke that completed the target. */
  finishedAt: number | null;
};

export type Summary = {
  wpm: number;
  /** Percentage, 0–100. */
  accuracy: number;
  elapsedMs: number;
  errors: number;
};

export type KeyStat = {
  attempts: number;
  errors: number;
  /** Null when no latency has been measured for this key yet. */
  avgLatencyMs: number | null;
};

export type KeyStats = Record<string, KeyStat>;

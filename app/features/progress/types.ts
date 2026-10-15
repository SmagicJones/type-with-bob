import type { KeyStats } from "~/features/typing-engine";

type AttemptBase = {
  id: string;
  /** Epoch milliseconds. */
  completedAt: number;
  wpm: number;
  accuracy: number;
  elapsedMs: number;
  errors: number;
  keyStats: KeyStats;
};

export type LessonAttempt = AttemptBase & {
  kind: "lesson";
  lessonId: string;
  passed: boolean;
};

export type PracticeAttempt = AttemptBase & {
  kind: "practice";
  sourceId: string;
  lengthId: string;
};

export type Attempt = LessonAttempt | PracticeAttempt;

export type Settings = {
  layoutId: string;
};

export type ProgressData = {
  version: 1;
  /** Oldest first. */
  attempts: readonly Attempt[];
  settings: Settings;
};

/** Where progress lives. Components use this, never `localStorage` directly. */
export type ProgressStore = {
  load(): ProgressData;
  addAttempt(attempt: Attempt): void;
  updateSettings(settings: Partial<Settings>): void;
  clear(): void;
};

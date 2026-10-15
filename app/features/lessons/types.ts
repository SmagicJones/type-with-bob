export type StageId =
  | "home-row"
  | "top-row"
  | "bottom-row"
  | "capitals"
  | "numbers"
  | "punctuation";

export type Stage = {
  id: StageId;
  title: string;
};

export type PassCriteria = {
  /** Minimum accuracy, as a percentage. */
  minAccuracy: number;
  minWpm: number;
};

export type Lesson = {
  id: string;
  stage: StageId;
  title: string;
  description: string;
  /** Characters this lesson introduces. Empty for review lessons. */
  newKeys: readonly string[];
  /** Characters the generated drill concentrates on; defaults to `newKeys`. */
  focusKeys?: readonly string[];
  /** Authored practice lines, typed after the generated drill. */
  lines: readonly string[];
  pass: PassCriteria;
};

export type LessonStatus = "locked" | "unlocked" | "complete";

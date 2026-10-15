export type BobMood = "idle" | "happy" | "encouraging";

export type BobSituation =
  | { kind: "idle" }
  | {
      kind: "typing";
      /** True while the current character is wrong. */
      onMistake: boolean;
      accuracy: number;
      keystrokes: number;
    }
  | {
      kind: "result";
      /** Null for practice, which has no pass mark. */
      passed: boolean | null;
      accuracy: number;
    };

/** Accuracy below this, once there are enough keystrokes to judge, earns some encouragement. */
export const STRUGGLE_ACCURACY = 85;
export const MIN_KEYSTROKES_TO_JUDGE = 10;
/** Practice results at or above this accuracy count as a success. */
export const PRACTICE_SUCCESS_ACCURACY = 90;

export function getBobMood(situation: BobSituation): BobMood {
  switch (situation.kind) {
    case "idle":
      return "idle";
    case "typing": {
      const struggling =
        situation.keystrokes >= MIN_KEYSTROKES_TO_JUDGE &&
        situation.accuracy < STRUGGLE_ACCURACY;
      return situation.onMistake || struggling ? "encouraging" : "idle";
    }
    case "result": {
      const success =
        situation.passed ?? situation.accuracy >= PRACTICE_SUCCESS_ACCURACY;
      return success ? "happy" : "encouraging";
    }
  }
}

export const BOB_MESSAGES: Record<BobMood, string> = {
  idle: "Ready when you are!",
  happy: "Brilliant work!",
  encouraging: "Keep going, you've got this!",
};

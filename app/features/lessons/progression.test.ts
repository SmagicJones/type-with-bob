import { describe, expect, it } from "vitest";

import { buildLesson } from "./test-utils/buildLesson";
import { getLessonStatuses, getNextLesson, hasPassed } from "./progression";

const summary = (wpm: number, accuracy: number) => ({
  wpm,
  accuracy,
  elapsedMs: 60_000,
  errors: 0,
});

describe("hasPassed", () => {
  const criteria = { minAccuracy: 90, minWpm: 5 };

  it("passes when both thresholds are met exactly", () => {
    expect(hasPassed(criteria, summary(5, 90))).toBe(true);
  });

  it("fails on low accuracy", () => {
    expect(hasPassed(criteria, summary(40, 89.9))).toBe(false);
  });

  it("fails on low speed", () => {
    expect(hasPassed(criteria, summary(4.9, 100))).toBe(false);
  });
});

describe("getLessonStatuses", () => {
  const lessons = ["a", "b", "c"].map((id) => buildLesson({ id }));

  it("unlocks only the first lesson at the start", () => {
    expect([...getLessonStatuses(lessons, new Set()).values()]).toEqual([
      "unlocked",
      "locked",
      "locked",
    ]);
  });

  it("unlocks the next lesson once one is complete", () => {
    expect([...getLessonStatuses(lessons, new Set(["a"])).values()]).toEqual([
      "complete",
      "unlocked",
      "locked",
    ]);
  });

  it("keeps a lesson complete even if an earlier one is not", () => {
    // Can happen if the curriculum gains a lesson in front of completed ones.
    expect([...getLessonStatuses(lessons, new Set(["b"])).values()]).toEqual([
      "unlocked",
      "complete",
      "unlocked",
    ]);
  });

  it("ignores completed ids that are not in the curriculum", () => {
    expect(getLessonStatuses(lessons, new Set(["zzz"])).get("a")).toBe(
      "unlocked",
    );
  });
});

describe("getNextLesson", () => {
  const lessons = ["a", "b"].map((id) => buildLesson({ id }));

  it("returns the first unlocked, incomplete lesson", () => {
    expect(getNextLesson(lessons, new Set(["a"]))?.id).toBe("b");
  });

  it("returns null when every lesson is complete", () => {
    expect(getNextLesson(lessons, new Set(["a", "b"]))).toBeNull();
  });
});

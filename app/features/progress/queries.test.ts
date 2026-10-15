import { describe, expect, it } from "vitest";

import {
  getBestLessonAttempt,
  getCompletedLessonIds,
  getLatestLessonAttempt,
  getLatestPracticeAttempt,
  getLessonAttempts,
} from "./queries";
import {
  buildLessonAttempt,
  buildPracticeAttempt,
  buildProgress,
} from "~/test-utils/progress";

describe("progress queries", () => {
  const passedA = buildLessonAttempt({ lessonId: "a", passed: true, wpm: 10 });
  const failedB = buildLessonAttempt({ lessonId: "b", passed: false, wpm: 30 });
  const laterA = buildLessonAttempt({ lessonId: "a", passed: false, wpm: 15 });
  const practice = buildPracticeAttempt();
  const data = buildProgress({
    attempts: [passedA, failedB, practice, laterA],
  });

  it("lists only lesson attempts", () => {
    expect(getLessonAttempts(data)).toEqual([passedA, failedB, laterA]);
  });

  it("counts a lesson complete once any attempt passed", () => {
    expect(getCompletedLessonIds(data)).toEqual(new Set(["a"]));
  });

  it("finds the most recent attempt for a lesson", () => {
    expect(getLatestLessonAttempt(data, "a")).toEqual(laterA);
  });

  it("returns null when a lesson has no attempts", () => {
    expect(getLatestLessonAttempt(data, "zzz")).toBeNull();
    expect(getBestLessonAttempt(data, "zzz")).toBeNull();
  });

  it("finds the fastest attempt for a lesson", () => {
    expect(getBestLessonAttempt(data, "a")).toEqual(laterA);
  });

  it("finds the most recent practice attempt", () => {
    expect(getLatestPracticeAttempt(data)).toEqual(practice);
    expect(getLatestPracticeAttempt(buildProgress())).toBeNull();
  });

  it("handles empty progress", () => {
    const empty = buildProgress();

    expect(getLessonAttempts(empty)).toEqual([]);
    expect(getCompletedLessonIds(empty)).toEqual(new Set());
  });
});

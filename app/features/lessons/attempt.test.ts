import { describe, expect, it } from "vitest";

import { createLessonAttempt } from "./attempt";
import { buildLesson } from "./test-utils/buildLesson";

const lesson = buildLesson({
  id: "home-f-j",
  pass: { minAccuracy: 90, minWpm: 5 },
});
const meta = { id: "abc", completedAt: 1_700_000_000_000 };
const keyStats = { f: { attempts: 2, errors: 0, avgLatencyMs: 120 } };

function payload(summary: Record<string, unknown>) {
  return {
    summary: {
      wpm: 20,
      accuracy: 95,
      elapsedMs: 10_000,
      errors: 1,
      ...summary,
    },
    keyStats,
  };
}

describe("createLessonAttempt", () => {
  it("builds a passed attempt when thresholds are met", () => {
    expect(createLessonAttempt(lesson, payload({}), meta)).toEqual({
      id: "abc",
      kind: "lesson",
      lessonId: "home-f-j",
      completedAt: 1_700_000_000_000,
      passed: true,
      wpm: 20,
      accuracy: 95,
      elapsedMs: 10_000,
      errors: 1,
      keyStats,
    });
  });

  it("marks the attempt failed below the accuracy threshold", () => {
    expect(
      createLessonAttempt(lesson, payload({ accuracy: 80 }), meta)?.passed,
    ).toBe(false);
  });

  it("marks the attempt failed below the speed threshold", () => {
    expect(createLessonAttempt(lesson, payload({ wpm: 3 }), meta)?.passed).toBe(
      false,
    );
  });

  it.each([
    ["nothing", undefined],
    ["a string", "done"],
    ["no summary", { keyStats }],
    ["a bad summary value", payload({ wpm: "fast" })],
    ["missing key stats", { summary: payload({}).summary }],
  ])("rejects %s", (_label, body) => {
    expect(createLessonAttempt(lesson, body, meta)).toBeNull();
  });
});

import { describe, expect, it } from "vitest";

import { createPracticeAttempt } from "./attempt";

const meta = {
  id: "p1",
  completedAt: 1_700_000_000_000,
  sourceId: "proverbs",
  lengthId: "short",
};
const summary = { wpm: 30, accuracy: 97, elapsedMs: 20_000, errors: 1 };
const keyStats = { a: { attempts: 3, errors: 1, avgLatencyMs: 180 } };

describe("createPracticeAttempt", () => {
  it("builds a practice attempt from a valid result", () => {
    expect(createPracticeAttempt({ summary, keyStats }, meta)).toEqual({
      id: "p1",
      kind: "practice",
      sourceId: "proverbs",
      lengthId: "short",
      completedAt: 1_700_000_000_000,
      ...summary,
      keyStats,
    });
  });

  it("rejects an invalid result", () => {
    expect(createPracticeAttempt({ summary: "fast" }, meta)).toBeNull();
  });
});

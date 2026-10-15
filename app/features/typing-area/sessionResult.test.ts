import { describe, expect, it } from "vitest";

import { parseSessionResult } from "./sessionResult";

const summary = { wpm: 20, accuracy: 95, elapsedMs: 10_000, errors: 1 };
const keyStats = { f: { attempts: 2, errors: 0, avgLatencyMs: 120 } };

describe("parseSessionResult", () => {
  it("returns a valid result", () => {
    expect(parseSessionResult({ summary, keyStats })).toEqual({
      summary,
      keyStats,
    });
  });

  it("drops unexpected summary fields", () => {
    expect(
      parseSessionResult({ summary: { ...summary, extra: "x" }, keyStats })
        ?.summary,
    ).toEqual(summary);
  });

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["a string", "done"],
    ["a missing summary", { keyStats }],
    ["missing key stats", { summary }],
    ["a bad summary", { summary: { ...summary, wpm: "fast" }, keyStats }],
  ])("rejects %s", (_label, payload) => {
    expect(parseSessionResult(payload)).toBeNull();
  });
});

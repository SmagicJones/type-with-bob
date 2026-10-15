import { describe, expect, it } from "vitest";

import { createEngine } from "./engine";
import { getSummary } from "./summary";
import { typeKeys } from "./test-utils/typeKeys";

describe("getSummary", () => {
  it("returns zeros and full accuracy before any typing", () => {
    expect(getSummary(createEngine("abc"), 5000)).toEqual({
      wpm: 0,
      accuracy: 100,
      elapsedMs: 0,
      errors: 0,
    });
  });

  it("returns zero WPM for an empty target", () => {
    expect(getSummary(createEngine(""), 5000).wpm).toBe(0);
  });

  it("calculates WPM as (correct characters / 5) per minute", () => {
    // 10 keystrokes span 9 intervals, so the first and last are 1 minute apart.
    const state = typeKeys(createEngine("abcdefghij"), "abcdefghij", {
      startAt: 0,
      intervalMs: 60_000 / 9,
    });

    // 10 chars / 5 = 2 words over exactly 1 minute.
    expect(getSummary(state, 999_999).wpm).toBeCloseTo(2);
  });

  it("measures elapsed time up to `now` while typing is in progress", () => {
    const state = typeKeys(createEngine("abcdef"), "abc", { startAt: 1000 });

    expect(getSummary(state, 31_000).elapsedMs).toBe(30_000);
  });

  it("stops the clock at finishedAt once complete", () => {
    const state = typeKeys(createEngine("ab"), "ab", {
      startAt: 1000,
      intervalMs: 500,
    });

    expect(getSummary(state, 99_999).elapsedMs).toBe(500);
  });

  it("returns zero WPM rather than dividing by zero elapsed time", () => {
    const state = typeKeys(createEngine("abc"), "abc", { intervalMs: 0 });
    const summary = getSummary(state, 0);

    expect(summary.wpm).toBe(0);
    expect(Number.isFinite(summary.wpm)).toBe(true);
  });

  it("counts corrected characters towards WPM", () => {
    const clean = typeKeys(createEngine("ab"), "ab", { intervalMs: 1000 });
    const corrected = typeKeys(createEngine("ab"), "xab", { intervalMs: 500 });

    expect(getSummary(corrected, 0).wpm).toBeCloseTo(getSummary(clean, 0).wpm);
  });

  it("calculates accuracy over every keystroke, including wrong attempts", () => {
    // 4 keystrokes, 1 wrong.
    const state = typeKeys(createEngine("abc"), "axbc");

    expect(getSummary(state, 0).accuracy).toBe(75);
  });

  it("counts every wrong keystroke as an error", () => {
    const state = typeKeys(createEngine("ab"), "xyazb");

    expect(getSummary(state, 0).errors).toBe(3);
  });

  it("returns zero accuracy when every keystroke is wrong", () => {
    const state = typeKeys(createEngine("a"), "xyz");

    expect(getSummary(state, 0).accuracy).toBe(0);
  });

  it("never reports negative elapsed time if `now` is before the start", () => {
    const state = typeKeys(createEngine("abc"), "a", { startAt: 5000 });

    expect(getSummary(state, 1000).elapsedMs).toBe(0);
  });
});

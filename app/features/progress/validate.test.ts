import { describe, expect, it } from "vitest";

import {
  buildLessonAttempt,
  buildPracticeAttempt,
} from "./test-utils/factories";
import { createEmptyProgress, isAttempt, parseProgressData } from "./validate";

describe("parseProgressData", () => {
  it("accepts valid data unchanged", () => {
    const data = {
      version: 1,
      attempts: [buildLessonAttempt(), buildPracticeAttempt()],
      settings: { layoutId: "us-qwerty" },
    };

    expect(parseProgressData(data)).toEqual(data);
  });

  it.each([
    ["null", null],
    ["a string", "hello"],
    ["a number", 42],
    ["an array", []],
    ["an empty object", {}],
    ["a different version", { version: 2, attempts: [], settings: {} }],
  ])("starts fresh when given %s", (_label, raw) => {
    expect(parseProgressData(raw)).toEqual(createEmptyProgress());
  });

  it("drops invalid attempts but keeps valid ones", () => {
    const good = buildLessonAttempt();
    const raw = {
      version: 1,
      attempts: [good, { id: "broken" }, null, "nope"],
      settings: { layoutId: "uk-qwerty" },
    };

    expect(parseProgressData(raw).attempts).toEqual([good]);
  });

  it("treats a non-array attempts field as no attempts", () => {
    expect(
      parseProgressData({ version: 1, attempts: "lots", settings: {} })
        .attempts,
    ).toEqual([]);
  });

  it("falls back to default settings when they are missing or bad", () => {
    const defaults = createEmptyProgress().settings;

    expect(parseProgressData({ version: 1, attempts: [] }).settings).toEqual(
      defaults,
    );
    expect(
      parseProgressData({ version: 1, attempts: [], settings: { layoutId: 7 } })
        .settings,
    ).toEqual(defaults);
  });
});

describe("isAttempt", () => {
  it("accepts lesson and practice attempts", () => {
    expect(isAttempt(buildLessonAttempt())).toBe(true);
    expect(isAttempt(buildPracticeAttempt())).toBe(true);
  });

  it("accepts key stats with no latency yet", () => {
    expect(
      isAttempt(
        buildLessonAttempt({
          keyStats: { f: { attempts: 1, errors: 0, avgLatencyMs: null } },
        }),
      ),
    ).toBe(true);
  });

  it.each([
    ["an unknown kind", { kind: "game" }],
    ["a missing id", { id: "" }],
    ["a negative WPM", { wpm: -1 }],
    ["an infinite WPM", { wpm: Infinity }],
    ["NaN accuracy", { accuracy: Number.NaN }],
    ["accuracy over 100", { accuracy: 101 }],
    ["a string for errors", { errors: "3" }],
    ["a missing lesson id", { lessonId: "" }],
    ["a non-boolean pass flag", { passed: "yes" }],
    ["bad key stats", { keyStats: { f: { attempts: "x" } } }],
    ["key stats as an array", { keyStats: [] }],
  ])("rejects %s", (_label, override) => {
    expect(isAttempt({ ...buildLessonAttempt(), ...override })).toBe(false);
  });

  it("rejects a practice attempt without a source", () => {
    expect(isAttempt({ ...buildPracticeAttempt(), sourceId: "" })).toBe(false);
  });
});

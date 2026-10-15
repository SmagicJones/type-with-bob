import { describe, expect, it } from "vitest";

import { isKeyStat, isKeyStats, isSummary } from "./validate";

describe("isKeyStat", () => {
  it("accepts a stat with or without latency", () => {
    expect(isKeyStat({ attempts: 2, errors: 1, avgLatencyMs: 150 })).toBe(true);
    expect(isKeyStat({ attempts: 1, errors: 0, avgLatencyMs: null })).toBe(
      true,
    );
  });

  it.each([
    ["null", null],
    ["missing latency", { attempts: 1, errors: 0 }],
    ["negative attempts", { attempts: -1, errors: 0, avgLatencyMs: null }],
    ["string errors", { attempts: 1, errors: "0", avgLatencyMs: null }],
    ["infinite latency", { attempts: 1, errors: 0, avgLatencyMs: Infinity }],
  ])("rejects %s", (_label, value) => {
    expect(isKeyStat(value)).toBe(false);
  });
});

describe("isKeyStats", () => {
  it("accepts an empty record and a record of valid stats", () => {
    expect(isKeyStats({})).toBe(true);
    expect(
      isKeyStats({ f: { attempts: 1, errors: 0, avgLatencyMs: null } }),
    ).toBe(true);
  });

  it("rejects arrays and records containing a bad stat", () => {
    expect(isKeyStats([])).toBe(false);
    expect(isKeyStats({ f: { attempts: "x" } })).toBe(false);
  });
});

describe("isSummary", () => {
  const valid = { wpm: 20, accuracy: 95, elapsedMs: 1000, errors: 1 };

  it("accepts a valid summary", () => {
    expect(isSummary(valid)).toBe(true);
  });

  it.each([
    ["not an object", "fast"],
    ["NaN WPM", { ...valid, wpm: Number.NaN }],
    ["accuracy over 100", { ...valid, accuracy: 100.5 }],
    ["negative time", { ...valid, elapsedMs: -1 }],
    ["missing errors", { wpm: 1, accuracy: 1, elapsedMs: 1 }],
  ])("rejects %s", (_label, value) => {
    expect(isSummary(value)).toBe(false);
  });
});

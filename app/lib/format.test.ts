import { describe, expect, it } from "vitest";

import { formatDuration, formatPercent, formatWpm } from "./format";

describe("formatWpm", () => {
  it("rounds to a whole number", () => {
    expect(formatWpm(23.6)).toBe("24");
    expect(formatWpm(0)).toBe("0");
  });
});

describe("formatPercent", () => {
  it("rounds and adds a percent sign", () => {
    expect(formatPercent(87.4)).toBe("87%");
    expect(formatPercent(100)).toBe("100%");
  });
});

describe("formatDuration", () => {
  it.each([
    [0, "0:00"],
    [999, "0:00"],
    [5_000, "0:05"],
    [75_000, "1:15"],
    [600_000, "10:00"],
    [-500, "0:00"],
  ])("formats %d ms as %s", (ms, expected) => {
    expect(formatDuration(ms)).toBe(expected);
  });
});

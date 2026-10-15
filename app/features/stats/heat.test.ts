import { describe, expect, it } from "vitest";

import { getLayout } from "~/features/keyboard";

import { getKeyHeat } from "./heat";

const uk = getLayout("uk-qwerty");

describe("getKeyHeat", () => {
  it("returns nothing for no stats", () => {
    expect(getKeyHeat(uk, {}, "errors").size).toBe(0);
  });

  it.each([
    [0, 0],
    [1, 0], // 1%
    [3, 1], // 3%
    [7, 2], // 7%
    [15, 3], // 15%
    [40, 4], // 40%
  ])("puts %d errors in 100 attempts at level %d", (errors, level) => {
    const heat = getKeyHeat(
      uk,
      { f: { attempts: 100, errors, avgLatencyMs: 200 } },
      "errors",
    );

    expect(heat.get("KeyF")?.level).toBe(level);
    expect(heat.get("KeyF")?.label).toBe(`${errors}%`);
  });

  it.each([
    [150, 0],
    [250, 1],
    [400, 2],
    [600, 3],
    [900, 4],
  ])("puts %dms average latency at level %d", (latency, level) => {
    const heat = getKeyHeat(
      uk,
      { j: { attempts: 5, errors: 0, avgLatencyMs: latency } },
      "speed",
    );

    expect(heat.get("KeyJ")).toEqual({
      level,
      label: `${latency}ms`,
      attempts: 5,
    });
  });

  it("combines lowercase and capitals on the same key", () => {
    const heat = getKeyHeat(
      uk,
      {
        a: { attempts: 8, errors: 0, avgLatencyMs: 200 },
        A: { attempts: 2, errors: 2, avgLatencyMs: null },
      },
      "errors",
    );

    expect(heat.get("KeyA")).toEqual({ level: 4, label: "20%", attempts: 10 });
  });

  it("leaves out keys with no latency when showing speed", () => {
    const heat = getKeyHeat(
      uk,
      { f: { attempts: 2, errors: 2, avgLatencyMs: null } },
      "speed",
    );

    expect(heat.has("KeyF")).toBe(false);
  });

  it("ignores characters the layout cannot type and keys with no attempts", () => {
    const heat = getKeyHeat(
      uk,
      {
        é: { attempts: 3, errors: 1, avgLatencyMs: 100 },
        f: { attempts: 0, errors: 0, avgLatencyMs: null },
      },
      "errors",
    );

    expect(heat.size).toBe(0);
  });

  it("places space on the space bar", () => {
    const heat = getKeyHeat(
      uk,
      { " ": { attempts: 4, errors: 1, avgLatencyMs: 150 } },
      "errors",
    );

    expect(heat.get("Space")?.label).toBe("25%");
  });
});

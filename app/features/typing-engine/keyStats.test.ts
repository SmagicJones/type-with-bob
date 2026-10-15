import { describe, expect, it } from "vitest";

import { applyKey, createEngine } from "./engine";
import { getKeyStats } from "./keyStats";
import { typeKeys } from "./test-utils/typeKeys";

describe("getKeyStats", () => {
  it("returns no stats before any typing", () => {
    expect(getKeyStats(createEngine("abc"))).toEqual({});
  });

  it("gives the first keystroke no latency", () => {
    const state = applyKey(createEngine("ab"), "a", 1000);

    expect(getKeyStats(state)).toEqual({
      a: { attempts: 1, errors: 0, avgLatencyMs: null },
    });
  });

  it("measures latency as the time since the previous keystroke", () => {
    const state = typeKeys(createEngine("ab"), "ab", { intervalMs: 300 });

    expect(getKeyStats(state).b).toEqual({
      attempts: 1,
      errors: 0,
      avgLatencyMs: 300,
    });
  });

  it("attributes attempts and errors to the expected character, not the key pressed", () => {
    const state = typeKeys(createEngine("ab"), "axxb");

    expect(getKeyStats(state)).toEqual({
      a: { attempts: 1, errors: 0, avgLatencyMs: null },
      b: { attempts: 3, errors: 2, avgLatencyMs: 100 },
    });
    expect(getKeyStats(state)).not.toHaveProperty("x");
  });

  it("only takes latency from the correct keystroke for a character", () => {
    let state = createEngine("ab");
    state = applyKey(state, "a", 0);
    state = applyKey(state, "x", 1000); // wrong: no latency sample
    state = applyKey(state, "b", 1200); // correct: 200ms since the wrong key

    expect(getKeyStats(state).b?.avgLatencyMs).toBe(200);
  });

  it("averages latency across repeated characters", () => {
    let state = createEngine("aaa");
    state = applyKey(state, "a", 0);
    state = applyKey(state, "a", 100);
    state = applyKey(state, "a", 400);

    // Samples: 100ms and 300ms (the first keystroke has none).
    expect(getKeyStats(state).a).toEqual({
      attempts: 3,
      errors: 0,
      avgLatencyMs: 200,
    });
  });

  it("keeps upper and lower case separate", () => {
    const state = typeKeys(createEngine("aA"), "aA");

    expect(Object.keys(getKeyStats(state)).sort()).toEqual(["A", "a"]);
  });

  it("records spaces under the space character", () => {
    const state = typeKeys(createEngine("a b"), "a b");

    expect(getKeyStats(state)[" "]).toEqual({
      attempts: 1,
      errors: 0,
      avgLatencyMs: 100,
    });
  });

  it("clamps latency to zero if timestamps go backwards", () => {
    let state = createEngine("ab");
    state = applyKey(state, "a", 500);
    state = applyKey(state, "b", 400);

    expect(getKeyStats(state).b?.avgLatencyMs).toBe(0);
  });

  it("handles a character with only errors so far", () => {
    const state = typeKeys(createEngine("ab"), "axx");

    expect(getKeyStats(state).b).toEqual({
      attempts: 2,
      errors: 2,
      avgLatencyMs: null,
    });
  });
});

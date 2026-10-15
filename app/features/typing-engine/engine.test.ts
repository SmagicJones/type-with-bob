import { describe, expect, it } from "vitest";

import { applyKey, createEngine, getExpectedChar, isComplete } from "./engine";
import { typeKeys } from "./test-utils/typeKeys";

describe("createEngine", () => {
  it("starts with every character pending and no timings", () => {
    const state = createEngine("abc");

    expect(state).toEqual({
      target: "abc",
      position: 0,
      chars: ["pending", "pending", "pending"],
      keystrokes: [],
      startedAt: null,
      finishedAt: null,
    });
  });

  it("treats an empty target as already complete", () => {
    const state = createEngine("");

    expect(isComplete(state)).toBe(true);
    expect(getExpectedChar(state)).toBeNull();
  });
});

describe("applyKey", () => {
  it("advances and marks the character correct on the right key", () => {
    const state = applyKey(createEngine("ab"), "a", 1000);

    expect(state.position).toBe(1);
    expect(state.chars).toEqual(["correct", "pending"]);
    expect(state.keystrokes).toEqual([
      { key: "a", expected: "a", correct: true, at: 1000 },
    ]);
  });

  it("does not advance on a wrong key and marks the character incorrect", () => {
    const state = applyKey(createEngine("ab"), "x", 1000);

    expect(state.position).toBe(0);
    expect(state.chars).toEqual(["incorrect", "pending"]);
    expect(state.keystrokes).toEqual([
      { key: "x", expected: "a", correct: false, at: 1000 },
    ]);
  });

  it("records every wrong attempt", () => {
    const state = typeKeys(createEngine("a"), "xyz");

    expect(state.keystrokes).toHaveLength(3);
    expect(state.keystrokes.every((k) => !k.correct)).toBe(true);
  });

  it("marks a character corrected when the right key follows a mistake", () => {
    const state = typeKeys(createEngine("ab"), "xa");

    expect(state.position).toBe(1);
    expect(state.chars).toEqual(["corrected", "pending"]);
  });

  it("is case-sensitive", () => {
    const state = applyKey(createEngine("A"), "a", 0);

    expect(state.chars).toEqual(["incorrect"]);
  });

  it("starts the timer on the first keystroke, even a wrong one", () => {
    const state = typeKeys(createEngine("ab"), "xa", { startAt: 500 });

    expect(state.startedAt).toBe(500);
  });

  it("does not move the start time on later keystrokes", () => {
    const state = typeKeys(createEngine("abc"), "ab", { startAt: 500 });

    expect(state.startedAt).toBe(500);
  });

  it("sets finishedAt on the keystroke that completes the target", () => {
    const state = typeKeys(createEngine("ab"), "ab", {
      startAt: 0,
      intervalMs: 250,
    });

    expect(isComplete(state)).toBe(true);
    expect(state.finishedAt).toBe(250);
  });

  it("ignores keys typed past the end", () => {
    const finished = typeKeys(createEngine("a"), "a");

    expect(applyKey(finished, "b", 9999)).toBe(finished);
  });

  it("ignores Backspace, including at position zero", () => {
    const fresh = createEngine("ab");
    const midway = applyKey(fresh, "a", 0);

    expect(applyKey(fresh, "Backspace", 0)).toBe(fresh);
    expect(applyKey(midway, "Backspace", 100)).toBe(midway);
  });

  it.each(["Enter", "Tab", "Shift", "ArrowLeft", ""])(
    "ignores the non-character key %j",
    (key) => {
      const state = createEngine("a");

      expect(applyKey(state, key, 0)).toBe(state);
    },
  );

  it("does not start the timer on an ignored key", () => {
    const state = applyKey(createEngine("a"), "Backspace", 100);

    expect(state.startedAt).toBeNull();
  });

  it("accepts spaces and punctuation", () => {
    const state = typeKeys(createEngine("a, b£"), "a, b£");

    expect(isComplete(state)).toBe(true);
    expect(state.chars.every((c) => c === "correct")).toBe(true);
  });

  it("handles rapid keystrokes with identical timestamps", () => {
    const state = typeKeys(createEngine("abc"), "abc", { intervalMs: 0 });

    expect(isComplete(state)).toBe(true);
    expect(state.startedAt).toBe(0);
    expect(state.finishedAt).toBe(0);
  });

  it("does not mutate the previous state", () => {
    const before = createEngine("ab");
    const snapshot = structuredClone(before);

    applyKey(before, "x", 0);
    applyKey(before, "a", 0);

    expect(before).toEqual(snapshot);
  });
});

describe("getExpectedChar", () => {
  it("returns the next character to type", () => {
    const state = applyKey(createEngine("ab"), "a", 0);

    expect(getExpectedChar(state)).toBe("b");
  });

  it("returns null once complete", () => {
    expect(getExpectedChar(typeKeys(createEngine("a"), "a"))).toBeNull();
  });
});

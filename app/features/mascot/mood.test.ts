import { describe, expect, it } from "vitest";

import { getBobMood } from "./mood";

const typing = (
  overrides: Partial<{
    onMistake: boolean;
    accuracy: number;
    keystrokes: number;
  }>,
) =>
  ({
    kind: "typing",
    onMistake: false,
    accuracy: 100,
    keystrokes: 20,
    ...overrides,
  }) as const;

describe("getBobMood", () => {
  it("is idle when nothing is happening", () => {
    expect(getBobMood({ kind: "idle" })).toBe("idle");
  });

  describe("while typing", () => {
    it("stays idle while things are going well", () => {
      expect(getBobMood(typing({}))).toBe("idle");
    });

    it("encourages on a mistake", () => {
      expect(getBobMood(typing({ onMistake: true }))).toBe("encouraging");
    });

    it("encourages when accuracy is low", () => {
      expect(getBobMood(typing({ accuracy: 84.9 }))).toBe("encouraging");
    });

    it("does not judge accuracy from the first few keystrokes", () => {
      expect(getBobMood(typing({ accuracy: 50, keystrokes: 9 }))).toBe("idle");
    });

    it("stays idle at exactly the struggle threshold", () => {
      expect(getBobMood(typing({ accuracy: 85, keystrokes: 10 }))).toBe("idle");
    });
  });

  describe("after a session", () => {
    it("is happy after passing a lesson", () => {
      expect(getBobMood({ kind: "result", passed: true, accuracy: 91 })).toBe(
        "happy",
      );
    });

    it("encourages after failing a lesson, whatever the accuracy", () => {
      expect(getBobMood({ kind: "result", passed: false, accuracy: 99 })).toBe(
        "encouraging",
      );
    });

    it("is happy after accurate practice", () => {
      expect(getBobMood({ kind: "result", passed: null, accuracy: 90 })).toBe(
        "happy",
      );
    });

    it("encourages after inaccurate practice", () => {
      expect(getBobMood({ kind: "result", passed: null, accuracy: 89 })).toBe(
        "encouraging",
      );
    });
  });
});

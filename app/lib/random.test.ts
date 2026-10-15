import { describe, expect, it } from "vitest";

import { createRandom, hashString, pick } from "./random";

describe("createRandom", () => {
  it("produces the same sequence for the same seed", () => {
    const a = createRandom(42);
    const b = createRandom(42);

    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("produces different sequences for different seeds", () => {
    expect(createRandom(1)()).not.toBe(createRandom(2)());
  });

  it("stays within [0, 1)", () => {
    const random = createRandom(7);
    const values = Array.from({ length: 1000 }, random);

    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
  });
});

describe("hashString", () => {
  it("is stable and distinguishes strings", () => {
    expect(hashString("home-f-j")).toBe(hashString("home-f-j"));
    expect(hashString("home-f-j")).not.toBe(hashString("home-d-k"));
  });

  it("hashes the empty string", () => {
    expect(hashString("")).toBeTypeOf("number");
  });
});

describe("pick", () => {
  it("picks an item from the list", () => {
    expect(["a", "b", "c"]).toContain(pick(["a", "b", "c"], createRandom(3)));
  });

  it("throws on an empty list", () => {
    expect(() => pick([], createRandom(3))).toThrow();
  });
});

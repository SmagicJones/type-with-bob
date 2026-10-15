import { describe, expect, it } from "vitest";

import { parsePracticeParams, practiceSearch } from "./params";

const parse = (query: string) =>
  parsePracticeParams(new URLSearchParams(query));

describe("parsePracticeParams", () => {
  it("reads a full set of settings", () => {
    expect(parse("source=proverbs&length=long&seed=42")).toEqual({
      sourceId: "proverbs",
      lengthId: "long",
      seed: 42,
    });
  });

  it("returns a null seed when it is missing or malformed", () => {
    expect(parse("source=proverbs&length=long")?.seed).toBeNull();
    expect(parse("source=proverbs&length=long&seed=-3")?.seed).toBeNull();
    expect(parse("source=proverbs&length=long&seed=abc")?.seed).toBeNull();
  });

  it("returns null for unknown or missing sources and lengths", () => {
    expect(parse("")).toBeNull();
    expect(parse("source=nope&length=short")).toBeNull();
    expect(parse("source=proverbs&length=huge")).toBeNull();
  });
});

describe("practiceSearch", () => {
  it("builds a query string, with or without a seed", () => {
    expect(
      practiceSearch({ sourceId: "proverbs", lengthId: "short", seed: 7 }),
    ).toBe("?source=proverbs&length=short&seed=7");
    expect(
      practiceSearch({ sourceId: "proverbs", lengthId: "short", seed: null }),
    ).toBe("?source=proverbs&length=short");
  });

  it("round-trips through parsePracticeParams", () => {
    const params = { sourceId: "short-stories", lengthId: "medium", seed: 99 };

    expect(parse(practiceSearch(params).slice(1))).toEqual(params);
  });
});

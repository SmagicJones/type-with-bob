import { describe, expect, it } from "vitest";

import { findCharKey, layouts } from "~/features/keyboard";

import { generatePracticeText, getLength, getSource } from "./practiceText";
import { lengths, sources, type TextSource } from "./sources";

function buildSource(overrides: Partial<TextSource> = {}): TextSource {
  return {
    id: "test",
    name: "Test",
    description: "Test source",
    origin: "Tests",
    kind: "words",
    items: ["alpha", "beta", "gamma"],
    ...overrides,
  };
}

const wordCount = (text: string) => text.split(" ").length;

describe("text sources", () => {
  it("offers at least two sources and three lengths", () => {
    expect(sources.length).toBeGreaterThanOrEqual(2);
    expect(lengths.length).toBeGreaterThanOrEqual(3);
  });

  it("has unique ids", () => {
    expect(new Set(sources.map((s) => s.id)).size).toBe(sources.length);
    expect(new Set(lengths.map((l) => l.id)).size).toBe(lengths.length);
  });

  describe.each(sources.map((source) => [source.name, source] as const))(
    "%s",
    (_name, source) => {
      it("records where its text comes from", () => {
        expect(source.origin).not.toBe("");
      });

      it("only uses characters every supported layout can type", () => {
        const chars = new Set(source.items.join(" "));
        for (const layout of layouts) {
          expect(
            [...chars].filter((c) => findCharKey(layout, c) === null),
          ).toEqual([]);
        }
      });

      it("has no duplicate items", () => {
        expect(new Set(source.items).size).toBe(source.items.length);
      });

      it("has no doubled, leading or trailing spaces in any item", () => {
        expect(
          source.items.filter(
            (item) => item !== item.trim() || item.includes("  "),
          ),
        ).toEqual([]);
      });
    },
  );
});

describe("generatePracticeText", () => {
  it.each(lengths.map((length) => [length.name, length.words] as const))(
    "makes %s text with the right number of words from every source",
    (_name, words) => {
      for (const source of sources) {
        expect(wordCount(generatePracticeText(source, words, 1))).toBe(words);
      }
    },
  );

  it("is deterministic for a given seed", () => {
    const source = buildSource();

    expect(generatePracticeText(source, 10, 7)).toBe(
      generatePracticeText(source, 10, 7),
    );
  });

  it("varies with the seed", () => {
    const source = getSource("common-words")!;

    expect(generatePracticeText(source, 15, 1)).not.toBe(
      generatePracticeText(source, 15, 2),
    );
  });

  it("samples words only from the source", () => {
    const text = generatePracticeText(buildSource(), 50, 3);

    expect(new Set(text.split(" "))).toEqual(
      new Set(["alpha", "beta", "gamma"]),
    );
  });

  it("reads passages in order and wraps round when it needs more words", () => {
    const source = buildSource({
      kind: "passages",
      items: ["one two.", "three four."],
    });
    const text = generatePracticeText(source, 6, 1);

    expect([
      "one two. three four. one two.",
      "three four. one two. three four.",
    ]).toContain(text);
  });

  it("returns empty text for an empty source or no words", () => {
    expect(generatePracticeText(buildSource({ items: [] }), 10, 1)).toBe("");
    expect(generatePracticeText(buildSource(), 0, 1)).toBe("");
  });
});

describe("lookups", () => {
  it("finds sources and lengths by id", () => {
    expect(getSource("proverbs")?.name).toBe("Proverbs");
    expect(getLength("long")?.words).toBe(60);
  });

  it("returns null for unknown ids", () => {
    expect(getSource("nope")).toBeNull();
    expect(getLength("nope")).toBeNull();
  });
});

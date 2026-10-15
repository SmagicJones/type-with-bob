import { describe, expect, it } from "vitest";

import { buildLesson } from "./test-utils/buildLesson";
import { generateDrill, getKnownKeys, getLessonText } from "./lessonText";

describe("generateDrill", () => {
  it("is deterministic for a given seed", () => {
    const options = { focusKeys: ["f", "j"], knownKeys: ["f", "j"], seed: 1 };

    expect(generateDrill(options)).toBe(generateDrill(options));
  });

  it("varies with the seed", () => {
    const base = { focusKeys: ["f", "j", "d", "k"], knownKeys: [] };

    expect(generateDrill({ ...base, seed: 1 })).not.toBe(
      generateDrill({ ...base, seed: 2 }),
    );
  });

  it("makes the requested number of space-separated groups of 2–4 keys", () => {
    const drill = generateDrill({
      focusKeys: ["f", "j"],
      knownKeys: [],
      seed: 5,
      groupCount: 8,
    });
    const groups = drill.split(" ");

    expect(groups).toHaveLength(8);
    expect(groups.every((g) => g.length >= 2 && g.length <= 4)).toBe(true);
  });

  it("only uses focus and known keys", () => {
    const drill = generateDrill({
      focusKeys: ["e", "i"],
      knownKeys: ["f", "j"],
      seed: 9,
      groupCount: 50,
    });

    expect(new Set(drill.replaceAll(" ", ""))).toEqual(
      new Set(["e", "i", "f", "j"]),
    );
  });

  it("never puts the space bar inside a group", () => {
    const drill = generateDrill({
      focusKeys: ["f", " "],
      knownKeys: [" "],
      seed: 3,
    });

    expect(drill).not.toContain("  ");
    expect(drill.split(" ").every((g) => g.length >= 2)).toBe(true);
  });

  it("returns an empty line when there are no focus keys", () => {
    expect(generateDrill({ focusKeys: [], knownKeys: ["a"], seed: 1 })).toBe(
      "",
    );
  });
});

describe("getKnownKeys", () => {
  const lessons = [
    buildLesson({ id: "one", newKeys: ["a", " "] }),
    buildLesson({ id: "two", newKeys: ["b"] }),
    buildLesson({ id: "three", newKeys: ["c"] }),
  ];

  it("includes keys from this lesson and earlier ones only", () => {
    expect(getKnownKeys("two", lessons)).toEqual(new Set(["a", " ", "b"]));
  });
});

describe("getLessonText", () => {
  it("starts with a drill and follows with the authored lines", () => {
    const lessons = [
      buildLesson({ id: "x", newKeys: ["f", "j", " "], lines: ["fj jf"] }),
    ];

    const text = getLessonText(lessons[0]!, lessons);

    expect(text.endsWith(" fj jf")).toBe(true);
    expect(text.length).toBeGreaterThan("fj jf".length);
  });

  it("uses only the authored lines when there is nothing to drill", () => {
    const lessons = [buildLesson({ id: "x", newKeys: [" "], lines: ["ok"] })];

    expect(getLessonText(lessons[0]!, lessons)).toBe("ok");
  });
});

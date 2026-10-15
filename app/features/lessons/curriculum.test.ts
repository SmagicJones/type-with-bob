import { describe, expect, it } from "vitest";

import { findCharKey, layouts } from "~/features/keyboard";

import { curriculum, stages } from "./curriculum";
import { getKnownKeys, getLessonText } from "./lessonText";

describe("curriculum", () => {
  it("has between 15 and 25 lessons", () => {
    expect(curriculum.length).toBeGreaterThanOrEqual(15);
    expect(curriculum.length).toBeLessThanOrEqual(25);
  });

  it("has unique lesson ids", () => {
    const ids = curriculum.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses URL-safe ids", () => {
    expect(curriculum.filter((l) => !/^[a-z0-9-]+$/.test(l.id))).toEqual([]);
  });

  it("follows the stage order home → top → bottom → capitals → numbers → punctuation", () => {
    const stageOrder = stages.map((stage) => stage.id);
    const lessonStages = curriculum.map((lesson) =>
      stageOrder.indexOf(lesson.stage),
    );

    expect(lessonStages.every((stage) => stage >= 0)).toBe(true);
    expect([...lessonStages].sort((a, b) => a - b)).toEqual(lessonStages);
  });

  it("introduces each key only once", () => {
    const introduced = curriculum.flatMap((lesson) => lesson.newKeys);
    expect(new Set(introduced).size).toBe(introduced.length);
  });

  it("introduces the space bar in the first lesson", () => {
    expect(curriculum[0]?.newKeys).toContain(" ");
  });

  describe.each(curriculum.map((lesson) => [lesson.id, lesson] as const))(
    "lesson %s",
    (_id, lesson) => {
      it("only uses keys it or earlier lessons introduce", () => {
        const known = getKnownKeys(lesson.id);
        const unknown = [...new Set(getLessonText(lesson))].filter(
          (char) => !known.has(char),
        );
        expect(unknown).toEqual([]);
      });

      it("has a title, description and practice lines", () => {
        expect(lesson.title).not.toBe("");
        expect(lesson.description).not.toBe("");
        expect(lesson.lines.length).toBeGreaterThan(0);
      });

      it("has sensible pass thresholds", () => {
        expect(lesson.pass.minAccuracy).toBeGreaterThan(0);
        expect(lesson.pass.minAccuracy).toBeLessThanOrEqual(100);
        expect(lesson.pass.minWpm).toBeGreaterThanOrEqual(0);
      });

      it("has text with no doubled, leading or trailing spaces", () => {
        const text = getLessonText(lesson);
        expect(text).toBe(text.trim());
        expect(text).not.toContain("  ");
      });

      it("can be typed on every supported layout", () => {
        for (const layout of layouts) {
          const untypeable = [...new Set(getLessonText(lesson))].filter(
            (char) => findCharKey(layout, char) === null,
          );
          expect(untypeable).toEqual([]);
        }
      });
    },
  );
});

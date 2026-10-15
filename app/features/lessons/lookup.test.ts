import { describe, expect, it } from "vitest";

import { getLesson, getLessonAfter } from "./lookup";
import { buildLesson } from "./test-utils/buildLesson";

const lessons = ["a", "b"].map((id) => buildLesson({ id }));

describe("getLesson", () => {
  it("finds a lesson by id", () => {
    expect(getLesson("b", lessons)?.id).toBe("b");
  });

  it("returns null for an unknown id", () => {
    expect(getLesson("zzz", lessons)).toBeNull();
  });

  it("searches the real curriculum by default", () => {
    expect(getLesson("home-f-j")?.title).toBe("F and J");
  });
});

describe("getLessonAfter", () => {
  it("returns the following lesson", () => {
    expect(getLessonAfter("a", lessons)?.id).toBe("b");
  });

  it("returns null after the last lesson or for an unknown id", () => {
    expect(getLessonAfter("b", lessons)).toBeNull();
    expect(getLessonAfter("zzz", lessons)).toBeNull();
  });
});

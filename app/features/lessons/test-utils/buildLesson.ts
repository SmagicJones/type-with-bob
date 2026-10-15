import type { Lesson } from "../types";

export function buildLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: "test-lesson",
    stage: "home-row",
    title: "Test lesson",
    description: "A lesson for tests.",
    newKeys: ["f", "j", " "],
    lines: ["fj jf"],
    pass: { minAccuracy: 90, minWpm: 5 },
    ...overrides,
  };
}

import { curriculum } from "./curriculum";
import type { Lesson } from "./types";

export function getLesson(
  id: string,
  lessons: readonly Lesson[] = curriculum,
): Lesson | null {
  return lessons.find((lesson) => lesson.id === id) ?? null;
}

/** The lesson after `id` in curriculum order, or null for the last lesson. */
export function getLessonAfter(
  id: string,
  lessons: readonly Lesson[] = curriculum,
): Lesson | null {
  const index = lessons.findIndex((lesson) => lesson.id === id);
  return index === -1 ? null : (lessons[index + 1] ?? null);
}

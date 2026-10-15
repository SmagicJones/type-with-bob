import { createRandom, hashString, pick } from "~/lib/random";

import { curriculum } from "./curriculum";
import type { Lesson } from "./types";

type DrillOptions = {
  /** Characters to practise most. */
  focusKeys: readonly string[];
  /** Other characters the learner already knows, mixed in occasionally. */
  knownKeys: readonly string[];
  seed: number;
  groupCount?: number;
};

const FOCUS_SHARE = 0.75;

/**
 * Generates a line of short letter groups, such as "fjj jf fjfj". The same
 * options always produce the same line, so lessons and tests are stable.
 */
export function generateDrill({
  focusKeys,
  knownKeys,
  seed,
  groupCount = 6,
}: DrillOptions): string {
  const focus = focusKeys.filter((key) => key !== " ");
  if (focus.length === 0) return "";
  const known = knownKeys.filter((key) => key !== " ");
  const random = createRandom(seed);

  return Array.from({ length: groupCount }, () => {
    const length = 2 + Math.floor(random() * 3);
    return Array.from({ length }, () =>
      known.length > 0 && random() >= FOCUS_SHARE
        ? pick(known, random)
        : pick(focus, random),
    ).join("");
  }).join(" ");
}

/** Every character introduced by the lesson and the lessons before it. */
export function getKnownKeys(
  lessonId: string,
  lessons: readonly Lesson[] = curriculum,
): Set<string> {
  const known = new Set<string>();
  for (const lesson of lessons) {
    lesson.newKeys.forEach((key) => known.add(key));
    if (lesson.id === lessonId) break;
  }
  return known;
}

/** The full text to type: a generated drill followed by the authored lines. */
export function getLessonText(
  lesson: Lesson,
  lessons: readonly Lesson[] = curriculum,
): string {
  const drill = generateDrill({
    focusKeys: lesson.focusKeys ?? lesson.newKeys,
    // Mix in known lowercase letters only, so drills stay friendly.
    knownKeys: [...getKnownKeys(lesson.id, lessons)].filter((key) =>
      /^[a-z]$/.test(key),
    ),
    seed: hashString(lesson.id),
  });
  return [drill, ...lesson.lines].filter((line) => line !== "").join(" ");
}

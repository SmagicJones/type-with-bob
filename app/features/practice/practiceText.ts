import { createRandom, pick } from "~/lib/random";

import {
  lengths,
  sources,
  type PracticeLength,
  type TextSource,
} from "./sources";

export function getSource(id: string): TextSource | null {
  return sources.find((source) => source.id === id) ?? null;
}

export function getLength(id: string): PracticeLength | null {
  return lengths.find((length) => length.id === id) ?? null;
}

function wordsOf(text: string): string[] {
  return text.split(/\s+/).filter((word) => word !== "");
}

/**
 * Builds practice text of exactly `wordCount` words. Word sources are sampled
 * at random; passage sources are read in order from a random starting
 * passage, wrapping round as needed. The same seed always gives the same text.
 */
export function generatePracticeText(
  source: TextSource,
  wordCount: number,
  seed: number,
): string {
  if (source.items.length === 0 || wordCount <= 0) return "";
  const random = createRandom(seed);

  if (source.kind === "words") {
    return Array.from({ length: wordCount }, () =>
      pick(source.items, random),
    ).join(" ");
  }

  const start = Math.floor(random() * source.items.length);
  const words: string[] = [];
  for (let i = 0; words.length < wordCount; i++) {
    const passage = source.items[(start + i) % source.items.length] ?? "";
    words.push(...wordsOf(passage));
  }
  return words.slice(0, wordCount).join(" ");
}

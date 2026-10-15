import { getLength, getSource } from "./practiceText";

export type PracticeParams = {
  sourceId: string;
  lengthId: string;
  /** Null when the URL has no valid seed yet. */
  seed: number | null;
};

/**
 * Reads practice settings from the URL (`?source=…&length=…&seed=…`).
 * Returns null unless both the source and the length are recognised.
 */
export function parsePracticeParams(
  params: URLSearchParams,
): PracticeParams | null {
  const sourceId = params.get("source") ?? "";
  const lengthId = params.get("length") ?? "";
  if (!getSource(sourceId) || !getLength(lengthId)) return null;

  const rawSeed = params.get("seed");
  const seed =
    rawSeed !== null && /^\d{1,10}$/.test(rawSeed) ? Number(rawSeed) : null;
  return { sourceId, lengthId, seed };
}

export function practiceSearch({
  sourceId,
  lengthId,
  seed,
}: PracticeParams): string {
  const params = new URLSearchParams({ source: sourceId, length: lengthId });
  if (seed !== null) params.set("seed", seed.toString());
  return `?${params.toString()}`;
}

export function formatWpm(wpm: number): string {
  return Math.round(wpm).toString();
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Formats milliseconds as m:ss, for example 75_000 → "1:15". */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

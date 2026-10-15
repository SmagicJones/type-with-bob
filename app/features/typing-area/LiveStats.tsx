import type { Summary } from "~/features/typing-engine";
import { formatDuration, formatPercent, formatWpm } from "~/lib/format";

/** Below this, WPM swings wildly from a couple of keystrokes, so it is not shown yet. */
export const MIN_WPM_ELAPSED_MS = 2000;

type LiveStatsProps = {
  summary: Summary;
  className?: string;
};

/** Running WPM, accuracy and time. Deliberately not a live region: it changes every keystroke. */
export function LiveStats({ summary, className = "" }: LiveStatsProps) {
  const items = [
    {
      label: "WPM",
      value:
        summary.elapsedMs < MIN_WPM_ELAPSED_MS ? "–" : formatWpm(summary.wpm),
    },
    { label: "Accuracy", value: formatPercent(summary.accuracy) },
    { label: "Time", value: formatDuration(summary.elapsedMs) },
  ];

  return (
    <dl className={`flex justify-center gap-8 ${className}`}>
      {items.map(({ label, value }) => (
        <div key={label} className="text-center">
          <dt className="text-sm text-gray-600 dark:text-gray-300">{label}</dt>
          <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

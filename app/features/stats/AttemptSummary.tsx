import { formatDuration, formatPercent, formatWpm } from "~/lib/format";

type AttemptSummaryProps = {
  wpm: number;
  accuracy: number;
  elapsedMs: number;
  errors: number;
  className?: string;
};

export function AttemptSummary({
  wpm,
  accuracy,
  elapsedMs,
  errors,
  className = "",
}: AttemptSummaryProps) {
  const items = [
    { label: "Words per minute", value: formatWpm(wpm) },
    { label: "Accuracy", value: formatPercent(accuracy) },
    { label: "Time", value: formatDuration(elapsedMs) },
    { label: "Mistakes", value: errors.toString() },
  ];

  return (
    <dl className={`grid grid-cols-2 gap-4 sm:grid-cols-4 ${className}`}>
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-800"
        >
          <dt className="text-sm text-gray-700 dark:text-gray-300">{label}</dt>
          <dd className="text-3xl font-bold tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

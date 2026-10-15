type ProgressBarProps = {
  label: string;
  value: number;
  max: number;
  className?: string;
};

export function ProgressBar({
  label,
  value,
  max,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? (clamped / max) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-valuetext={`${clamped} of ${max}`}
      className={`h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 ${className}`}
    >
      <div
        className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

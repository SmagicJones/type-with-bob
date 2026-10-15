import type { LessonStatus } from "./types";

const BADGES: Record<
  LessonStatus,
  { label: string; icon: string; className: string }
> = {
  complete: {
    label: "Complete",
    icon: "✓",
    className:
      "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  },
  unlocked: {
    label: "Ready",
    icon: "→",
    className:
      "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-100",
  },
  locked: {
    label: "Locked",
    icon: "🔒",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
};

type LessonStatusBadgeProps = {
  status: LessonStatus;
  className?: string;
};

/** A status pill with an icon and a word, so it never relies on colour alone. */
export function LessonStatusBadge({
  status,
  className = "",
}: LessonStatusBadgeProps) {
  const badge = BADGES[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium ${badge.className} ${className}`}
    >
      <span aria-hidden="true">{badge.icon}</span>
      {badge.label}
    </span>
  );
}

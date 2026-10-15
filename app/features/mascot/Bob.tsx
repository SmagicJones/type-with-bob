import { BOB_MESSAGES, type BobMood } from "./mood";

type BobProps = {
  mood: BobMood;
  /** Overrides Bob's default line for the mood. */
  message?: string;
  /** Show Bob's speech bubble. */
  showMessage?: boolean;
  className?: string;
};

// Mouth and brow shapes per mood. Bob is a friendly keycap with a face.
const MOUTHS: Record<BobMood, string> = {
  idle: "M38 66 Q50 72 62 66",
  happy: "M34 62 Q50 82 66 62 Z",
  encouraging: "M38 68 Q50 64 62 68",
};

const BROWS: Record<BobMood, [string, string]> = {
  idle: ["M30 38 L42 38", "M58 38 L70 38"],
  happy: ["M30 36 Q36 32 42 36", "M58 36 Q64 32 70 36"],
  encouraging: ["M30 40 L42 36", "M58 36 L70 40"],
};

export function Bob({
  mood,
  message,
  showMessage = true,
  className = "",
}: BobProps) {
  const [leftBrow, rightBrow] = BROWS[mood];

  return (
    <div className={`flex items-center gap-3 ${className}`} data-mood={mood}>
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className={`h-16 w-16 shrink-0 ${mood === "happy" ? "motion-safe:animate-bob-hop" : ""}`}
      >
        {/* Keycap body: a darker base with a lighter top face. */}
        <rect
          x="6"
          y="10"
          width="88"
          height="86"
          rx="18"
          className="fill-indigo-700 dark:fill-indigo-400"
        />
        <rect
          x="12"
          y="6"
          width="76"
          height="76"
          rx="14"
          className="fill-indigo-100 dark:fill-indigo-900"
        />
        <g
          className="stroke-indigo-950 dark:stroke-indigo-50"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        >
          <path d={leftBrow} />
          <path d={rightBrow} />
        </g>
        <circle
          cx="36"
          cy="48"
          r="5"
          className="fill-indigo-950 dark:fill-indigo-50"
        />
        <circle
          cx="64"
          cy="48"
          r="5"
          className="fill-indigo-950 dark:fill-indigo-50"
        />
        <path
          d={MOUTHS[mood]}
          strokeWidth="3"
          strokeLinecap="round"
          className={
            mood === "happy"
              ? "fill-rose-400 stroke-indigo-950 dark:stroke-indigo-50"
              : "fill-none stroke-indigo-950 dark:stroke-indigo-50"
          }
        />
      </svg>
      {showMessage && (
        <p className="relative rounded-xl bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-950 dark:bg-indigo-950 dark:text-indigo-50">
          <span className="sr-only">Bob says: </span>
          {message ?? BOB_MESSAGES[mood]}
        </p>
      )}
    </div>
  );
}

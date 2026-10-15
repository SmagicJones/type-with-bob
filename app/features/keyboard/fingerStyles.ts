import type { Finger } from "./types";

/**
 * Tailwind classes per finger. Mirrored fingers share a colour, as on most
 * finger charts. Colour is never the only cue: the guide text names the finger.
 */
export const FINGER_STYLES: Record<Finger, string> = {
  "left-pinky":
    "bg-rose-100 border-rose-300 dark:bg-rose-950 dark:border-rose-800",
  "left-ring":
    "bg-amber-100 border-amber-300 dark:bg-amber-950 dark:border-amber-800",
  "left-middle":
    "bg-emerald-100 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800",
  "left-index": "bg-sky-100 border-sky-300 dark:bg-sky-950 dark:border-sky-800",
  "right-index":
    "bg-sky-100 border-sky-300 dark:bg-sky-950 dark:border-sky-800",
  "right-middle":
    "bg-emerald-100 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800",
  "right-ring":
    "bg-amber-100 border-amber-300 dark:bg-amber-950 dark:border-amber-800",
  "right-pinky":
    "bg-rose-100 border-rose-300 dark:bg-rose-950 dark:border-rose-800",
  thumb:
    "bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600",
};

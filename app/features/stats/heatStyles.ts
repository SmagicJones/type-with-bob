import type { HeatLevel } from "./heat";

/** Light to dark as keys get trickier. Each key also shows its value as text. */
export const HEAT_STYLES: Record<HeatLevel, string> = {
  0: "bg-emerald-100 border-emerald-300 text-emerald-950 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-50",
  1: "bg-lime-200 border-lime-400 text-lime-950 dark:bg-lime-900 dark:border-lime-600 dark:text-lime-50",
  2: "bg-amber-200 border-amber-400 text-amber-950 dark:bg-amber-800 dark:border-amber-500 dark:text-amber-50",
  3: "bg-orange-300 border-orange-500 text-orange-950 dark:bg-orange-700 dark:border-orange-400 dark:text-orange-50",
  4: "bg-red-400 border-red-600 text-red-950 dark:bg-red-700 dark:border-red-400 dark:text-red-50",
};

export const HEAT_LEVELS: readonly HeatLevel[] = [0, 1, 2, 3, 4];

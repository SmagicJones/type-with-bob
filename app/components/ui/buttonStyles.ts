export type ButtonVariant = "primary" | "secondary";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-700 text-white hover:bg-indigo-800 dark:bg-indigo-500 dark:text-gray-950 dark:hover:bg-indigo-400",
  secondary:
    "border-2 border-indigo-700 text-indigo-800 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-200 dark:hover:bg-indigo-950",
};

export function buttonClasses(variant: ButtonVariant, className = ""): string {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

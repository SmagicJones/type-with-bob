import type { ComponentProps } from "react";

type CardProps = ComponentProps<"section">;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
      {...props}
    />
  );
}

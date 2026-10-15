import type { Attempt } from "~/features/progress";
import { ScrollArea } from "~/components/ui/ScrollArea";
import { formatPercent, formatWpm } from "~/lib/format";

type HistoryTableProps = {
  attempts: readonly Attempt[];
  /** A readable name for what was typed, for example a lesson title. */
  describeAttempt: (attempt: Attempt) => string;
  className?: string;
};

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function outcome(attempt: Attempt): string {
  if (attempt.kind === "practice") return "Practice";
  return attempt.passed ? "Passed" : "Not passed";
}

/** Attempts, newest first. */
export function HistoryTable({
  attempts,
  describeAttempt,
  className = "",
}: HistoryTableProps) {
  const rows = [...attempts].sort((a, b) => b.completedAt - a.completedAt);

  return (
    <ScrollArea label="Session history" className={className}>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Your sessions, newest first</caption>
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-700">
            <th scope="col" className="py-2 pr-4">
              When
            </th>
            <th scope="col" className="py-2 pr-4">
              What
            </th>
            <th scope="col" className="py-2 pr-4">
              WPM
            </th>
            <th scope="col" className="py-2 pr-4">
              Accuracy
            </th>
            <th scope="col" className="py-2 pr-4">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((attempt) => (
            <tr
              key={attempt.id}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              <td className="py-2 pr-4 whitespace-nowrap">
                <time dateTime={new Date(attempt.completedAt).toISOString()}>
                  {DATE_FORMAT.format(attempt.completedAt)}
                </time>
              </td>
              <th scope="row" className="py-2 pr-4 font-medium">
                {describeAttempt(attempt)}
              </th>
              <td className="py-2 pr-4 tabular-nums">
                {formatWpm(attempt.wpm)}
              </td>
              <td className="py-2 pr-4 tabular-nums">
                {formatPercent(attempt.accuracy)}
              </td>
              <td className="py-2 pr-4">{outcome(attempt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}

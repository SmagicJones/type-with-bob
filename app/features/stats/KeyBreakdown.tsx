import { charName } from "~/features/keyboard";
import type { KeyStats } from "~/features/typing-engine";
import { ScrollArea } from "~/components/ui/ScrollArea";
import { formatPercent } from "~/lib/format";

import { toKeyRows } from "./keyRows";

type KeyBreakdownProps = {
  keyStats: KeyStats;
  className?: string;
};

export function KeyBreakdown({ keyStats, className = "" }: KeyBreakdownProps) {
  const rows = toKeyRows(keyStats);

  if (rows.length === 0) {
    return <p className={className}>No keys typed yet.</p>;
  }

  return (
    <ScrollArea label="Per-key results" className={className}>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          Per-key results, trickiest keys first
        </caption>
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-700">
            <th scope="col" className="py-2 pr-4">
              Key
            </th>
            <th scope="col" className="py-2 pr-4">
              Accuracy
            </th>
            <th scope="col" className="py-2 pr-4">
              Mistakes
            </th>
            <th scope="col" className="py-2 pr-4">
              Average time
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.char}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              <th scope="row" className="py-2 pr-4 font-mono font-semibold">
                {charName(row.char)}
              </th>
              <td className="py-2 pr-4 tabular-nums">
                {formatPercent(row.accuracy)}
              </td>
              <td className="py-2 pr-4 tabular-nums">
                {row.errors} of {row.attempts}
              </td>
              <td className="py-2 pr-4 tabular-nums">
                {row.avgLatencyMs === null
                  ? "–"
                  : `${Math.round(row.avgLatencyMs)} ms`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}

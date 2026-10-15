import { ButtonLink } from "~/components/ui/ButtonLink";
import { Card } from "~/components/ui/Card";
import type { KeyboardLayout } from "~/features/keyboard";
import type { Attempt } from "~/features/progress";
import { formatPercent, formatWpm } from "~/lib/format";

import {
  aggregateKeyStats,
  getHistoryOverview,
  getRecentSeries,
} from "./aggregate";
import { HistoryTable } from "./HistoryTable";
import { KeyBreakdown } from "./KeyBreakdown";
import { KeyHeatmap } from "./KeyHeatmap";
import { TrendChart } from "./TrendChart";

type StatsOverviewProps = {
  attempts: readonly Attempt[];
  layout: KeyboardLayout;
  describeAttempt: (attempt: Attempt) => string;
};

export function StatsOverview({
  attempts,
  layout,
  describeAttempt,
}: StatsOverviewProps) {
  const overview = getHistoryOverview(attempts);

  if (!overview) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p>
          No sessions yet. Finish a lesson or a practice session and your
          progress will appear here.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/lessons">Start a lesson</ButtonLink>
          <ButtonLink to="/practice" variant="secondary">
            Free practice
          </ButtonLink>
        </div>
      </div>
    );
  }

  const series = getRecentSeries(attempts);
  const keyStats = aggregateKeyStats(attempts);
  const tiles = [
    { label: "Sessions", value: overview.sessions.toString() },
    { label: "Best WPM", value: formatWpm(overview.bestWpm) },
    { label: "Recent WPM", value: formatWpm(overview.recentWpm) },
    { label: "Recent accuracy", value: formatPercent(overview.recentAccuracy) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tiles.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-800"
          >
            <dt className="text-sm text-gray-700 dark:text-gray-300">
              {label}
            </dt>
            <dd className="text-3xl font-bold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {overview.sessions === 1
          ? "“Recent” means your only session so far."
          : `“Recent” means your last ${Math.min(10, overview.sessions)} sessions.`}
      </p>

      <Card aria-labelledby="trends-heading">
        <h2 id="trends-heading" className="mb-4 text-xl font-semibold">
          Over time
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <TrendChart
            title="Words per minute"
            values={series.map((a) => a.wpm)}
            format={(v) => formatWpm(v)}
          />
          <TrendChart
            title="Accuracy"
            values={series.map((a) => a.accuracy)}
            format={(v) => formatPercent(v)}
            max={100}
          />
        </div>
      </Card>

      <Card aria-labelledby="heatmap-heading">
        <h2 id="heatmap-heading" className="mb-4 text-xl font-semibold">
          Tricky keys
        </h2>
        <KeyHeatmap layout={layout} keyStats={keyStats} />
        <details className="mt-4">
          <summary className="cursor-pointer font-medium">
            Show every key as a table
          </summary>
          <KeyBreakdown keyStats={keyStats} className="mt-3" />
        </details>
      </Card>

      <Card aria-labelledby="history-heading">
        <h2 id="history-heading" className="mb-4 text-xl font-semibold">
          History
        </h2>
        <HistoryTable attempts={attempts} describeAttempt={describeAttempt} />
      </Card>
    </div>
  );
}

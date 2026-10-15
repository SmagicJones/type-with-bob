import { useMemo, useState } from "react";

import {
  VisualKeyboard,
  type KeyboardLayout,
  type KeyTint,
} from "~/features/keyboard";
import type { KeyStats } from "~/features/typing-engine";

import { getKeyHeat, type HeatMetric } from "./heat";
import { HEAT_LEVELS, HEAT_STYLES } from "./heatStyles";

type KeyHeatmapProps = {
  layout: KeyboardLayout;
  keyStats: KeyStats;
  className?: string;
};

const METRICS: Record<
  HeatMetric,
  { button: string; caption: string; low: string; high: string }
> = {
  errors: {
    button: "Mistakes",
    caption: "Mistake rate for each key",
    low: "Few mistakes",
    high: "Many mistakes",
  },
  speed: {
    button: "Speed",
    caption: "Average time to press each key",
    low: "Quick",
    high: "Slow",
  },
};

export function KeyHeatmap({
  layout,
  keyStats,
  className = "",
}: KeyHeatmapProps) {
  const [metric, setMetric] = useState<HeatMetric>("errors");
  const info = METRICS[metric];

  const tints = useMemo(() => {
    const result = new Map<string, KeyTint>();
    for (const [keyId, heat] of getKeyHeat(layout, keyStats, metric)) {
      result.set(keyId, {
        className: HEAT_STYLES[heat.level],
        label: heat.label,
      });
    }
    return result;
  }, [layout, keyStats, metric]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div
        role="group"
        aria-label="Show on the keyboard"
        className="flex gap-2"
      >
        {(Object.keys(METRICS) as HeatMetric[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={metric === option}
            onClick={() => setMetric(option)}
            className="rounded-lg border-2 border-indigo-700 px-3 py-1 font-semibold text-indigo-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 aria-pressed:bg-indigo-700 aria-pressed:text-white dark:border-indigo-400 dark:text-indigo-200 dark:aria-pressed:bg-indigo-400 dark:aria-pressed:text-gray-950"
          >
            {METRICS[option].button}
          </button>
        ))}
      </div>

      <VisualKeyboard
        layout={layout}
        nextChar={null}
        keyTints={tints}
        caption={info.caption}
      />

      <div className="flex items-center justify-center gap-2 text-sm">
        <span>{info.low}</span>
        <ul aria-hidden="true" className="flex gap-1">
          {HEAT_LEVELS.map((level) => (
            <li
              key={level}
              className={`h-4 w-8 rounded border ${HEAT_STYLES[level]}`}
            />
          ))}
        </ul>
        <span>{info.high}</span>
      </div>
      {tints.size === 0 && (
        <p className="text-center text-sm">
          No {metric === "errors" ? "keys" : "timings"} to show yet.
        </p>
      )}
    </div>
  );
}

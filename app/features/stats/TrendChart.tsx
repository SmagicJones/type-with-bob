import { useId } from "react";

type TrendChartProps = {
  title: string;
  values: readonly number[];
  /** Formats a value for labels and the text summary. */
  format: (value: number) => string;
  /** Fixed top of the scale (for example 100 for percentages); defaults to fit the data. */
  max?: number;
  className?: string;
};

const WIDTH = 600;
const HEIGHT = 200;
const PAD = { top: 12, right: 12, bottom: 12, left: 44 };

/** Rounds up to a tidy axis maximum, such as 10, 20, 50 or 100. */
export function niceCeil(value: number): number {
  if (value <= 0) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find((m) => value <= m * magnitude) ?? 10;
  return step * magnitude;
}

/** A small line chart. The SVG is decorative; the caption and summary carry the meaning. */
export function TrendChart({
  title,
  values,
  format,
  max,
  className = "",
}: TrendChartProps) {
  const titleId = useId();
  const summaryId = useId();
  const top = max ?? niceCeil(Math.max(...values, 0));
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) =>
    PAD.left +
    (values.length === 1
      ? plotWidth / 2
      : (i / (values.length - 1)) * plotWidth);
  const y = (v: number) =>
    PAD.top + plotHeight - (Math.min(v, top) / top) * plotHeight;
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  const first = values[0];
  const last = values.at(-1);
  const summary =
    first === undefined || last === undefined
      ? "No sessions yet."
      : `${values.length} ${values.length === 1 ? "session" : "sessions"}. Started at ${format(first)}, most recently ${format(last)}, best ${format(Math.max(...values))}.`;

  return (
    <figure
      aria-labelledby={titleId}
      aria-describedby={summaryId}
      className={className}
    >
      <figcaption id={titleId} className="mb-2 font-semibold">
        {title}
      </figcaption>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden="true"
        className="w-full"
      >
        {[0, top / 2, top].map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <text
              x={PAD.left - 8}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-gray-600 text-xs dark:fill-gray-300"
            >
              {format(tick)}
            </text>
          </g>
        ))}
        <polyline
          points={points}
          fill="none"
          strokeWidth={3}
          className="stroke-indigo-600 dark:stroke-indigo-400"
        />
        {values.map((v, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(v)}
            r={4}
            className="fill-indigo-600 dark:fill-indigo-400"
          />
        ))}
      </svg>
      <p id={summaryId} className="sr-only">
        {summary}
      </p>
    </figure>
  );
}

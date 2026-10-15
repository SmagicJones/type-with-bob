import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { niceCeil, TrendChart } from "./TrendChart";

const format = (v: number) => `${Math.round(v)} wpm`;

describe("TrendChart", () => {
  it("is labelled by its title and summarises the trend in words", () => {
    render(
      <TrendChart
        title="Speed over time"
        values={[12, 20, 18]}
        format={format}
      />,
    );

    const chart = screen.getByRole("figure", { name: "Speed over time" });
    expect(chart).toHaveAccessibleDescription(
      "3 sessions. Started at 12 wpm, most recently 18 wpm, best 20 wpm.",
    );
  });

  it("plots one point per value", () => {
    const { container } = render(
      <TrendChart title="Speed" values={[1, 2, 3, 4]} format={format} />,
    );

    expect(container.querySelectorAll("circle")).toHaveLength(4);
  });

  it("handles a single value", () => {
    const { container } = render(
      <TrendChart title="Speed" values={[7]} format={format} />,
    );

    expect(container.querySelectorAll("circle")).toHaveLength(1);
    expect(screen.getByRole("figure")).toHaveAccessibleDescription(
      /^1 session\./,
    );
  });

  it("handles no values", () => {
    render(<TrendChart title="Speed" values={[]} format={format} />);

    expect(screen.getByRole("figure")).toHaveAccessibleDescription(
      "No sessions yet.",
    );
  });

  it("uses a fixed maximum when given one", () => {
    render(
      <TrendChart
        title="Accuracy"
        values={[50]}
        format={(v) => `${v}%`}
        max={100}
      />,
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});

describe("niceCeil", () => {
  it.each([
    [0, 10],
    [-5, 10],
    [7, 10],
    [12, 20],
    [38, 50],
    [51, 100],
    [100, 100],
    [130, 200],
  ])("rounds %d up to %d", (value, expected) => {
    expect(niceCeil(value)).toBe(expected);
  });
});

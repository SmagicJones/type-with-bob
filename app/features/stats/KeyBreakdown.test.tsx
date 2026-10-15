import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { KeyBreakdown } from "./KeyBreakdown";

describe("KeyBreakdown", () => {
  it("lists each key with its accuracy, mistakes and average time", () => {
    render(
      <KeyBreakdown
        keyStats={{
          f: { attempts: 4, errors: 1, avgLatencyMs: 212.4 },
          " ": { attempts: 2, errors: 0, avgLatencyMs: null },
        }}
      />,
    );

    const table = screen.getByRole("table", { name: /per-key results/i });
    const [, firstRow, secondRow] = within(table).getAllByRole("row");

    expect(within(firstRow!).getByRole("rowheader")).toHaveTextContent("f");
    expect(firstRow).toHaveTextContent("75%");
    expect(firstRow).toHaveTextContent("1 of 4");
    expect(firstRow).toHaveTextContent("212 ms");
    expect(within(secondRow!).getByRole("rowheader")).toHaveTextContent(
      "Space",
    );
    expect(secondRow).toHaveTextContent("–");
  });

  it("says so when nothing was typed", () => {
    render(<KeyBreakdown keyStats={{}} />);

    expect(screen.getByText("No keys typed yet.")).toBeInTheDocument();
  });
});

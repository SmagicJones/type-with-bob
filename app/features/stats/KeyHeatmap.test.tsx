import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { getLayout } from "~/features/keyboard";

import { KeyHeatmap } from "./KeyHeatmap";

const uk = getLayout("uk-qwerty");
const keyStats = {
  f: { attempts: 10, errors: 4, avgLatencyMs: 700 },
  j: { attempts: 10, errors: 0, avgLatencyMs: 150 },
};

function keyText(container: HTMLElement, keyId: string) {
  return container.querySelector(`[data-key-id="${keyId}"]`)?.textContent;
}

describe("KeyHeatmap", () => {
  it("shows mistake rates on the keys by default", () => {
    const { container } = render(
      <KeyHeatmap layout={uk} keyStats={keyStats} />,
    );

    expect(screen.getByRole("button", { name: "Mistakes" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("figure", { name: "Mistake rate for each key" }),
    ).toBeInTheDocument();
    expect(keyText(container, "KeyF")).toBe("F40%");
    expect(keyText(container, "KeyJ")).toBe("J0%");
    expect(keyText(container, "KeyK")).toBe("K");
  });

  it("switches to average key times", async () => {
    const { container } = render(
      <KeyHeatmap layout={uk} keyStats={keyStats} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Speed" }));

    expect(screen.getByRole("button", { name: "Speed" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("figure", { name: "Average time to press each key" }),
    ).toBeVisible();
    expect(keyText(container, "KeyF")).toBe("F700ms");
    expect(screen.getByText("Slow")).toBeInTheDocument();
  });

  it("explains when there is nothing to show", () => {
    render(<KeyHeatmap layout={uk} keyStats={{}} />);

    expect(screen.getByText("No keys to show yet.")).toBeInTheDocument();
  });
});

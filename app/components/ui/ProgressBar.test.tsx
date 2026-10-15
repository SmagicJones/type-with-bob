import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("reports its value to assistive technology", () => {
    render(<ProgressBar label="Lessons complete" value={3} max={24} />);

    const bar = screen.getByRole("progressbar", { name: "Lessons complete" });
    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-valuetext", "3 of 24");
  });

  it("clamps out-of-range values", () => {
    render(<ProgressBar label="Progress" value={30} max={24} />);

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "24",
    );
  });

  it("handles a zero maximum", () => {
    render(<ProgressBar label="Progress" value={0} max={0} />);

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });
});

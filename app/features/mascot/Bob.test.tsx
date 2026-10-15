import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Bob } from "./Bob";

describe("Bob", () => {
  it.each([
    ["idle", "Ready when you are!"],
    ["happy", "Brilliant work!"],
    ["encouraging", "Keep going, you've got this!"],
  ] as const)("says the %s line by default", (mood, line) => {
    render(<Bob mood={mood} />);

    expect(screen.getByText(line)).toBeInTheDocument();
    expect(screen.getByText("Bob says:")).toHaveClass("sr-only");
  });

  it("can say something else", () => {
    render(<Bob mood="idle" message="Hello there!" />);

    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });

  it("can stay quiet", () => {
    render(<Bob mood="encouraging" showMessage={false} />);

    expect(screen.queryByText(/Keep going/)).not.toBeInTheDocument();
  });

  it("only hops when happy, and only if motion is allowed", () => {
    const { container, rerender } = render(<Bob mood="happy" />);
    expect(container.querySelector("svg")).toHaveClass(
      "motion-safe:animate-bob-hop",
    );

    rerender(<Bob mood="idle" />);
    expect(container.querySelector("svg")).not.toHaveClass(
      "motion-safe:animate-bob-hop",
    );
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AttemptSummary } from "./AttemptSummary";

describe("AttemptSummary", () => {
  it("shows speed, accuracy, time and mistakes", () => {
    render(
      <AttemptSummary
        wpm={31.7}
        accuracy={96.2}
        elapsedMs={42_000}
        errors={3}
      />,
    );

    const valueOf = (label: string) =>
      screen.getByText(label).nextElementSibling;
    expect(valueOf("Words per minute")).toHaveTextContent("32");
    expect(valueOf("Accuracy")).toHaveTextContent("96%");
    expect(valueOf("Time")).toHaveTextContent("0:42");
    expect(valueOf("Mistakes")).toHaveTextContent("3");
  });
});

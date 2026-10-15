import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LiveStats } from "./LiveStats";

describe("LiveStats", () => {
  it("shows WPM, accuracy and time in a readable form", () => {
    render(
      <LiveStats
        summary={{ wpm: 23.6, accuracy: 91.2, elapsedMs: 75_000, errors: 3 }}
      />,
    );

    expect(screen.getByText("WPM").nextElementSibling).toHaveTextContent("24");
    expect(screen.getByText("Accuracy").nextElementSibling).toHaveTextContent(
      "91%",
    );
    expect(screen.getByText("Time").nextElementSibling).toHaveTextContent(
      "1:15",
    );
  });
});

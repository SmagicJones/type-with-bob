import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  buildLessonAttempt,
  buildPracticeAttempt,
} from "~/test-utils/progress";

import { HistoryTable } from "./HistoryTable";

describe("HistoryTable", () => {
  it("lists sessions newest first with speed, accuracy and outcome", () => {
    const older = buildLessonAttempt({
      completedAt: Date.UTC(2026, 0, 1),
      passed: false,
      wpm: 9,
    });
    const newer = buildPracticeAttempt({
      completedAt: Date.UTC(2026, 0, 2),
      wpm: 31.6,
      accuracy: 94.4,
    });

    render(
      <HistoryTable
        attempts={[older, newer]}
        describeAttempt={(a) =>
          a.kind === "lesson" ? "Lesson A" : "Practice B"
        }
      />,
    );

    const [, first, second] = within(
      screen.getByRole("table", { name: "Your sessions, newest first" }),
    ).getAllByRole("row");
    expect(within(first!).getByRole("rowheader")).toHaveTextContent(
      "Practice B",
    );
    expect(first).toHaveTextContent("32");
    expect(first).toHaveTextContent("94%");
    expect(first).toHaveTextContent("Practice");
    expect(within(second!).getByRole("rowheader")).toHaveTextContent(
      "Lesson A",
    );
    expect(second).toHaveTextContent("Not passed");
  });

  it("marks passed lessons", () => {
    render(
      <HistoryTable
        attempts={[buildLessonAttempt({ passed: true })]}
        describeAttempt={() => "Lesson"}
      />,
    );

    expect(screen.getByText("Passed")).toBeInTheDocument();
  });
});

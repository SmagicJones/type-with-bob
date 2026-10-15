import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { getLayout } from "~/features/keyboard";
import type { Attempt } from "~/features/progress";
import {
  buildLessonAttempt,
  buildPracticeAttempt,
} from "~/test-utils/progress";

import { StatsOverview } from "./StatsOverview";

async function renderOverview(attempts: Attempt[]) {
  const Stub = createRoutesStub([
    {
      path: "/stats",
      Component: () => (
        <StatsOverview
          attempts={attempts}
          layout={getLayout("uk-qwerty")}
          describeAttempt={(a) => a.id}
        />
      ),
    },
  ]);
  render(<Stub initialEntries={["/stats"]} />);
}

describe("StatsOverview", () => {
  it("encourages a first session when there is no history", async () => {
    await renderOverview([]);

    expect(await screen.findByText(/No sessions yet/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Start a lesson" }),
    ).toHaveAttribute("href", "/lessons");
  });

  it("shows headline numbers, trends, tricky keys and history", async () => {
    await renderOverview([
      buildLessonAttempt({ wpm: 10, accuracy: 90 }),
      buildPracticeAttempt({ wpm: 30, accuracy: 100 }),
    ]);

    const valueOf = (label: string) =>
      screen.getByText(label, { selector: "dt" }).nextElementSibling;
    expect(await screen.findByText("Sessions")).toBeInTheDocument();
    expect(valueOf("Sessions")).toHaveTextContent("2");
    expect(valueOf("Best WPM")).toHaveTextContent("30");
    expect(valueOf("Recent WPM")).toHaveTextContent("20");
    expect(valueOf("Recent accuracy")).toHaveTextContent("95%");

    expect(
      screen.getByText("“Recent” means your last 2 sessions."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("figure", { name: "Words per minute" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("figure", { name: "Mistake rate for each key" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: "Your sessions, newest first" }),
    ).toBeInTheDocument();
  });

  it("words the recent note for a single session", async () => {
    await renderOverview([buildLessonAttempt()]);

    expect(
      await screen.findByText("“Recent” means your only session so far."),
    ).toBeInTheDocument();
  });
});

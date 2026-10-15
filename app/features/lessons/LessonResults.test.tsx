import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { LessonResults, type LessonResult } from "./LessonResults";
import { buildLesson } from "./test-utils/buildLesson";

const lesson = buildLesson({ id: "one", title: "F and J" });
const next = buildLesson({ id: "two", title: "D and K" });

function buildResult(overrides: Partial<LessonResult> = {}): LessonResult {
  return {
    wpm: 18,
    accuracy: 96,
    elapsedMs: 30_000,
    errors: 1,
    keyStats: { f: { attempts: 3, errors: 1, avgLatencyMs: 250 } },
    passed: true,
    ...overrides,
  };
}

async function renderResults(result: LessonResult, nextLesson = next) {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <LessonResults
          lesson={lesson}
          result={result}
          nextLesson={nextLesson}
        />
      ),
    },
  ]);
  render(<Stub initialEntries={["/"]} />);
  await screen.findByRole("heading", { level: 1 });
}

describe("LessonResults", () => {
  it("celebrates a pass and offers the next lesson first", async () => {
    await renderResults(buildResult({ passed: true }));

    expect(screen.getByRole("status")).toHaveTextContent("Lesson passed!");
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAccessibleName("Next lesson: D and K");
    expect(links[0]).toHaveAttribute("href", "/lessons/two");
  });

  it("encourages a retry after a fail and hides the next lesson", async () => {
    await renderResults(buildResult({ passed: false }));

    expect(screen.getByRole("status")).toHaveTextContent("Have another go!");
    expect(
      screen.queryByRole("link", { name: /Next lesson/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try again" })).toHaveAttribute(
      "href",
      "/lessons/one",
    );
  });

  it("has Bob cheer a pass", async () => {
    await renderResults(buildResult({ passed: true }));
    expect(screen.getByText(/On to the next one/)).toBeInTheDocument();
  });

  it("has Bob encourage after a fail", async () => {
    await renderResults(buildResult({ passed: false }));
    expect(
      screen.getByText(/Every try makes your fingers smarter/),
    ).toBeInTheDocument();
  });

  it("shows the headline numbers and the per-key breakdown", async () => {
    await renderResults(buildResult());

    expect(
      screen.getByText("Words per minute").nextElementSibling,
    ).toHaveTextContent("18");
    expect(
      screen.getByRole("table", { name: /per-key results/i }),
    ).toHaveTextContent("1 of 3");
  });

  it("offers no next lesson after the final lesson", async () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <LessonResults
            lesson={lesson}
            result={buildResult()}
            nextLesson={null}
          />
        ),
      },
    ]);
    render(<Stub initialEntries={["/"]} />);

    await screen.findByRole("heading", { level: 1 });
    expect(
      screen.queryByRole("link", { name: /Next lesson/ }),
    ).not.toBeInTheDocument();
  });
});

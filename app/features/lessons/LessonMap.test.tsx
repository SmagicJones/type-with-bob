import { render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { LessonMap } from "./LessonMap";
import { buildLesson } from "./test-utils/buildLesson";
import type { LessonStatus, Stage } from "./types";

const stages: Stage[] = [
  { id: "home-row", title: "Home row" },
  { id: "top-row", title: "Top row" },
  { id: "numbers", title: "Numbers" },
];
const lessons = [
  buildLesson({ id: "one", title: "First", stage: "home-row" }),
  buildLesson({ id: "two", title: "Second", stage: "home-row" }),
  buildLesson({ id: "three", title: "Third", stage: "top-row" }),
];

async function renderMap(statuses: Record<string, LessonStatus>) {
  const Stub = createRoutesStub([
    {
      path: "/lessons",
      Component: () => (
        <LessonMap
          stages={stages}
          lessons={lessons}
          statuses={new Map(Object.entries(statuses))}
        />
      ),
    },
  ]);
  render(<Stub initialEntries={["/lessons"]} />);
  return screen.findByRole("region", { name: "Home row" });
}

describe("LessonMap", () => {
  it("groups lessons by stage and skips empty stages", async () => {
    await renderMap({ one: "unlocked" });

    expect(
      screen.getByRole("region", { name: "Home row" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Top row" })).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Numbers" }),
    ).not.toBeInTheDocument();
  });

  it("links to unlocked and complete lessons, with their status in words", async () => {
    const homeRow = await renderMap({ one: "complete", two: "unlocked" });

    expect(
      within(homeRow).getByRole("link", { name: /First.*Complete/ }),
    ).toHaveAttribute("href", "/lessons/one");
    expect(
      within(homeRow).getByRole("link", { name: /Second.*Ready/ }),
    ).toHaveAttribute("href", "/lessons/two");
  });

  it("shows locked lessons without a link", async () => {
    await renderMap({ one: "unlocked" });

    expect(
      screen.queryByRole("link", { name: /Third/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Third").parentElement).toHaveTextContent("Locked");
  });
});

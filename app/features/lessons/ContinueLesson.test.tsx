import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { ContinueLesson } from "./ContinueLesson";
import { buildLesson } from "./test-utils/buildLesson";
import type { Lesson } from "./types";

async function renderContinue(
  nextLesson: Lesson | null,
  completedCount: number,
) {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <ContinueLesson
          nextLesson={nextLesson}
          completedCount={completedCount}
          totalCount={24}
        />
      ),
    },
  ]);
  render(<Stub initialEntries={["/"]} />);
  await screen.findByRole("heading", { level: 2 });
}

describe("ContinueLesson", () => {
  const lesson = buildLesson({ id: "home-f-j", title: "F and J" });

  it("invites a new user to start the first lesson", async () => {
    await renderContinue(lesson, 0);

    expect(
      screen.getByRole("heading", { name: "Start here" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Start lesson: F and J" }),
    ).toHaveAttribute("href", "/lessons/home-f-j");
    expect(screen.getByText("0 of 24 lessons complete")).toBeInTheDocument();
  });

  it("picks up where a returning user left off", async () => {
    await renderContinue(lesson, 5);

    expect(
      screen.getByRole("heading", { name: "Continue where you left off" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "5",
    );
  });

  it("celebrates finishing every lesson", async () => {
    await renderContinue(null, 24);

    expect(
      screen.getByRole("heading", { name: "Every lesson complete!" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Start lesson/ }),
    ).not.toBeInTheDocument();
  });
});

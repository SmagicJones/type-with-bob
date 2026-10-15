import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { getLayout } from "~/features/keyboard";
import type { SessionResult } from "~/features/typing-area";

import { LessonScreen } from "./LessonScreen";
import { buildLesson } from "./test-utils/buildLesson";
import type { LessonStatus } from "./types";

const lesson = buildLesson({
  title: "F and J",
  description: "Index fingers on F and J.",
  newKeys: ["f", "j", " "],
  pass: { minAccuracy: 90, minWpm: 5 },
});

async function renderScreen(status: LessonStatus = "unlocked", text = "fj") {
  const onComplete = vi.fn<(result: SessionResult) => void>();
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <LessonScreen
          lesson={lesson}
          text={text}
          status={status}
          layout={getLayout("uk-qwerty")}
          onComplete={onComplete}
        />
      ),
    },
  ]);
  render(<Stub initialEntries={["/"]} />);
  await screen.findByRole("heading", { level: 1, name: "F and J" });
  return { onComplete, user: userEvent.setup() };
}

describe("LessonScreen", () => {
  it("introduces the lesson, its new keys and what it takes to pass", async () => {
    await renderScreen();

    expect(screen.getByText("Index fingers on F and J.")).toBeInTheDocument();
    const newKeys = screen.getByRole("list", { name: "New keys:" });
    expect(
      within(newKeys)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(["f", "j", "Space"]);
    expect(
      screen.getByText("To pass: 90% accuracy and 5 words per minute."),
    ).toBeInTheDocument();
  });

  it("completes the lesson when the text is typed", async () => {
    const { onComplete, user } = await renderScreen("unlocked", "fj");

    await user.keyboard("fj");

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("starts again from the beginning", async () => {
    const { onComplete, user } = await renderScreen("unlocked", "fj");

    await user.keyboard("f");
    await user.click(screen.getByRole("button", { name: "Start again" }));
    await user.keyboard("fj");

    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete.mock.calls[0]![0].summary.accuracy).toBe(100);
  });

  it("explains a locked lesson instead of showing the typing area", async () => {
    await renderScreen("locked");

    expect(screen.getByText(/This lesson is locked/)).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "See all lessons" }),
    ).toHaveAttribute("href", "/lessons");
  });
});

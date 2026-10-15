import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { getLayout } from "~/features/keyboard";
import type { PracticeAttempt } from "~/features/progress";
import type { SessionResult } from "~/features/typing-area";

import { PracticeScreen } from "./PracticeScreen";
import { getLength, getSource } from "./practiceText";

const source = getSource("proverbs")!;
const length = getLength("short")!;

const savedResult: PracticeAttempt = {
  id: "p1",
  kind: "practice",
  sourceId: "proverbs",
  lengthId: "short",
  completedAt: 1_700_000_000_000,
  wpm: 42,
  accuracy: 98,
  elapsedMs: 21_000,
  errors: 1,
  keyStats: { a: { attempts: 2, errors: 1, avgLatencyMs: 150 } },
};

async function renderScreen(result: PracticeAttempt | null, text = "ok") {
  const onComplete = vi.fn<(result: SessionResult) => void>();
  const Stub = createRoutesStub([
    {
      path: "/practice",
      Component: () => (
        <PracticeScreen
          source={source}
          length={length}
          text={text}
          layout={getLayout("uk-qwerty")}
          result={result}
          onComplete={onComplete}
        />
      ),
    },
  ]);
  render(<Stub initialEntries={["/practice"]} />);
  await screen.findByText("Proverbs");
  return { onComplete };
}

describe("PracticeScreen", () => {
  it("shows the chosen settings and the typing area", async () => {
    await renderScreen(null);

    expect(screen.getByText(/short \(15 words\)/)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Typing area" })).toHaveFocus();
  });

  it("reports the result when the text is typed", async () => {
    const { onComplete } = await renderScreen(null, "ok");

    await userEvent.keyboard("ok");

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("shows results with options to go again once saved", async () => {
    await renderScreen(savedResult);

    expect(screen.getByRole("status")).toHaveTextContent("Practice complete");
    expect(
      screen.getByText("Words per minute").nextElementSibling,
    ).toHaveTextContent("42");
    expect(
      screen.getByRole("link", { name: "Practise again" }),
    ).toHaveAttribute("href", "/practice?source=proverbs&length=short");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});

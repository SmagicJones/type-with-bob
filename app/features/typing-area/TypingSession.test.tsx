import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { getLayout } from "~/features/keyboard";

import type { SessionResult } from "./sessionResult";
import { TypingSession } from "./TypingSession";

const uk = getLayout("uk-qwerty");

function setup(target = "fj fj") {
  const onComplete = vi.fn<(result: SessionResult) => void>();
  render(<TypingSession target={target} layout={uk} onComplete={onComplete} />);
  return { onComplete, user: userEvent.setup() };
}

describe("TypingSession", () => {
  it("focuses the typing area so the user can start straight away", () => {
    setup();

    expect(screen.getByRole("textbox", { name: "Typing area" })).toHaveFocus();
  });

  it("describes the passage for screen readers", () => {
    setup("fj fj");

    expect(
      screen.getByRole("textbox", { name: "Typing area" }),
    ).toHaveAccessibleDescription("Type this text: fj fj");
  });

  it("guides the first key before typing starts", () => {
    setup("fj");

    expect(screen.getByText("f – left index finger")).toBeInTheDocument();
  });

  it("moves the guide on as the user types", async () => {
    const { user } = setup("fj");

    await user.keyboard("f");

    expect(screen.getByText("j – right index finger")).toBeInTheDocument();
  });

  it("announces a mistake and the key to press", async () => {
    const { user } = setup("fj");

    await user.keyboard("x");

    expect(
      screen.getByText("Not quite. The next key is f."),
    ).toBeInTheDocument();
  });

  it("clears the announcement once the mistake is fixed", async () => {
    const { user } = setup("fj");

    await user.keyboard("xf");

    expect(screen.queryByText(/Not quite/)).not.toBeInTheDocument();
  });

  it("shows accuracy as the user types", async () => {
    const { user } = setup("fj");

    await user.keyboard("xf");

    expect(screen.getByText("Accuracy").nextElementSibling).toHaveTextContent(
      "50%",
    );
  });

  it("reports the result once, when the passage is finished", async () => {
    const { onComplete, user } = setup("fj");

    await user.keyboard("fxj");
    await user.keyboard("zz");

    expect(onComplete).toHaveBeenCalledTimes(1);
    const [result] = onComplete.mock.calls[0]!;
    expect(result.summary.errors).toBe(1);
    expect(result.summary.accuracy).toBeCloseTo(66.67, 1);
    expect(result.keyStats.j).toMatchObject({ attempts: 2, errors: 1 });
  });

  it("prompts the user to click back in after focus leaves", async () => {
    const { user } = setup("fj");

    await user.keyboard("f");
    await user.tab();

    expect(
      screen.getByText("Click here or press Tab to keep typing"),
    ).toBeInTheDocument();
  });

  it("lets the user click back into the typing area", async () => {
    const { user } = setup("fj");
    await user.tab();

    await user.click(screen.getByRole("textbox", { name: "Typing area" }));
    await user.keyboard("f");

    expect(screen.getByText("j – right index finger")).toBeInTheDocument();
  });
});

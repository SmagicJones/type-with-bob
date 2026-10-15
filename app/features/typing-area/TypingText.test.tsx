import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { applyKey, createEngine } from "~/features/typing-engine";

import { TypingText } from "./TypingText";

function renderState(target: string, keys: string) {
  const state = [...keys].reduce(
    (current, key, i) => applyKey(current, key, i),
    createEngine(target),
  );
  const { container } = render(
    <TypingText
      target={target}
      chars={state.chars}
      position={state.position}
    />,
  );
  const spans = [...container.querySelectorAll<HTMLElement>("[data-status]")];
  return { container, spans };
}

describe("TypingText", () => {
  it("shows the whole passage", () => {
    const { container } = renderState("sad lad", "");

    expect(container).toHaveTextContent("sad lad");
  });

  it("marks typed characters correct and the rest pending", () => {
    const { spans } = renderState("ab", "a");

    expect(spans.map((s) => s.dataset.status)).toEqual(["correct", "pending"]);
  });

  it("marks the cursor on the next character", () => {
    const { container } = renderState("abc", "a");

    expect(container.querySelector("[data-cursor]")).toHaveTextContent("b");
  });

  it("shows a mistake with an underline as well as colour", () => {
    const { spans } = renderState("ab", "x");

    expect(spans[0]?.dataset.status).toBe("incorrect");
    expect(spans[0]).toHaveClass("underline", "decoration-wavy");
  });

  it("marks a fixed mistake as corrected with a dotted underline", () => {
    const { spans } = renderState("ab", "xa");

    expect(spans[0]?.dataset.status).toBe("corrected");
    expect(spans[0]).toHaveClass("underline", "decoration-dotted");
  });

  it("makes a mistyped space visible", () => {
    const { spans } = renderState("a b", "ax");

    expect(spans[1]).toHaveTextContent("␣");
  });

  it("shows no cursor once the passage is complete", () => {
    const { container } = renderState("ab", "ab");

    expect(container.querySelector("[data-cursor]")).toBeNull();
  });

  it("is hidden from assistive technology", () => {
    const { container } = renderState("ab", "");

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getLayout } from "./layouts";
import { VisualKeyboard } from "./VisualKeyboard";

const uk = getLayout("uk-qwerty");
const us = getLayout("us-qwerty");

function keyState(container: HTMLElement, keyId: string) {
  return container
    .querySelector(`[data-key-id="${keyId}"]`)
    ?.getAttribute("data-state");
}

describe("VisualKeyboard", () => {
  it("tells the user which key and finger to use next", () => {
    render(<VisualKeyboard layout={uk} nextChar="f" />);

    expect(
      screen.getByRole("figure", { name: "Next key: f – left index finger" }),
    ).toBeInTheDocument();
  });

  it("highlights the next key and no others", () => {
    const { container } = render(<VisualKeyboard layout={uk} nextChar="j" />);

    expect(keyState(container, "KeyJ")).toBe("next");
    expect(container.querySelectorAll('[data-state="next"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-state="shift"]')).toHaveLength(0);
  });

  it("highlights the opposite Shift key for a capital", () => {
    const { container } = render(<VisualKeyboard layout={uk} nextChar="A" />);

    expect(keyState(container, "KeyA")).toBe("next");
    expect(keyState(container, "ShiftRight")).toBe("shift");
    expect(
      screen.getByText("A – left little finger, with right Shift"),
    ).toBeInTheDocument();
  });

  it("names the space bar in words", () => {
    render(<VisualKeyboard layout={uk} nextChar=" " />);

    expect(screen.getByText("Space – thumb")).toBeInTheDocument();
  });

  it("shows no highlight when there is no next character", () => {
    const { container } = render(
      <VisualKeyboard layout={uk} nextChar={null} />,
    );

    expect(container.querySelectorAll('[data-state="next"]')).toHaveLength(0);
    expect(
      screen.getByRole("figure", { name: "UK QWERTY keyboard" }),
    ).toBeInTheDocument();
  });

  it("shows letters as capitals and symbols with their shifted character", () => {
    render(<VisualKeyboard layout={uk} nextChar={null} />);

    expect(screen.getByText("Q")).toBeInTheDocument();
    expect(screen.getByText("£")).toBeInTheDocument();
  });

  it("draws tints with their labels on the keys they belong to", () => {
    const tints = new Map([
      ["KeyF", { className: "bg-red-500", label: "40%" }],
    ]);
    const { container } = render(
      <VisualKeyboard
        layout={uk}
        nextChar={null}
        keyTints={tints}
        caption="Mistakes by key"
      />,
    );

    const key = container.querySelector('[data-key-id="KeyF"]');
    expect(key).toHaveClass("bg-red-500");
    expect(key).toHaveTextContent("F40%");
    expect(container.querySelector('[data-key-id="KeyJ"]')).toHaveClass(
      "bg-gray-50",
    );
    expect(
      screen.getByRole("figure", { name: "Mistakes by key" }),
    ).toBeInTheDocument();
  });

  it("renders a different layout from data alone", () => {
    const { container } = render(<VisualKeyboard layout={us} nextChar="@" />);

    expect(keyState(container, "Digit2")).toBe("next");
    expect(keyState(container, "ShiftRight")).toBe("shift");
  });
});

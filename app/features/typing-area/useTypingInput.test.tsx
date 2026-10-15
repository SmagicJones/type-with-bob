import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { useTypingInput, type KeyHandler } from "./useTypingInput";

function Harness({ onKey, enabled }: { onKey: KeyHandler; enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useTypingInput(ref, onKey, enabled);
  return <div ref={ref} role="textbox" tabIndex={0} aria-label="Typing area" />;
}

function setup(enabled?: boolean) {
  const onKey = vi.fn<KeyHandler>();
  render(<Harness onKey={onKey} enabled={enabled} />);
  const box = screen.getByRole("textbox", { name: "Typing area" });
  box.focus();
  return { onKey, box, user: userEvent.setup() };
}

function keysReported(onKey: ReturnType<typeof vi.fn<KeyHandler>>) {
  return onKey.mock.calls.map(([key]) => key);
}

describe("useTypingInput", () => {
  it("reports typed characters with a performance.now() timestamp", async () => {
    vi.spyOn(performance, "now").mockReturnValue(1234);
    const { onKey, user } = setup();

    await user.keyboard("a");

    expect(onKey).toHaveBeenCalledWith("a", 1234);
  });

  it("reports capitals as the shifted character, not as Shift", async () => {
    const { onKey, user } = setup();

    await user.keyboard("{Shift>}A{/Shift}");

    expect(keysReported(onKey)).toEqual(["A"]);
  });

  it("ignores modifier-only key presses", async () => {
    const { onKey, user } = setup();

    await user.keyboard("{Shift}{Control}{Alt}{Meta}{CapsLock}");

    expect(onKey).not.toHaveBeenCalled();
  });

  it("passes named keys such as Backspace on to the engine to decide", async () => {
    const { onKey, user } = setup();

    await user.keyboard("{Backspace}{Enter}");

    expect(keysReported(onKey)).toEqual(["Backspace", "Enter"]);
  });

  it("leaves Ctrl and Cmd shortcuts to the browser", async () => {
    const { onKey, user } = setup();

    await user.keyboard("{Control>}r{/Control}{Meta>}c{/Meta}");

    expect(onKey).not.toHaveBeenCalled();
  });

  it("treats Ctrl+Alt as AltGr and reports the character", () => {
    const { onKey, box } = setup();

    fireEvent.keyDown(box, { key: "€", ctrlKey: true, altKey: true });

    expect(keysReported(onKey)).toEqual(["€"]);
  });

  it("leaves Tab alone so focus can move away", () => {
    const { onKey, box } = setup();

    const notCancelled = fireEvent.keyDown(box, { key: "Tab" });

    expect(notCancelled).toBe(true);
    expect(onKey).not.toHaveBeenCalled();
  });

  it("prevents the default action of Space and Backspace", () => {
    const { box } = setup();

    expect(fireEvent.keyDown(box, { key: " " })).toBe(false);
    expect(fireEvent.keyDown(box, { key: "Backspace" })).toBe(false);
  });

  it("ignores auto-repeat from a held key", () => {
    const { onKey, box } = setup();

    fireEvent.keyDown(box, { key: "a" });
    fireEvent.keyDown(box, { key: "a", repeat: true });

    expect(keysReported(onKey)).toEqual(["a"]);
  });

  it("ignores keys during IME composition", () => {
    const { onKey, box } = setup();

    fireEvent.keyDown(box, { key: "a", isComposing: true });

    expect(onKey).not.toHaveBeenCalled();
  });

  it("captures nothing when disabled", async () => {
    const { onKey, user } = setup(false);

    await user.keyboard("abc");

    expect(onKey).not.toHaveBeenCalled();
  });

  it("uses the latest handler without re-attaching", async () => {
    const first = vi.fn<KeyHandler>();
    const second = vi.fn<KeyHandler>();
    const { rerender } = render(<Harness onKey={first} />);
    screen.getByRole("textbox").focus();

    rerender(<Harness onKey={second} />);
    await userEvent.setup().keyboard("x");

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith("x", expect.any(Number));
  });
});

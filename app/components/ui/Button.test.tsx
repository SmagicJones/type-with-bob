import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("is a non-submitting button by default and responds to clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Try again</Button>);

    const button = screen.getByRole("button", { name: "Try again" });
    await userEvent.click(button);

    expect(button).toHaveAttribute("type", "button");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("accepts extra classes", () => {
    render(<Button className="w-full">Go</Button>);

    expect(screen.getByRole("button", { name: "Go" })).toHaveClass("w-full");
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ScrollArea } from "./ScrollArea";

describe("ScrollArea", () => {
  it("is a named region that keyboard users can tab to", async () => {
    render(
      <ScrollArea label="Session history">
        <table />
      </ScrollArea>,
    );

    await userEvent.tab();

    expect(
      screen.getByRole("region", { name: "Session history" }),
    ).toHaveFocus();
  });
});

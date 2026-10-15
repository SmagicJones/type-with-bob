import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { LayoutPicker } from "./LayoutPicker";

describe("LayoutPicker", () => {
  it("shows the current layout and submits a new choice", async () => {
    const action = vi.fn(async ({ request }: { request: Request }) => {
      const form = await request.formData();
      return { intent: form.get("intent"), layoutId: form.get("layoutId") };
    });
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => <LayoutPicker currentLayoutId="uk-qwerty" />,
        action,
      },
    ]);
    render(<Stub initialEntries={["/"]} />);
    const user = userEvent.setup();

    const select = await screen.findByRole("combobox", {
      name: "Keyboard layout",
    });
    expect(select).toHaveValue("uk-qwerty");

    await user.selectOptions(select, "US QWERTY");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await vi.waitFor(() => expect(action).toHaveBeenCalledOnce());
    await expect(action.mock.results[0]!.value).resolves.toEqual({
      intent: "set-layout",
      layoutId: "us-qwerty",
    });
  });
});

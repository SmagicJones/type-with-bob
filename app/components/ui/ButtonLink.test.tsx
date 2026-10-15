import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { ButtonLink } from "./ButtonLink";

describe("ButtonLink", () => {
  it("navigates like a link", async () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => <ButtonLink to="/next">Next lesson</ButtonLink>,
      },
      { path: "/next", Component: () => <h1>Next page</h1> },
    ]);
    render(<Stub initialEntries={["/"]} />);

    await userEvent.click(
      await screen.findByRole("link", { name: "Next lesson" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Next page" }),
    ).toBeInTheDocument();
  });
});

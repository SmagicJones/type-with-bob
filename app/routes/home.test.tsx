import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import type { Route } from "./+types/home";
import Home, { meta } from "./home";

describe("Home route", () => {
  it("sets the page title", () => {
    expect(meta({} as Route.MetaArgs)).toContainEqual({
      title: "Type with Bob",
    });
  });

  it("greets the user with the app name", async () => {
    const Stub = createRoutesStub([{ path: "/", Component: Home }]);

    render(<Stub initialEntries={["/"]} />);

    expect(
      await screen.findByRole("heading", { level: 1, name: "Type with Bob" }),
    ).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("wraps page content in a main landmark with a skip link to it", async () => {
    const Stub = createRoutesStub([
      { path: "/", Component: () => <AppShell>Page content</AppShell> },
    ]);
    render(<Stub initialEntries={["/"]} />);

    const main = await screen.findByRole("main");
    expect(main).toHaveTextContent("Page content");
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", `#${main.id}`);
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("links to every main section and marks the current one", async () => {
    const Stub = createRoutesStub([
      { path: "/lessons", Component: SiteHeader },
    ]);
    render(<Stub initialEntries={["/lessons"]} />);

    const nav = await screen.findByRole("navigation", { name: "Main" });
    for (const name of ["Home", "Lessons", "Practice", "Stats"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
    expect(nav.querySelector('[aria-current="page"]')).toHaveTextContent(
      "Lessons",
    );
  });
});

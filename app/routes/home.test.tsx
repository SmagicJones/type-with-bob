import { describe, expect, it } from "vitest";

import type { Route } from "./+types/home";
import { meta } from "./home";

// The home page's behaviour is covered end to end in e2e/home.spec.ts.
describe("Home route", () => {
  it("sets the page title", () => {
    expect(meta({} as Route.MetaArgs)).toContainEqual({
      title: "Type with Bob",
    });
  });
});

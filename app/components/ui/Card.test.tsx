import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card", () => {
  it("renders a labelled section", () => {
    render(
      <Card aria-labelledby="t">
        <h2 id="t">Results</h2>
      </Card>,
    );

    expect(screen.getByRole("region", { name: "Results" })).toBeInTheDocument();
  });
});

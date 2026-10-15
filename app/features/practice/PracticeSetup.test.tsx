import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub, useLocation } from "react-router";
import { describe, expect, it } from "vitest";

import { PracticeSetup } from "./PracticeSetup";

function ShowSearch() {
  return <p>Search: {useLocation().search}</p>;
}

async function renderSetup() {
  const Stub = createRoutesStub([
    {
      path: "/practice",
      Component: () => (
        <>
          <PracticeSetup
            defaultSourceId="common-words"
            defaultLengthId="short"
          />
          <ShowSearch />
        </>
      ),
    },
  ]);
  render(<Stub initialEntries={["/practice"]} />);
  await screen.findByRole("group", { name: "What would you like to type?" });
}

describe("PracticeSetup", () => {
  it("offers every source and length with the defaults selected", async () => {
    await renderSetup();

    expect(screen.getByRole("radio", { name: /Common words/ })).toBeChecked();
    expect(screen.getByRole("radio", { name: /Proverbs/ })).not.toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Proverbs" }),
    ).toHaveAccessibleDescription(/Well-known sayings/);
    expect(
      screen.getByRole("radio", { name: "Short (15 words)" }),
    ).toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Long (60 words)" }),
    ).toBeInTheDocument();
  });

  it("submits the chosen source and length in the URL", async () => {
    const user = userEvent.setup();
    await renderSetup();

    await user.click(screen.getByRole("radio", { name: /Proverbs/ }));
    await user.click(screen.getByRole("radio", { name: "Long (60 words)" }));
    await user.click(screen.getByRole("button", { name: "Start practice" }));

    expect(
      await screen.findByText("Search: ?source=proverbs&length=long"),
    ).toBeInTheDocument();
  });
});

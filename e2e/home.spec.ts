import { expect, test } from "@playwright/test";

import { expectNoAxeViolations } from "./test-utils/axe";
import { typeTargetText } from "./test-utils/typing";

test.describe("home", () => {
  test("welcomes a new user and starts the first lesson", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Type with Bob");
    await expect(page.getByText(/Hi, I'm Bob!/)).toBeVisible();
    await expect(page.getByText("0 of 24 lessons complete")).toBeVisible();
    await expectNoAxeViolations(page);

    await page.getByRole("link", { name: "Start lesson: F and J" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "F and J" }),
    ).toBeVisible();
  });

  test("continues where a returning user left off", async ({ page }) => {
    await page.goto("/lessons/home-f-j");
    await typeTargetText(page);
    await expect(page).toHaveURL(/\/results$/);

    await page.goto("/");

    await expect(page.getByText(/Welcome back!/)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Continue where you left off" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Start lesson: D and K" }),
    ).toBeVisible();
  });

  test("switches to the US layout and remembers it", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("combobox", { name: "Keyboard layout" })
      .selectOption("US QWERTY");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByRole("combobox", { name: "Keyboard layout" }),
    ).toHaveValue("us-qwerty");

    await page.reload();
    await expect(
      page.getByRole("combobox", { name: "Keyboard layout" }),
    ).toHaveValue("us-qwerty");

    // The US layout puts @ on Shift+2, which the UK layout does not.
    await page.goto("/lessons/home-f-j");
    const keyboard = page.getByRole("figure", { name: /Next key/ });
    await expect(keyboard.locator('[data-key-id="Digit2"]')).toContainText("@");
  });

  test("links to the other sections", async ({ page }) => {
    await page.goto("/");
    const more = page.getByRole("navigation", {
      name: "More ways to practise",
    });

    await more.getByRole("link", { name: /Free practice/ }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Free practice" }),
    ).toBeVisible();
  });
});

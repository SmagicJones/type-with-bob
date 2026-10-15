import { expect, test } from "@playwright/test";

import { expectNoAxeViolations } from "./test-utils/axe";

test("home page loads and is accessible", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Type with Bob");
  await expect(
    page.getByRole("heading", { level: 1, name: "Type with Bob" }),
  ).toBeVisible();
  await expectNoAxeViolations(page);
});

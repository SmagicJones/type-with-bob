import { expect, test } from "@playwright/test";

import { expectNoAxeViolations } from "./test-utils/axe";
import { typeTargetText } from "./test-utils/typing";

test.describe("stats", () => {
  test("shows an encouraging empty state before any sessions", async ({
    page,
  }) => {
    await page.goto("/stats");

    await expect(page.getByText(/No sessions yet/)).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Start a lesson" }),
    ).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test("shows history, trends and a heatmap after a couple of sessions", async ({
    page,
  }) => {
    await page.goto("/lessons/home-f-j");
    await page.keyboard.type("x"); // one deliberate mistake on "f"
    await typeTargetText(page);
    await expect(page).toHaveURL(/\/results$/);

    await page.goto("/practice?source=proverbs&length=short&seed=3");
    await typeTargetText(page);
    await expect(page.getByRole("status")).toHaveText(/Practice complete/);

    await page.goto("/stats");

    const sessions = page
      .getByText("Sessions", { exact: true })
      .locator("xpath=following-sibling::dd");
    await expect(sessions).toHaveText("2");
    const history = page.getByRole("table", {
      name: "Your sessions, newest first",
    });
    await expect(history.getByRole("rowheader")).toHaveText([
      "Proverbs (short)",
      "F and J",
    ]);
    await expect(
      page.getByRole("figure", { name: "Words per minute" }),
    ).toBeVisible();

    const heatmap = page.getByRole("figure", {
      name: "Mistake rate for each key",
    });
    await expect(heatmap).toBeVisible();
    await expect(heatmap.locator('[data-key-id="KeyF"]')).toContainText("%");
    await expectNoAxeViolations(page);

    await page.getByRole("button", { name: "Speed" }).click();
    await expect(
      page.getByRole("figure", { name: "Average time to press each key" }),
    ).toBeVisible();
    await expect(page.locator('[data-key-id="KeyJ"]')).toContainText("ms");
  });
});

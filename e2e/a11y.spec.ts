import { expect, test, type Page } from "@playwright/test";

import { expectNoAxeViolations } from "./test-utils/axe";
import { typeTargetText } from "./test-utils/typing";

// Every route, checked in each colour scheme and at phone width.
async function visitEveryRoute(page: Page) {
  const pages = [
    "/",
    "/lessons",
    "/lessons/home-f-j",
    "/practice",
    "/stats",
    "/nope",
  ];
  for (const path of pages) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoAxeViolations(page);
  }

  await page.goto("/lessons/home-f-j");
  await typeTargetText(page);
  await expect(page).toHaveURL(/\/results$/);
  await expectNoAxeViolations(page);

  await page.goto("/practice?source=proverbs&length=short&seed=5");
  await typeTargetText(page);
  await expect(page.getByRole("status")).toHaveText(/Practice complete/);
  await expectNoAxeViolations(page);

  await page.goto("/stats");
  await expect(
    page.getByRole("heading", { name: "Tricky keys" }),
  ).toBeVisible();
  await expectNoAxeViolations(page);
}

test.describe("accessibility in dark mode", () => {
  test.use({ colorScheme: "dark" });

  test("every route passes axe", async ({ page }) => {
    await visitEveryRoute(page);
  });
});

test.describe("accessibility at phone width", () => {
  test.use({ viewport: { width: 375, height: 740 } });

  test("every route passes axe without horizontal scrolling", async ({
    page,
  }) => {
    await visitEveryRoute(page);

    for (const path of ["/", "/lessons/home-f-j", "/stats"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(0);
    }
  });
});

test("animation respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/lessons/home-f-j");

  const cursor = page.locator("[data-cursor]");
  await expect(cursor).toBeVisible();
  expect(
    await cursor.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});

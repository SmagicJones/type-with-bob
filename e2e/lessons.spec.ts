import { expect, test } from "@playwright/test";

import { expectNoAxeViolations } from "./test-utils/axe";
import { typeTargetText } from "./test-utils/typing";

const STORAGE_KEY = "type-with-bob:progress:v1";

test.describe("lessons", () => {
  test("a new user sees only the first lesson unlocked", async ({ page }) => {
    await page.goto("/lessons");

    await expect(
      page.getByRole("heading", { level: 1, name: "Lessons" }),
    ).toBeVisible();
    await expect(page.getByText("0 of 24 lessons complete")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /F and J.*Ready/ }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /D and K/ })).toHaveCount(0);
    await expectNoAxeViolations(page);
  });

  test("complete a lesson, see results, and keep progress after reload", async ({
    page,
  }) => {
    await page.goto("/lessons");
    await page.getByRole("link", { name: /F and J/ }).click();

    await expect(
      page.getByRole("heading", { level: 1, name: "F and J" }),
    ).toBeVisible();
    await expect(
      page.getByText("Next key: f – left index finger"),
    ).toBeVisible();
    await expectNoAxeViolations(page);

    await typeTargetText(page);

    await expect(page).toHaveURL("/lessons/home-f-j/results");
    await expect(page.getByRole("status")).toHaveText(/Lesson passed!/);
    await expect(
      page.getByText("Accuracy").locator("xpath=following-sibling::dd"),
    ).toHaveText("100%");
    await expect(
      page.getByRole("table", { name: /per-key results/i }),
    ).toBeVisible();
    await expectNoAxeViolations(page);

    await page.reload();
    await expect(page.getByRole("status")).toHaveText(/Lesson passed!/);

    await page.getByRole("link", { name: "Next lesson: D and K" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "D and K" }),
    ).toBeVisible();

    await page.goto("/lessons");
    await page.reload();
    await expect(page.getByText("1 of 24 lessons complete")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /F and J.*Complete/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /D and K.*Ready/ }),
    ).toBeVisible();
  });

  test("a mistake is flagged and the cursor waits for the right key", async ({
    page,
  }) => {
    await page.goto("/lessons/home-f-j");
    const area = page.getByRole("textbox", { name: "Typing area" });
    await expect(area).toBeFocused();

    await page.keyboard.type("x");

    await expect(
      page.getByText("Not quite. The next key is f."),
    ).toBeAttached();
    await expect(area.locator('[data-status="incorrect"]')).toHaveCount(1);
    await expect(
      page.getByText("Accuracy").locator("xpath=following-sibling::dd"),
    ).toHaveText("0%");
  });

  test("results without an attempt send the user to the lesson", async ({
    page,
  }) => {
    await page.goto("/lessons/home-f-j/results");

    await expect(page).toHaveURL("/lessons/home-f-j");
  });

  test("a locked lesson explains how to unlock it", async ({ page }) => {
    await page.goto("/lessons/home-d-k");

    await expect(page.getByText(/This lesson is locked/)).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Typing area" }),
    ).toHaveCount(0);
  });

  test("an unknown lesson shows a friendly not-found message", async ({
    page,
  }) => {
    await page.goto("/lessons/no-such-lesson");

    await expect(
      page.getByRole("heading", { name: "Lesson not found" }),
    ).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test("corrupt saved progress does not crash the app", async ({ page }) => {
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "{definitely not json");
    }, STORAGE_KEY);

    await page.goto("/lessons");

    await expect(page.getByText("0 of 24 lessons complete")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /F and J.*Ready/ }),
    ).toBeVisible();
  });
});

test("an unknown page shows a friendly 404", async ({ page }) => {
  await page.goto("/this/does/not/exist");

  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Go home" })).toBeVisible();
  await expectNoAxeViolations(page);
});

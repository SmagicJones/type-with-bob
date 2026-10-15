import { expect, test } from "@playwright/test";

import { expectNoAxeViolations } from "./test-utils/axe";
import { getTargetText, typeTargetText } from "./test-utils/typing";

test.describe("free practice", () => {
  test("choose a source and length, type it, and see results", async ({
    page,
  }) => {
    await page.goto("/practice");
    await expect(
      page.getByRole("heading", { level: 1, name: "Free practice" }),
    ).toBeVisible();
    await expectNoAxeViolations(page);

    await page.getByRole("radio", { name: /Proverbs/ }).check();
    await page.getByRole("radio", { name: "Short (15 words)" }).check();
    await page.getByRole("button", { name: "Start practice" }).click();

    await expect(page).toHaveURL(
      /\/practice\?source=proverbs&length=short&seed=\d+$/,
    );
    const text = await getTargetText(page);
    expect(text.split(" ")).toHaveLength(15);
    await expectNoAxeViolations(page);

    await typeTargetText(page);

    await expect(page.getByRole("status")).toHaveText(/Practice complete/);
    await expect(
      page.getByText("Accuracy").locator("xpath=following-sibling::dd"),
    ).toHaveText("100%");
    await expectNoAxeViolations(page);
  });

  test("keeps the same text after a reload and offers a fresh one to go again", async ({
    page,
  }) => {
    await page.goto("/practice?source=common-words&length=medium");
    await expect(page).toHaveURL(/seed=\d+/);
    const first = await getTargetText(page);
    expect(first.split(" ")).toHaveLength(30);

    await page.reload();
    expect(await getTargetText(page)).toBe(first);

    await typeTargetText(page);
    await page.getByRole("link", { name: "Practise again" }).click();
    await expect(page).toHaveURL(/source=common-words&length=medium&seed=\d+/);
    await expect(
      page.getByRole("textbox", { name: "Typing area" }),
    ).toBeFocused();
  });

  test("remembers the last settings used", async ({ page }) => {
    await page.goto("/practice?source=short-stories&length=long&seed=1");
    await typeTargetText(page);
    await expect(page.getByRole("status")).toHaveText(/Practice complete/);

    await page.getByRole("link", { name: "Change settings" }).first().click();

    await expect(
      page.getByRole("radio", { name: /Short stories/ }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", { name: "Long (60 words)" }),
    ).toBeChecked();
  });
});

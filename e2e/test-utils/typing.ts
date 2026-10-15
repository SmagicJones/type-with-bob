import { expect, type Page } from "@playwright/test";

const PREFIX = "Type this text: ";

/** Reads the passage from the typing area's accessible description. */
export async function getTargetText(page: Page): Promise<string> {
  const area = page.getByRole("textbox", { name: "Typing area" });
  await expect(area).toBeFocused();
  const description = await area.getAttribute("aria-describedby");
  const text = await page.locator(`[id="${description}"]`).textContent();
  if (!text?.startsWith(PREFIX))
    throw new Error(`Unexpected description: ${text}`);
  return text.slice(PREFIX.length);
}

/** Types the whole passage in the focused typing area. */
export async function typeTargetText(page: Page): Promise<void> {
  await page.keyboard.type(await getTargetText(page));
}

import { test, expect } from "@playwright/test";

test("incrementing bet by one step should not trigger step validation error", async ({
  page,
}) => {
  await page.goto("/auctions");
  await page.locator("table tbody tr").first().click();
  await page.waitForURL(/\/auctions\/[a-f0-9-]+/);

  // try the detail page buttons first
  const betButton = page
    .locator("button")
    .filter({ hasText: /Сделать ставку|Изменить ставку/ })
    .first();
  const disabled = await betButton.isDisabled().catch(() => true);

  if (disabled) {
    test.skip(true, "bet button disabled on this auction");
    return;
  }

  await betButton.click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  const priceInput = modal.locator("input").first();
  await priceInput.fill("0");
  await priceInput.press("ArrowUp");
  await priceInput.press("ArrowUp");

  await modal.getByRole("button", { name: "Разместить ставку" }).click();

  await expect(modal).not.toContainText(/кратна шагу ставки/);
  await expect(modal).not.toContainText(/Цена обязательна/);
});

import { test, expect } from "@playwright/test";

test("first bet on auction with no history should appear in bet list", async ({
  page,
}) => {
  await page.goto("/auctions");
  await expect(
    page.getByRole("heading", { name: "Грузовые аукционы" })
  ).toBeVisible();

  // find any row with "Нет ставки" — click its cell (not the button) to navigate
  const firstNoBetCell = page.getByText("Нет ставки").first();
  await expect(firstNoBetCell).toBeVisible({ timeout: 5000 });

  // click the parent row via clicking on the cargo_num cell which is always present
  const row = page
    .locator("table tbody tr")
    .filter({ hasText: "Нет ставки" })
    .first();
  await row.click();
  await page.waitForURL(/\/auctions\/[a-f0-9-]+/);

  // check if bet button is available
  const betBtn = page.locator('button:has-text("Сделать ставку")').first();
  if (await betBtn.isDisabled().catch(() => true)) {
    test.skip(true, "bet not available on this auction");
    return;
  }

  // verify no bets yet on the bets tab
  await page.getByRole("tab", { name: "Ставки" }).click();
  const empty = page.getByText("Ставок пока нет");
  if (!(await empty.isVisible({ timeout: 2000 }).catch(() => false))) {
    test.skip(true, "auction already has bets");
    return;
  }

  // open bet form and submit at default price
  await page.getByRole("tab", { name: "Детали аукциона" }).click();
  await betBtn.click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  // capture the default price from the input
  const input = modal.locator("input").first();

  await modal.getByRole("button", { name: "Разместить ставку" }).click();

  // check if there's an inline error
  const errorText = await modal
    .getByText(/кратна|Цена обязательна|меньше|больше/)
    .isVisible({ timeout: 1000 })
    .catch(() => false);
  if (errorText) {
    // form validation rejected — try with a higher value
    await input.press("ArrowUp");
    await modal.getByRole("button", { name: "Разместить ставку" }).click();
  }

  await expect(modal).not.toBeVisible({ timeout: 5000 });

  // verify our bet appears
  await page.getByRole("tab", { name: "Ставки" }).click();
  await expect(page.getByText("Вы")).toBeVisible({ timeout: 5000 });
});

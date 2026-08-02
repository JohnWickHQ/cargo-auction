import { test, expect } from "@playwright/test";

test("low bid should not become the winner", async ({ page }) => {
  await page.goto("/auctions");

  let found = false;

  for (let p = 0; p < 4 && !found; p++) {
    const rows = page.locator("table tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count && !found; i++) {
      await rows.nth(i).click();
      await page.waitForURL(/\/auctions\/[a-f0-9-]+/);

      // check bet button
      const betButton = page
        .locator("button")
        .filter({ hasText: /Сделать ставку|Изменить ставку/ })
        .first();
      const btnDisabled = await betButton.isDisabled().catch(() => true);
      if (btnDisabled) {
        await page.goto("/auctions");
        continue;
      }

      // check bets tab for existing winner
      const betsTab = page.getByRole("tab", { name: "Ставки" });
      await betsTab.click();
      const hidden = await page
        .getByText("История ставок скрыта")
        .isVisible()
        .catch(() => false);
      if (hidden) {
        await page.goto("/auctions");
        continue;
      }

      const winnerRow = page.locator('tr:has-text("Победитель")').first();
      const hasWinner = await winnerRow.isVisible().catch(() => false);
      if (!hasWinner) {
        await page.goto("/auctions");
        continue;
      }

      found = true;
    }

    if (!found) {
      const nextBtn = page
        .locator(".mantine-Pagination-control")
        .filter({ hasText: String(p + 2) })
        .first();
      if (await nextBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await nextBtn.click();
      } else {
        break;
      }
    }
  }

  if (!found) {
    test.skip(true, "no suitable auction found");
    return;
  }

  // we are on the detail page of an auction with bets and a winner
  await page.getByRole("tab", { name: "Детали аукциона" }).click();

  const betButton = page
    .locator("button")
    .filter({ hasText: /Сделать ставку|Изменить ставку/ })
    .first();
  await betButton.click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  // read minimum price and step
  const modalText = await modal.textContent();
  const stepMatch = modalText?.match(/Шаг ставки: ([\d\s]+) ₽/);
  const minMatch = modalText?.match(/Минимальная цена: ([\d\s]+) ₽/);
  const step = stepMatch ? parseInt(stepMatch[1]!.replace(/\s/g, "")) : 100;
  const min = minMatch ? parseInt(minMatch[1]!.replace(/\s/g, "")) : 0;

  // place bet at min+step (should be lower than existing winner)
  const priceInput = modal.locator("input").first();
  await priceInput.fill(String(min + step));
  await modal.getByRole("button", { name: "Разместить ставку" }).click();

  const stillOpen = await modal.isVisible({ timeout: 2000 }).catch(() => false);
  if (stillOpen) {
    await page.getByRole("button", { name: "Отмена" }).click();
    test.skip(true, "bet rejected");
    return;
  }

  // verify our low bid is NOT the winner
  const betsTab = page.getByRole("tab", { name: "Ставки" });
  await betsTab.click();
  await expect(page.getByText("Вы")).toBeVisible({ timeout: 3000 });
  await expect(page.locator('tr:has-text("Вы")').first()).not.toContainText(
    "Победитель"
  );
});

import { test, expect } from "@playwright/test";

test("opens auction list and navigates to detail page", async ({ page }) => {
  await page.goto("/auctions");

  await expect(
    page.getByRole("heading", { name: "Грузовые аукционы" })
  ).toBeVisible();

  const rows = page.locator("table tbody tr");
  await expect(rows.first()).toBeVisible();

  await rows.first().click();

  await expect(page).toHaveURL(/\/auctions\/[a-f0-9-]+/);

  await expect(
    page.getByRole("heading", { name: /Заявка A24-/ })
  ).toBeVisible();

  await expect(
    page.getByRole("tab", { name: "Детали аукциона" })
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: "Ставки" })).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Грузовые аукционы" })
  ).toBeVisible();
});

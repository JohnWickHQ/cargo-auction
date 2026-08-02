/** Returns true if price is a multiple of betStep within 0.001 tolerance. */
function isMultipleOf(price: number, step: number): boolean {
  return Math.abs(Math.round(price / step) * step - price) < 0.001;
}

export function validateBetPrice(
  price: number,
  {
    minPrice,
    maxPrice,
    betStep,
  }: { minPrice: number | null; maxPrice: number | null; betStep: number }
): string | null {
  if (!price || price <= 0) {
    return "Цена обязательна и должна быть больше 0";
  }
  if (minPrice !== null && minPrice !== undefined && price < minPrice) {
    return `Минимальная цена: ${minPrice}`;
  }
  if (maxPrice !== null && maxPrice !== undefined && price > maxPrice) {
    return `Максимальная цена: ${maxPrice}`;
  }
  if (!isMultipleOf(price, betStep)) {
    return `Шаг ставки: ${betStep}`;
  }
  return null;
}

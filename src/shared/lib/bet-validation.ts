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
  if (minPrice && price < minPrice) {
    return `Минимальная цена: ${minPrice}`;
  }
  if (maxPrice && price > maxPrice) {
    return `Максимальная цена: ${maxPrice}`;
  }
  const deviation = Math.abs(Math.round(price / betStep) * betStep - price);
  if (deviation >= 0.001) {
    return `Шаг ставки: ${betStep}`;
  }
  return null;
}

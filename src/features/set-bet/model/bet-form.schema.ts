import { z } from "zod";

export function createBetFormSchema(params: {
  min_price?: number | null;
  max_price?: number | null;
  bet_step: number;
}) {
  let schema: z.ZodType<{ price: number }> = z.object({
    price: z
      .number({
        required_error: "Цена обязательна",
        invalid_type_error: "Введите число",
      })
      .positive("Цена должна быть больше 0"),
  });

  if (params.min_price !== null && params.min_price !== undefined) {
    schema = schema.refine((data) => data.price >= params.min_price!, {
      message: `Минимальная цена: ${params.min_price} ₽`,
      path: ["price"],
    });
  }
  if (params.max_price !== null && params.max_price !== undefined) {
    schema = schema.refine((data) => data.price <= params.max_price!, {
      message: `Максимальная цена: ${params.max_price} ₽`,
      path: ["price"],
    });
  }
  schema = schema.refine(
    (data) =>
      Math.abs(
        Math.round(data.price / params.bet_step) * params.bet_step - data.price
      ) < 0.001,
    {
      message: `Цена должна быть кратна шагу ставки: ${params.bet_step} ₽`,
      path: ["price"],
    }
  );

  return schema;
}

export type BetFormValues = z.infer<ReturnType<typeof createBetFormSchema>>;

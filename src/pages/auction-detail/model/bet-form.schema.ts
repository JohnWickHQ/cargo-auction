import { z } from "zod";
import { validateBetPrice } from "@/shared/lib";

export function createBetFormSchema(params: {
  min_price?: number | null;
  max_price?: number | null;
  bet_step: number;
}) {
  const schema = z.object({
    price: z
      .number({
        required_error: "Цена обязательна",
        invalid_type_error: "Введите число",
      })
      .positive("Цена должна быть больше 0"),
  });

  return schema.superRefine((data, ctx) => {
    const error = validateBetPrice(data.price, {
      minPrice: params.min_price ?? null,
      maxPrice: params.max_price ?? null,
      betStep: params.bet_step,
    });
    if (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${error} ₽`,
        path: ["price"],
      });
    }
  });
}

export type BetFormValues = z.infer<ReturnType<typeof createBetFormSchema>>;

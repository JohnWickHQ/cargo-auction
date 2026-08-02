import { useMemo } from "react";
import { useParams } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  Stack,
  Text,
  NumberInput,
  Alert,
  Group,
  Button,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAuctionDetail } from "@/entities/auction";
import { useSetBet } from "../model/bet.hooks";
import {
  createBetFormSchema,
  type BetFormValues,
} from "../model/bet-form.schema";
import type { ValidationError } from "@/shared/types";

interface BetFormProps {
  opened: boolean;
  onClose: () => void;
}

// eslint-disable-next-line complexity
export function BetForm({ opened, onClose }: BetFormProps) {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" });
  const { data: auction } = useAuctionDetail(auctionUuid);
  const mutation = useSetBet(auctionUuid);

  const schema = useMemo(
    () =>
      createBetFormSchema({
        min_price: auction?.trading.min_price ?? null,
        max_price: auction?.trading.max_price ?? null,
        bet_step: auction?.trading.bet_step ?? 1,
      } as {
        min_price?: number | null;
        max_price?: number | null;
        bet_step: number;
      }),
    [
      auction?.trading.min_price,
      auction?.trading.max_price,
      auction?.trading.bet_step,
    ]
  );

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<BetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { price: auction?.trading.current_price } as {
      price?: number;
    },
  });

  const onSubmit = async (values: BetFormValues) => {
    try {
      await mutation.mutateAsync({ price: values.price });
      notifications.show({
        title: "Ставка принята",
        message: "Ваша ставка успешно размещена",
        color: "green",
      });
      reset();
      onClose();
    } catch (err: unknown) {
      const validationErr = err as ValidationError | undefined;
      if (
        validationErr?.error === "VALIDATION_ERROR" &&
        validationErr.details
      ) {
        validationErr.details.forEach((d) => {
          if (d.field === "price") {
            setError("price", { message: d.message });
          }
        });
      } else {
        notifications.show({
          title: "Ошибка",
          message: "Не удалось разместить ставку",
          color: "red",
        });
      }
    }
  };

  if (!auction) return null;

  const isUp = auction.auc_type === "Up" || auction.auc_type === "Request";
  const isDown = auction.auc_type === "Down";
  const defaultPrice = isUp
    ? auction.trading.current_price + auction.trading.bet_step
    : isDown
      ? Math.max(
          auction.trading.current_price - auction.trading.bet_step,
          auction.trading.min_price ?? 0
        )
      : auction.trading.current_price;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Сделать ставку"
      centered
      size="md"
    >
      <form
        onSubmit={(e) => {
          void (
            handleSubmit(onSubmit) as (e: React.BaseSyntheticEvent) => void
          )(e);
        }}
      >
        <Stack>
          {auction.trading.min_price !== null && (
            <Text size="sm" c="dimmed">
              Минимальная цена:{" "}
              {new Intl.NumberFormat("ru-RU").format(auction.trading.min_price)}{" "}
              ₽
            </Text>
          )}
          {auction.trading.max_price !== null && (
            <Text size="sm" c="dimmed">
              Максимальная цена:{" "}
              {new Intl.NumberFormat("ru-RU").format(auction.trading.max_price)}{" "}
              ₽
            </Text>
          )}
          <Text size="sm" c="dimmed">
            Шаг ставки:{" "}
            {new Intl.NumberFormat("ru-RU").format(auction.trading.bet_step)} ₽
          </Text>
          <Text size="sm" c="dimmed">
            Текущая цена:{" "}
            {new Intl.NumberFormat("ru-RU").format(
              auction.trading.current_price
            )}{" "}
            ₽
          </Text>

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Цена ставки (₽)"
                placeholder="Введите цену"
                min={auction.trading.min_price ?? 0}
                step={auction.trading.bet_step}
                error={errors.price?.message}
                disabled={mutation.isPending}
                data-autofocus
                onChange={(v) => {
                  if (typeof v === "number") {
                    const betStep = auction.trading.bet_step;
                    field.onChange(Math.round(v / betStep) * betStep);
                  } else {
                    field.onChange(v as never);
                  }
                }}
              />
            )}
          />

          <Text size="xs" c="dimmed">
            Рекомендуемая цена:{" "}
            {new Intl.NumberFormat("ru-RU").format(defaultPrice)} ₽
          </Text>

          {errors.price && (
            <Alert color="red" variant="light">
              {errors.price.message}
            </Alert>
          )}

          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Отмена
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Разместить ставку
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

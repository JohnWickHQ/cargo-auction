import { useMemo, useCallback } from "react";
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
import type { AuctionType } from "@/shared/types";
import { isValidationError } from "@/shared/lib";

interface BetFormProps {
  opened: boolean;
  onClose: () => void;
}

function getDefaultPrice(
  aucType: AuctionType,
  trading: { current_price: number; bet_step: number; min_price: number | null }
): number {
  switch (aucType) {
    case "Up":
    case "Request":
      return trading.current_price + trading.bet_step;
    case "Down":
      return Math.max(
        trading.current_price - trading.bet_step,
        trading.min_price ?? 0
      );
    case "FixPrice":
      return trading.current_price;
  }
}

export function BetForm({ opened, onClose }: BetFormProps) {
  const { auctionUuid } = useParams({ from: "/auctions/$auctionUuid" });
  const { data: auction } = useAuctionDetail(auctionUuid);
  const mutation = useSetBet(auctionUuid);

  const schema = useMemo(
    () =>
      createBetFormSchema({
        min_price: auction.trading.min_price,
        max_price: auction.trading.max_price,
        bet_step: auction.trading.bet_step,
      }),
    [
      auction.trading.min_price,
      auction.trading.max_price,
      auction.trading.bet_step,
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
    defaultValues: { price: auction.trading.current_price },
  });

  const onSubmit = async (data: BetFormValues) => {
    try {
      await mutation.mutateAsync({ price: data.price });
      notifications.show({
        title: "Ставка размещена",
        message: `Ваша ставка: ${new Intl.NumberFormat("ru-RU").format(data.price)} ₽`,
        color: "green",
      });
      reset({ price: data.price });
      onClose();
    } catch (err: unknown) {
      if (isValidationError(err)) {
        for (const detail of err.details) {
          setError("price", { message: detail.message });
        }
      } else {
        console.error("Bet submission failed:", err);
        notifications.show({
          title: "Ошибка",
          message: "Не удалось разместить ставку",
          color: "red",
        });
      }
    }
  };

  const defaultPrice = useMemo(
    () => getDefaultPrice(auction.auc_type, auction.trading),
    [auction.auc_type, auction.trading]
  );

  const submitHandler = useCallback(
    (e: React.FormEvent) => {
      void handleSubmit(onSubmit)(e);
    },
    [handleSubmit, onSubmit]
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Сделать ставку"
      centered
      size="md"
    >
      <form onSubmit={submitHandler}>
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
                  const betStep = auction.trading.bet_step;
                  if (betStep <= 0) return;
                  if (typeof v === "number") {
                    field.onChange(Math.round(v / betStep) * betStep);
                  } else {
                    field.onChange(v ? parseFloat(v) : 0);
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
            <Button variant="default" onClick={onClose}>
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

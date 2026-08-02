import { useState, useTransition } from "react";
import {
  Box,
  Button,
  Collapse,
  Grid,
  Select,
  MultiSelect,
  TextInput,
  Switch,
  NumberInput,
  Group,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DatePickerInput } from "@/shared/ui";
import { IconFilter, IconX } from "@tabler/icons-react";
import { AuctionTypeValues, AuctionStatusValues } from "@/shared/config";
import { useFiltersSync } from "../model/use-filters-sync";
import type { AuctionFilters } from "../model/filters.schema";
import { CitySelect } from "@/shared/ui";
import { auctionStatusLabels, auctionTypeLabels } from "@/shared/config";

const statusData = AuctionStatusValues.map((s) => ({
  value: s,
  label: auctionStatusLabels[s]!,
}));
const typeData = AuctionTypeValues.map((t) => ({
  value: t,
  label: auctionTypeLabels[t]!,
}));

// eslint-disable-next-line complexity
export function AuctionFilters() {
  const [filters, setFilters] = useFiltersSync();
  const [opened, { toggle }] = useDisclosure(true);
  const [isPending, startTransition] = useTransition();

  const [local, setLocal] = useState<AuctionFilters>(filters);

  const apply = () => {
    startTransition(() => {
      setFilters({ ...local, page: 1 });
    });
  };

  const clear = () => {
    const empty: AuctionFilters = { page: 1, per_page: 20 };
    setLocal(empty);
    setFilters(empty, "replace");
  };

  const hasActive = Object.entries(filters).some(
    ([k, v]) =>
      k !== "page" &&
      k !== "per_page" &&
      v !== undefined &&
      v !== null &&
      v !== ""
  );

  return (
    <Box mb="md">
      <Group mb="sm">
        <Button
          variant="subtle"
          leftSection={<IconFilter size={16} />}
          onClick={toggle}
        >
          Фильтры {hasActive ? "(активны)" : ""}
          {isPending ? "…" : ""}
        </Button>
        {hasActive && (
          <Button
            variant="subtle"
            color="red"
            size="sm"
            leftSection={<IconX size={14} />}
            onClick={clear}
          >
            Сбросить
          </Button>
        )}
      </Group>

      <Collapse in={opened}>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              label="Номер заявки"
              value={local.cargo_num ?? ""}
              onChange={(e) =>
                setLocal({ ...local, cargo_num: e.target.value || undefined })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Select
              label="Статус"
              data={statusData}
              value={local.status ?? null}
              onChange={(v) => setLocal({ ...local, status: v || undefined })}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <MultiSelect
              label="Статусы"
              data={statusData}
              value={local.statuses ?? []}
              onChange={(v) =>
                setLocal({ ...local, statuses: v.length > 0 ? v : undefined })
              }
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Select
              label="Тип аукциона"
              data={typeData}
              value={local.auc_type ?? null}
              onChange={(v) => setLocal({ ...local, auc_type: v || undefined })}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <CitySelect
              label="Город погрузки"
              value={local.load_city ?? null}
              onChange={(v) =>
                setLocal({ ...local, load_city: v || undefined })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <CitySelect
              label="Город разгрузки"
              value={local.unload_city ?? null}
              onChange={(v) =>
                setLocal({ ...local, unload_city: v || undefined })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <DatePickerInput
              label="Дата погрузки от"
              value={
                local.load_date_from ? new Date(local.load_date_from) : null
              }
              onChange={(v) =>
                setLocal({
                  ...local,
                  load_date_from:
                    v instanceof Date
                      ? v.toISOString().split("T")[0]
                      : undefined,
                })
              }
              clearable
              valueFormat="DD.MM.YYYY"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <DatePickerInput
              label="Дата погрузки до"
              value={local.load_date_to ? new Date(local.load_date_to) : null}
              onChange={(v) =>
                setLocal({
                  ...local,
                  load_date_to:
                    v instanceof Date
                      ? v.toISOString().split("T")[0]
                      : undefined,
                })
              }
              clearable
              valueFormat="DD.MM.YYYY"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <NumberInput
              label="Цена от"
              value={local.price_from ?? ""}
              onChange={(v) =>
                setLocal({
                  ...local,
                  price_from: typeof v === "number" ? v : undefined,
                })
              }
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <NumberInput
              label="Цена до"
              value={local.price_to ?? ""}
              onChange={(v) =>
                setLocal({
                  ...local,
                  price_to: typeof v === "number" ? v : undefined,
                })
              }
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group mt="md" gap="md">
              <Switch
                label="Доступен"
                checked={local.is_available === "true"}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    is_available: e.currentTarget.checked ? "true" : undefined,
                  })
                }
              />
              <Divider orientation="vertical" />
              <Switch
                label="Я участник"
                checked={local.is_bidder === "true"}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    is_bidder: e.currentTarget.checked ? "true" : undefined,
                  })
                }
              />
            </Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Group mt="md">
              <Button onClick={apply}>Применить</Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Collapse>
    </Box>
  );
}

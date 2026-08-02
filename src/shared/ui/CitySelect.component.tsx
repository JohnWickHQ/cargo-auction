import { memo } from "react";
import { Select } from "@mantine/core";
import { CITIES } from "@/shared/config";
import type { SelectProps } from "@mantine/core";

const cityData = CITIES.map((c) => ({ value: c, label: c }));

export const CitySelect = memo(function CitySelect(
  props: Partial<SelectProps>
) {
  return (
    <Select
      data={cityData}
      clearable
      searchable
      placeholder="Выберите город"
      {...props}
    />
  );
});

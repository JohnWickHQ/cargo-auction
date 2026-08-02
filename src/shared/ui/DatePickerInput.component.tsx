import { lazy, Suspense, memo } from "react";
import { Skeleton } from "@mantine/core";

const DatePickerInputInner = lazy(async () => {
  await import("@mantine/dates/styles.css");
  const mod = await import("@mantine/dates");
  return { default: mod.DatePickerInput };
});

export const DatePickerInput = memo(function DatePickerInput(
  props: Record<string, unknown>
) {
  return (
    <Suspense fallback={<Skeleton height={36} />}>
      <DatePickerInputInner {...props} />
    </Suspense>
  );
});

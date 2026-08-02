import { lazy, Suspense, memo } from "react";
import { Skeleton } from "@mantine/core";

const DatePickerInputInner = lazy(async () => {
  await import("@mantine/dates/styles.css");
  const mod = await import("@mantine/dates");
  return { default: mod.DatePickerInput };
});

type DatePickerInputProps = Partial<
  React.ComponentProps<typeof DatePickerInputInner>
>;

export const DatePickerInput = memo(function DatePickerInput(
  props: DatePickerInputProps
) {
  return (
    <Suspense fallback={<Skeleton height={36} />}>
      <DatePickerInputInner {...props} />
    </Suspense>
  );
});

export type { DatePickerInputProps };

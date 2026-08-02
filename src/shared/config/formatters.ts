export function orUndefined<T>(v: T | "" | null): T | undefined {
  if (v === "" || v === null) return undefined;
  return v;
}

export function toDateFilter(v: unknown): string | undefined {
  if (v instanceof Date) return v.toISOString().split("T")[0]!;
  return undefined;
}

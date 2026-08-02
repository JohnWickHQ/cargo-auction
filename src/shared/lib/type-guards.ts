import type { ValidationError } from "@/shared/types";

export function isValidationError(err: unknown): err is ValidationError {
  return (
    typeof err === "object" &&
    err !== null &&
    "error" in err &&
    (err as ValidationError).error === "VALIDATION_ERROR" &&
    "details" in err
  );
}

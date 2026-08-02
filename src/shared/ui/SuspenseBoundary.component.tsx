import { Suspense, Component, useCallback, type ReactNode } from "react";
import { Alert, Button, Skeleton, Stack, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

interface SuspenseBoundaryProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: (error: Error, reset: () => void) => ReactNode;
  onReset?: () => void;
}

function DefaultLoadingFallback() {
  return (
    <Stack>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} height={50} radius="sm" />
      ))}
    </Stack>
  );
}

function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Ошибка загрузки"
      color="red"
      variant="filled"
    >
      <Text size="sm">{error.message || "Неизвестная ошибка"}</Text>
      <Button variant="white" color="red" size="xs" mt="sm" onClick={reset}>
        Повторить
      </Button>
    </Alert>
  );
}

export function SuspenseBoundary({
  children,
  loadingFallback,
  errorFallback,
  onReset,
}: SuspenseBoundaryProps) {
  const defaultErrorFallback = useCallback(
    (error: Error, resetCb: () => void) => (
      <DefaultErrorFallback error={error} reset={resetCb} />
    ),
    []
  );

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <PageErrorBoundary
          errorFallback={errorFallback ?? defaultErrorFallback}
          onReset={reset}
          outerOnReset={onReset}
        >
          <Suspense fallback={loadingFallback ?? <DefaultLoadingFallback />}>
            {children}
          </Suspense>
        </PageErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

interface PageErrorBoundaryProps {
  children: ReactNode;
  errorFallback?: (error: Error, reset: () => void) => ReactNode;
  onReset?: () => void;
  outerOnReset?: (() => void) | undefined;
}

interface PageErrorBoundaryState {
  error: Error | null;
}

class PageErrorBoundary extends Component<
  PageErrorBoundaryProps,
  PageErrorBoundaryState
> {
  constructor(props: PageErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  handleReset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
    this.props.outerOnReset?.();
  };

  render() {
    if (this.state.error) {
      if (this.props.errorFallback) {
        return this.props.errorFallback(this.state.error, this.handleReset);
      }

      return (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Ошибка"
          color="red"
          variant="filled"
        >
          <Text size="sm">{this.state.error.message}</Text>
          <Button
            variant="white"
            color="red"
            size="xs"
            mt="sm"
            onClick={this.handleReset}
          >
            Повторить
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}

import { useNavigate, type ErrorComponentProps } from "@tanstack/react-router";
import { WarningIcon } from "@phosphor-icons/react";
import ErrorState from "./UI/ErrorState";
import Button from "./UI/Button";

function ErrorPage({ error, reset }: ErrorComponentProps) {
  const navigate = useNavigate();

  return (
    <ErrorState
      icon={WarningIcon}
      title="Something went wrong"
      description="An unexpected error occurred."
      detail={import.meta.env.DEV ? (error instanceof Error ? error.message : String(error)) : undefined}
      actions={
        <>
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <Button onClick={() => void navigate({ to: "/" })}>Back to talent database</Button>
        </>
      }
    />
  );
}

export default ErrorPage;

import { useNavigate } from "@tanstack/react-router";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import ErrorState from "./UI/ErrorState";
import Button from "./UI/Button";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorState
      icon={MagnifyingGlassIcon}
      title="Page not found"
      description="We couldn't find the page you're looking for. It may have been moved or deleted."
      actions={
        <Button variant="primary" onClick={() => void navigate({ to: "/" })}>
          Back to talent database
        </Button>
      }
    />
  );
}

export default NotFoundPage;

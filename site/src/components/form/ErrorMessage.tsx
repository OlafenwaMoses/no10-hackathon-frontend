type Props = { id: string; message?: string };

export const ErrorMessage = ({ id, message }: Props) =>
  message ? (
    <p id={`${id}-error`} class="govuk-error-message">
      <span class="govuk-visually-hidden">Error:</span> {message}
    </p>
  ) : null;

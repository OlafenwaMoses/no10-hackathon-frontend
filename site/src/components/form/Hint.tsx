type Props = { id: string; hint?: string };

export const Hint = ({ id, hint }: Props) =>
  hint ? (
    <div id={`${id}-hint`} class="govuk-hint">
      {hint}
    </div>
  ) : null;

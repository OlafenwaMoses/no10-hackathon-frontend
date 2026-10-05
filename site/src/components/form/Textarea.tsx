import { describedBy } from "./describedBy";
import { ErrorMessage } from "./ErrorMessage";
import { Hint } from "./Hint";

type Props = { name: string; label: string; value: string; error?: string; hint?: string };

export const Textarea = ({ name, label, value, error, hint }: Props) => (
  <div class={`govuk-form-group${error ? " govuk-form-group--error" : ""}`}>
    <label class="govuk-label govuk-label--s" for={name}>
      {label}
    </label>
    <Hint id={name} hint={hint} />
    <ErrorMessage id={name} message={error} />
    <textarea
      class={`govuk-textarea${error ? " govuk-textarea--error" : ""}`}
      id={name}
      name={name}
      rows={6}
      aria-describedby={describedBy(name, hint, error)}
    >
      {value}
    </textarea>
  </div>
);

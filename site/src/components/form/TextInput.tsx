import { describedBy } from "./describedBy";
import { ErrorMessage } from "./ErrorMessage";
import { Hint } from "./Hint";

type Props = {
  name: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  type?: "text" | "email" | "tel" | "url";
  autocomplete?: string;
  spellcheck?: boolean;
  widthClass?: string;
};

export const TextInput = ({ name, label, value, error, hint, type, autocomplete, spellcheck, widthClass }: Props) => (
  <div class={`govuk-form-group${error ? " govuk-form-group--error" : ""}`}>
    <label class="govuk-label govuk-label--s" for={name}>
      {label}
    </label>
    <Hint id={name} hint={hint} />
    <ErrorMessage id={name} message={error} />
    <input
      class={`govuk-input${widthClass ? ` ${widthClass}` : ""}${error ? " govuk-input--error" : ""}`}
      id={name}
      name={name}
      type={type ?? "text"}
      value={value}
      autocomplete={autocomplete}
      spellcheck={spellcheck}
      aria-describedby={describedBy(name, hint, error)}
    />
  </div>
);

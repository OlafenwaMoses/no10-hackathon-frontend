import { describedBy } from "./describedBy";
import { ErrorMessage } from "./ErrorMessage";
import { Hint } from "./Hint";

type Option = { value: string; label: string };

type Props = { name: string; label: string; value: string; options: readonly Option[]; error?: string; hint?: string };

export const Select = ({ name, label, value, options, error, hint }: Props) => (
  <div class={`govuk-form-group${error ? " govuk-form-group--error" : ""}`}>
    <label class="govuk-label govuk-label--s" for={name}>
      {label}
    </label>
    <Hint id={name} hint={hint} />
    <ErrorMessage id={name} message={error} />
    <select
      class={`govuk-select${error ? " govuk-select--error" : ""}`}
      id={name}
      name={name}
      aria-describedby={describedBy(name, hint, error)}
    >
      <option value="" selected={value === ""}>
        Choose an option
      </option>
      {options.map((option) => (
        <option value={option.value} selected={option.value === value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

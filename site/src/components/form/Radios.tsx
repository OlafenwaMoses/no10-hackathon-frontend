import { describedBy } from "./describedBy";
import { ErrorMessage } from "./ErrorMessage";
import { Hint } from "./Hint";

type Option = { value: string; label: string };

type Props = { name: string; legend: string; value: string; options: readonly Option[]; error?: string; hint?: string };

export const Radios = ({ name, legend, value, options, error, hint }: Props) => (
  <div class={`govuk-form-group${error ? " govuk-form-group--error" : ""}`}>
    <fieldset class="govuk-fieldset" aria-describedby={describedBy(name, hint, error)}>
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">{legend}</legend>
      <Hint id={name} hint={hint} />
      <ErrorMessage id={name} message={error} />
      <div class="govuk-radios govuk-radios--small" data-module="govuk-radios">
        {options.map((option, index) => {
          const id = index === 0 ? name : `${name}-${index + 1}`;
          return (
            <div class="govuk-radios__item">
              <input
                class="govuk-radios__input"
                id={id}
                name={name}
                type="radio"
                value={option.value}
                checked={option.value === value}
              />
              <label class="govuk-label govuk-radios__label" for={id}>
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  </div>
);

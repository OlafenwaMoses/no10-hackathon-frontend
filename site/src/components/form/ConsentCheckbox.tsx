import { ErrorMessage } from "./ErrorMessage";

type Props = { checked: boolean; error?: string };

export const ConsentCheckbox = ({ checked, error }: Props) => (
  <div class={`govuk-form-group${error ? " govuk-form-group--error" : ""}`}>
    <fieldset class="govuk-fieldset" aria-describedby={error ? "consent-error" : "consent-hint"}>
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">Consent</legend>
      <div id="consent-hint" class="govuk-hint">
        Read our{" "}
        <a class="govuk-link" href="/privacy">
          privacy notice
        </a>{" "}
        to find out how we use your details.
      </div>
      <ErrorMessage id="consent" message={error} />
      <div class="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="consent" name="consent" type="checkbox" value="yes" checked={checked} />
          <label class="govuk-label govuk-checkboxes__label" for="consent">
            I agree to the Global Talent Taskforce contacting me and storing these details
          </label>
        </div>
      </div>
    </fieldset>
  </div>
);

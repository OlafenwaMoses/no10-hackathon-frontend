import { SimplePage } from "../components/SimplePage";

export const AccessibilityPage = () => (
  <SimplePage title="Accessibility" heading="Accessibility statement" path="/accessibility">
    <p class="govuk-body">
      This prototype uses GOV.UK Frontend form components and works without JavaScript. You should be able to:
    </p>
    <ul class="govuk-list govuk-list--bullet">
      <li>zoom in up to 400% without the text spilling off the screen</li>
      <li>navigate the whole site using just a keyboard</li>
      <li>use the site with a screen reader</li>
    </ul>
    <h2 class="govuk-heading-m">Known limitations</h2>
    <p class="govuk-body">
      It has not been independently audited against WCAG 2.2. Guidance shown from GOV.UK depends on that source.
    </p>
    <h2 class="govuk-heading-m">Reporting problems</h2>
    <p class="govuk-body">
      If you find a problem, please{" "}
      <a class="gt-link" href="/get-in-touch">
        tell us
      </a>
      .
    </p>
  </SimplePage>
);

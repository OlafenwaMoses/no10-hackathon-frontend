import { SimplePage } from "../components/SimplePage";

export const PrivacyPage = () => (
  <SimplePage title="Privacy" heading="Privacy notice" path="/privacy">
    <div class="govuk-inset-text">
      This is a prototype notice. A live service would publish a full notice reviewed by the data controller.
    </div>
    <h2 class="govuk-heading-m">What we collect</h2>
    <p class="govuk-body">
      The details you enter in the get in touch form: your name and email address, and anything optional you choose to
      add.
    </p>
    <h2 class="govuk-heading-m">How we use it</h2>
    <p class="govuk-body">
      Your details go to the Global Talent Taskforce's talent database so the Taskforce can contact you. We only collect
      them if you give consent.
    </p>
    <h2 class="govuk-heading-m">Cookies</h2>
    <p class="govuk-body">
      We do not set cookies or use analytics. Questions you type into the assistant are sent to Sierra, which provides it, so it can answer them.
    </p>
    <h2 class="govuk-heading-m">Your rights</h2>
    <p class="govuk-body">
      You can ask to see, correct or delete your information, or withdraw consent, at any time. Read about{" "}
      <a class="gt-link" href="https://ico.org.uk/for-the-public/">
        your data protection rights
      </a>
      .
    </p>
  </SimplePage>
);

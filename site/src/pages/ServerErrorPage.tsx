import { SimplePage } from "../components/SimplePage";

type Props = { path: string; heading?: string; message?: string };

export const ServerErrorPage = ({ path, heading, message }: Props) => (
  <SimplePage
    title="Sorry, there is a problem"
    heading={heading ?? "Sorry, there is a problem with the service"}
    path={path}
    lead={message ?? "Try again later."}
  >
    <p class="govuk-body">
      Go to the{" "}
      <a class="gt-link" href="/">
        home page
      </a>{" "}
      or visit{" "}
      <a class="gt-link" href="https://www.gov.uk/browse/visas-immigration">
        visas and immigration on GOV.UK
      </a>
      .
    </p>
  </SimplePage>
);

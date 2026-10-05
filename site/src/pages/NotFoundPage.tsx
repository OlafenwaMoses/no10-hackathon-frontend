import { SimplePage } from "../components/SimplePage";

type Props = { path: string };

export const NotFoundPage = ({ path }: Props) => (
  <SimplePage title="Page not found" path={path} lead="Check the web address is correct.">
    <p class="govuk-body">
      Go to the{" "}
      <a class="gt-link" href="/">
        home page
      </a>{" "}
      or{" "}
      <a class="gt-link" href="/get-in-touch">
        get in touch
      </a>
      .
    </p>
  </SimplePage>
);

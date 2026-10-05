import { ErrorSummary } from "../components/form/ErrorSummary";
import { PageHeader } from "../components/PageHeader";
import { FIELDS, type FieldErrors, type FormValues } from "../contact/fields";
import { Layout } from "../layout/Layout";
import { ContactForm } from "./contact/ContactForm";
import { NextSteps } from "./contact/NextSteps";
import { SubmitError } from "./contact/SubmitError";

type Props = { values: FormValues; errors: FieldErrors; submitError?: boolean };

export const ContactPage = ({ values, errors, submitError }: Props) => {
  const errorItems = FIELDS.flatMap((field) => {
    const text = errors[field];
    return text ? [{ href: `#${field}`, text }] : [];
  });
  const hasErrors = errorItems.length > 0 || submitError;

  return (
    <Layout title={hasErrors ? "Error: Get in touch" : "Get in touch"} path="/get-in-touch">
      <PageHeader
        title="Get in touch"
        lead="Tell us about your plans. A member of the Global Talent Taskforce will reply."
        crumbs={[]}
      />
      <div class="gt-container gt-contact-page">
        <div class="gt-contact-page__form">
          {submitError ? <SubmitError /> : null}
          {errorItems.length > 0 ? <ErrorSummary items={errorItems} /> : null}
          <ContactForm values={values} errors={errors} />
        </div>
        <NextSteps />
      </div>
    </Layout>
  );
};

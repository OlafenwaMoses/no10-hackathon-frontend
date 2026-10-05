import { ConsentCheckbox } from "../../components/form/ConsentCheckbox";
import { Honeypot } from "../../components/form/Honeypot";
import { Radios } from "../../components/form/Radios";
import { Select } from "../../components/form/Select";
import { Textarea } from "../../components/form/Textarea";
import { TextInput } from "../../components/form/TextInput";
import type { FieldErrors, FormValues } from "../../contact/fields";
import { CATEGORIES, INTENTS, SECTORS, TIMELINES } from "../../contact/options";

type Props = { values: FormValues; errors: FieldErrors };

const asOptions = (list: readonly string[]) => list.map((item) => ({ value: item, label: item }));

export const ContactForm = ({ values, errors }: Props) => (
  <form method="post" action="/get-in-touch" novalidate class="gt-form">
    <fieldset class="gt-form__group">
      <legend class="gt-form__legend">About you</legend>
      <TextInput name="name" label="Full name" value={values.name} error={errors.name} autocomplete="name" spellcheck={false} />
      <TextInput name="email" label="Email address" type="email" value={values.email} error={errors.email} autocomplete="email" spellcheck={false} />
      <div class="gt-form__row">
        <TextInput name="phone" label="Phone with country code (optional)" type="tel" value={values.phone} error={errors.phone} autocomplete="tel" />
        <TextInput name="country" label="Country you live in (optional)" value={values.country} error={errors.country} autocomplete="country-name" />
      </div>
      <div class="gt-form__row">
        <TextInput name="organisation" label="Organisation (optional)" value={values.organisation} error={errors.organisation} autocomplete="organization" />
        <TextInput name="role" label="Role (optional)" value={values.role} error={errors.role} autocomplete="organization-title" />
      </div>
      <TextInput name="profileUrl" label="LinkedIn or website (optional)" type="url" value={values.profileUrl} error={errors.profileUrl} autocomplete="url" spellcheck={false} />
    </fieldset>
    <fieldset class="gt-form__group">
      <legend class="gt-form__legend">Your plans</legend>
      <Radios name="category" legend="What best describes you? (optional)" value={values.category} options={asOptions(CATEGORIES)} error={errors.category} />
      <Select name="sector" label="Sector (optional)" value={values.sector} options={asOptions(SECTORS)} error={errors.sector} />
      <Radios name="intent" legend="What are you looking to do? (optional)" value={values.intent} options={INTENTS} error={errors.intent} />
      <Select name="timeline" label="When might you move? (optional)" value={values.timeline} options={asOptions(TIMELINES)} error={errors.timeline} />
      <Textarea name="message" label="Message (optional)" hint="Please do not include sensitive personal information." value={values.message} error={errors.message} />
    </fieldset>
    <div class="gt-consent">
      <ConsentCheckbox checked={values.consent === "yes"} error={errors.consent} />
    </div>
    <Honeypot />
    <button type="submit" class="govuk-button" data-module="govuk-button">
      Send
    </button>
  </form>
);

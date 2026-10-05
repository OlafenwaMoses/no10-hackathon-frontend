type Item = { href: string; text: string };

type Props = { items: Item[] };

export const ErrorSummary = ({ items }: Props) => (
  <div class="govuk-error-summary" data-module="govuk-error-summary">
    <div role="alert">
      <h2 class="govuk-error-summary__title">There is a problem</h2>
      <div class="govuk-error-summary__body">
        <ul class="govuk-list govuk-error-summary__list">
          {items.map((item) => (
            <li>
              <a href={item.href}>{item.text}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

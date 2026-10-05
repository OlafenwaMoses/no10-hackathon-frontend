import { ArrowLink } from "../../components/ArrowLink";
import { VISA_ROUTES } from "../../content/visa-routes";

export const VisaComparison = () => (
  <ul class="gt-visas">
    {VISA_ROUTES.map((route) => (
      <li class="gt-visa" id={route.id}>
        <div class="gt-visa__head">
          <h2 class="gt-visa__name">{route.name}</h2>
          {route.internalHref ? <span class="gt-tag">Full guide</span> : null}
        </div>
        <p class="gt-visa__suits">{route.suits}</p>
        <dl class="gt-visa__facts">
          <div>
            <dt>Job offer</dt>
            <dd>{route.jobOffer}</dd>
          </div>
          <div>
            <dt>Endorsement</dt>
            <dd>{route.endorsement}</dd>
          </div>
        </dl>
        <ArrowLink
          href={route.internalHref ?? route.href}
          text={route.internalHref ? "Read the guide" : "Read on GOV.UK"}
          context={`for the ${route.name} visa`}
        />
      </li>
    ))}
  </ul>
);

import { HONEYPOT_FIELD } from "../../contact/fields";

export const Honeypot = () => (
  <div class="gt-honeypot" aria-hidden="true">
    <label for={HONEYPOT_FIELD}>Leave this field empty</label>
    <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabindex={-1} autocomplete="off" value="" />
  </div>
);

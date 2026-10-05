const STEPS = [
  { title: "We read your details", text: "A member of the Taskforce reviews what you send." },
  { title: "We get in touch", text: "Usually by email within a few working days." },
  { title: "We help you plan", text: "Routes, introductions and a smooth landing." },
] as const;

export const NextSteps = () => (
  <aside class="gt-steps" aria-labelledby="steps-title">
    <h2 class="gt-steps__title" id="steps-title">
      What happens next
    </h2>
    <ol class="gt-steps__list">
      {STEPS.map((step) => (
        <li class="gt-steps__item">
          <p class="gt-steps__name">{step.title}</p>
          <p class="gt-steps__text">{step.text}</p>
        </li>
      ))}
    </ol>
    <p class="gt-steps__privacy">
      Only your name, email and consent are required. See our{" "}
      <a class="gt-link" href="/privacy">
        privacy notice
      </a>
      .
    </p>
  </aside>
);

const NOTES = [
  {
    id: "visiting",
    title: "Visiting for business",
    text: "Meetings, conferences and deal-making need only a Standard Visitor visa or an ETA, depending on nationality.",
    link: { href: "https://www.gov.uk/standard-visitor", text: "Standard Visitor visa" },
  },
  {
    id: "family",
    title: "Bringing your family",
    text: "On most routes your partner and children under 18 can join you. Each pays the fee and health surcharge.",
    link: { href: "/schools-and-family", text: "Schools and family" },
  },
  {
    id: "settlement",
    title: "Staying long term",
    text: "Many routes lead to settlement and later citizenship. Timelines depend on your route.",
    link: { href: "https://www.gov.uk/settle-in-the-uk", text: "Settle in the UK" },
  },
] as const;

export const VisaNotes = () => (
  <ul class="gt-notes">
    {NOTES.map((note) => (
      <li class="gt-note" id={note.id}>
        <h2 class="gt-note__title">{note.title}</h2>
        <p class="gt-note__text">{note.text}</p>
        <a class="gt-link gt-note__link" href={note.link.href}>
          {note.link.text}
        </a>
      </li>
    ))}
  </ul>
);

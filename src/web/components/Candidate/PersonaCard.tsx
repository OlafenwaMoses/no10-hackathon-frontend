import styled from "@emotion/styled";
import { useState } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import type { PersonaAttributes } from "@api-types";
import { Eyebrow, SectionBody, SectionCard, SectionHead } from "../UI/PageStyles";
import { P } from "../../lib/utilityComponents";
import { SPRING3 } from "../../lib/springs";

const DETAIL_FIELDS = [
  ["motivation", "Motivation"],
  ["attitudes", "Attitudes"],
  ["personality", "Personality"],
  ["demeanour", "Demeanour"],
  ["behaviours", "Behaviours"],
  ["interests", "Interests"],
] as const;

function PersonaCard({ persona }: { persona: PersonaAttributes }) {
  const [expanded, setExpanded] = useState(false);
  const facts = [
    persona.generation,
    persona.culturalBackground,
    [persona.currentCity, persona.currentCountry].filter(Boolean).join(", "),
    persona.languages.length > 0 ? persona.languages.join(", ") : null,
  ].filter(Boolean);

  return (
    <SectionCard>
      <SectionHead>
        AI persona
        <Toggle type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
          {expanded ? "Show less" : "Show more"}
          <Caret data-open={expanded || undefined}>
            <CaretDownIcon size={12} />
          </Caret>
        </Toggle>
      </SectionHead>
      <SectionBody>
        {facts.length > 0 && (
          <Facts>
            {facts.map((fact) => (
              <Fact key={fact}>{fact}</Fact>
            ))}
          </Facts>
        )}
        <Field>
          <Eyebrow>Biography</Eyebrow>
          <Clamp data-clamped={!expanded || undefined}>
            <P size="sm" textSecondary>
              {persona.biography}
            </P>
          </Clamp>
        </Field>
        <AnimatePresence initial={false}>
          {expanded && (
            <Details
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={SPRING3 as Transition}
            >
              <DetailsInner>
                {DETAIL_FIELDS.filter(([key]) => persona[key]).map(([key, label]) => (
                  <Field key={key}>
                    <Eyebrow>{label}</Eyebrow>
                    <P size="sm" textSecondary>
                      {persona[key]}
                    </P>
                  </Field>
                ))}
              </DetailsInner>
            </Details>
          )}
        </AnimatePresence>
      </SectionBody>
    </SectionCard>
  );
}

export default PersonaCard;

const Toggle = styled.button(({ theme }) => ({
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 12,
  fontWeight: 400,
  color: theme.textTertiary,
  cursor: "pointer",
  transition: "color 200ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { color: theme.textPrimary },
  },
  "&:focus-visible": { boxShadow: theme.focusRing, borderRadius: 4 },
}));

const Caret = styled.span({
  display: "inline-flex",
  transition: "transform 0.2s var(--ease-out-quart)",
  "&[data-open]": { transform: "rotate(180deg)" },
});

const Facts = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
});

const Fact = styled.span(({ theme }) => ({
  padding: "3px 8px",
  borderRadius: 4,
  fontSize: 12,
  color: theme.textSecondary,
  backgroundColor: theme.surface200,
}));

const Field = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

const Clamp = styled.div({
  "&[data-clamped] p": {
    display: "-webkit-box",
    WebkitLineClamp: 5,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
});

const Details = styled(motion.div)({
  overflow: "hidden",
});

const DetailsInner = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 14,
});

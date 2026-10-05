import styled from "@emotion/styled";
import ModalShell from "../UI/ModalShell";
import Loader from "../UI/Loader";
import ContactRow from "./ContactRow";
import ContactLookup from "./ContactLookup";
import OutreachForm from "./OutreachForm";
import { Eyebrow } from "../UI/PageStyles";
import { P } from "../../lib/utilityComponents";
import contactRoutes from "../../lib/contactRoutes";
import useCandidate from "../../hooks/useCandidate";

function ReachOutModal({ candidateId }: { candidateId: string }) {
  const { candidate } = useCandidate(candidateId);

  if (!candidate) {
    return (
      <ModalShell title="Reach out" width={560}>
        <Centered>
          <Loader size={20} />
        </Centered>
      </ModalShell>
    );
  }

  const routes = contactRoutes(candidate.profileUrl, candidate.contact);

  return (
    <ModalShell title={`Reach out to ${candidate.name}`} width={560}>
      <P textSecondary size="sm">
        Every contact route we have for them. Log the outcome below so the rest of the Taskforce can see where things
        stand.
      </P>
      <Sections>
        <Section>
          <Eyebrow>Contact routes</Eyebrow>
          {routes.length > 0 ? (
            <Routes>
              {routes.map((route) => (
                <ContactRow
                  key={route.key}
                  icon={route.icon}
                  label={route.label}
                  value={route.value}
                  href={route.href}
                  external={route.external}
                />
              ))}
            </Routes>
          ) : (
            <P textTertiary size="sm">
              No contact routes yet.
            </P>
          )}
          <ContactLookup candidateId={candidate.id} contact={candidate.contact} />
        </Section>
        <Section>
          <Eyebrow>Outreach</Eyebrow>
          <OutreachForm candidate={candidate} />
        </Section>
      </Sections>
    </ModalShell>
  );
}

export default ReachOutModal;

const Centered = styled.div({
  display: "flex",
  justifyContent: "center",
  padding: "40px 0",
});

const Sections = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 24,
  marginTop: 18,
});

const Section = styled.section({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

const Routes = styled.ul(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  margin: 0,
  listStyle: "none",
  borderRadius: 8,
  border: `1px solid ${theme.border100}`,
  backgroundColor: theme.surface00,
}));

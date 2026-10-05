import styled from "@emotion/styled";
import { ArrowSquareOutIcon, BankIcon, CheckCircleIcon, MapPinIcon } from "@phosphor-icons/react";
import type { UkLinks } from "@api-types";
import VerdictPill from "../VerdictPill";
import { Eyebrow, SectionBody, SectionCard, SectionHead } from "../UI/PageStyles";
import { UK_LINK_TYPE_LABELS } from "../../lib/labels";
import { P } from "../../lib/utilityComponents";

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function UkLinksCard({ ukLinks }: { ukLinks: UkLinks }) {
  return (
    <SectionCard>
      <SectionHead>
        UK links
        <VerdictPill verdict={ukLinks.verdict} />
      </SectionHead>
      <SectionBody>
        {ukLinks.currentCountry && (
          <Location>
            <MapPinIcon size={14} />
            Currently based in {ukLinks.currentCountry}
          </Location>
        )}
        {ukLinks.links.length > 0 ? (
          <LinkList>
            {ukLinks.links.map((link, index) => (
              <LinkItem key={`${link.type}-${index}`}>
                <CheckCircleIcon size={16} weight="fill" />
                <div>
                  <LinkType>{UK_LINK_TYPE_LABELS[link.type] ?? link.type}</LinkType>
                  <LinkDetail>{link.detail}</LinkDetail>
                </div>
              </LinkItem>
            ))}
          </LinkList>
        ) : (
          <P size="sm" textTertiary>
            No specific UK connections found.
          </P>
        )}
        {ukLinks.ukGovernmentLinks && (
          <Gov>
            <BankIcon size={16} />
            <div>
              <Eyebrow>UK Government links</Eyebrow>
              <P size="sm" textSecondary>
                {ukLinks.ukGovernmentLinks}
              </P>
            </div>
          </Gov>
        )}
        {ukLinks.evidence && (
          <Block>
            <Eyebrow>Evidence</Eyebrow>
            <P size="sm" textSecondary>
              {ukLinks.evidence}
            </P>
          </Block>
        )}
        {ukLinks.citations.length > 0 && (
          <Block>
            <Eyebrow>Sources</Eyebrow>
            <Citations>
              {ukLinks.citations.map((citation) => (
                <Citation key={citation.url} href={citation.url} target="_blank" rel="noreferrer">
                  <CitationTitle>{citation.title || hostname(citation.url)}</CitationTitle>
                  <CitationHost>{hostname(citation.url)}</CitationHost>
                  <ArrowSquareOutIcon size={12} />
                </Citation>
              ))}
            </Citations>
          </Block>
        )}
      </SectionBody>
    </SectionCard>
  );
}

export default UkLinksCard;

const Location = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  color: theme.textSecondary,
}));

const LinkList = styled.ul({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  padding: 0,
  listStyle: "none",
});

const LinkItem = styled.li(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  "& > svg": { flexShrink: 0, marginTop: 1, color: theme.successFg },
}));

const LinkType = styled.div(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  color: theme.textPrimary,
}));

const LinkDetail = styled.div(({ theme }) => ({
  fontSize: 12,
  lineHeight: 1.5,
  color: theme.textSecondary,
}));

const Gov = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 4,
  backgroundColor: theme.approvalBg,
  "& > svg": { flexShrink: 0, marginTop: 2, color: theme.approvalFg },
}));

const Block = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

const Citations = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 2,
  marginTop: 2,
});

const Citation = styled.a(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 0,
  padding: "5px 8px",
  margin: "0 -8px",
  borderRadius: 4,
  fontSize: 12,
  color: theme.textSecondary,
  textDecoration: "none",
  transition: "background-color 200ms ease, color 200ms ease",
  "& svg": { flexShrink: 0, color: theme.textTertiary },
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { backgroundColor: theme.transparentHover, color: theme.textPrimary },
  },
}));

const CitationTitle = styled.span({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const CitationHost = styled.span(({ theme }) => ({
  flexShrink: 0,
  color: theme.textTertiary,
}));

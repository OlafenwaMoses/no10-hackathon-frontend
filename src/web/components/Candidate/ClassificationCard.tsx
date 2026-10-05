import styled from "@emotion/styled";
import type { Classification } from "@api-types";
import CategoryTag from "../CategoryTag";
import SectorTag from "../SectorTag";
import { Eyebrow, SectionBody, SectionCard, SectionHead } from "../UI/PageStyles";
import { GTT_CRITERIA_LABELS, RESIDENCE_REGION_LABELS } from "../../lib/labels";
import { P } from "../../lib/utilityComponents";

function ClassificationCard({ classification }: { classification: Classification }) {
  const rows = [
    { label: "Type of Individual", value: <CategoryTag category={classification.category} /> },
    { label: "GTT Priority Sector", value: <SectorTag sector={classification.sector} /> },
    { label: "Sub-sector", value: classification.subSector || null },
    { label: "Criteria", value: GTT_CRITERIA_LABELS[classification.criteria] },
    { label: "Current residence", value: RESIDENCE_REGION_LABELS[classification.residenceRegion] },
    { label: "Nationality", value: classification.nationality },
  ];

  return (
    <SectionCard>
      <SectionHead>GTT classification</SectionHead>
      <SectionBody>
        <Rows>
          {rows.map((row) => (
            <Row key={row.label}>
              <Term>{row.label}</Term>
              <Value>{row.value ?? <Blank>Unknown</Blank>}</Value>
            </Row>
          ))}
        </Rows>
        {classification.rationale && (
          <Rationale>
            <Eyebrow>Rationale</Eyebrow>
            <P size="sm" textSecondary>
              {classification.rationale}
            </P>
          </Rationale>
        )}
      </SectionBody>
    </SectionCard>
  );
}

export default ClassificationCard;

const Rows = styled.dl({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  margin: 0,
});

const Row = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  minHeight: 22,
});

const Term = styled.dt(({ theme }) => ({
  flexShrink: 0,
  fontSize: 12,
  color: theme.textTertiary,
}));

const Value = styled.dd(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  minWidth: 0,
  margin: 0,
  fontSize: 13,
  textAlign: "right",
  color: theme.textPrimary,
}));

const Blank = styled.span(({ theme }) => ({
  color: theme.textDisabled,
}));

const Rationale = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

import styled from "@emotion/styled";
import type { NetWorth, NetWorthBand } from "@api-types";
import Tooltip from "./UI/Tooltip";
import { Blank } from "./UI/TableStyles";
import { NET_WORTH_BAND_LABELS } from "../lib/labels";
import formatUsd from "../lib/formatUsd";

type NetWorthCellProps = {
  band: NetWorthBand | null;
  estimateUsd: number | null;
  confidence: NetWorth["confidence"] | null;
};

function NetWorthCell({ band, estimateUsd, confidence }: NetWorthCellProps) {
  if (!band) return <Blank>—</Blank>;
  if (band === "unknown") return <Muted>Unknown</Muted>;

  return (
    <Tooltip
      openDelay={200}
      content={
        `${estimateUsd != null ? `Estimated at around ${formatUsd(estimateUsd)}` : "Estimated band"} from public sources${confidence ? ` · ${confidence} confidence` : ""}. Open the profile for the basis.`
      }
    >
      <Value>
        {NET_WORTH_BAND_LABELS[band]}
        <Muted>est.</Muted>
      </Value>
    </Tooltip>
  );
}

export default NetWorthCell;

const Value = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "baseline",
  gap: 5,
  color: theme.textSecondary,
  fontVariantNumeric: "tabular-nums",
}));

const Muted = styled.span(({ theme }) => ({
  fontSize: 12,
  color: theme.textTertiary,
}));

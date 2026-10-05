import styled from "@emotion/styled";
import { motion, type Transition } from "motion/react";
import TruncatedText from "../UI/TruncatedText";
import { SPRING3 } from "../../lib/springs";

type DistributionBarsProps = {
  options: string[];
  shares: number[];
};

function DistributionBars({ options, shares }: DistributionBarsProps) {
  const top = shares.indexOf(Math.max(...shares));

  return (
    <List>
      {options.map((option, index) => {
        const share = shares[index] ?? 0;
        return (
          <Row key={`${option}-${index}`} data-top={index === top || undefined}>
            <OptionLabel text={option} />
            <Track>
              <Fill
                style={{ width: `${share * 100}%` }}
                initial={{ transform: "scaleX(0)" }}
                animate={{ transform: "scaleX(1)" }}
                transition={{ ...(SPRING3 as Transition), delay: index * 0.03 }}
              />
            </Track>
            <Share>{Math.round(share * 100)}%</Share>
          </Row>
        );
      })}
    </List>
  );
}

export default DistributionBars;

const List = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 6,
});

const Row = styled.div(({ theme }) => ({
  "--bar": `color-mix(in oklch, ${theme.highlight} 60%, transparent)`,
  display: "grid",
  gridTemplateColumns: "minmax(0, 220px) minmax(0, 1fr) 40px",
  alignItems: "center",
  gap: 12,
  fontSize: 12,
  color: theme.textSecondary,
  "&[data-top]": {
    "--bar": theme.highlightStrong,
    color: theme.textPrimary,
    fontWeight: 500,
  },
}));

const OptionLabel = styled(TruncatedText)({
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const Track = styled.div(({ theme }) => ({
  height: 8,
  borderRadius: 2,
  overflow: "hidden",
  backgroundColor: theme.surface200,
}));

const Fill = styled(motion.div)({
  height: "100%",
  borderRadius: 2,
  minWidth: 2,
  transformOrigin: "left center",
  backgroundColor: "var(--bar)",
});

const Share = styled.span({
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
});

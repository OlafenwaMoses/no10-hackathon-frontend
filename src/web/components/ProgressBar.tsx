import styled from "@emotion/styled";

type ProgressBarProps = {
  value: number;
  max: number;
  active?: boolean;
  width?: number | string;
};

function ProgressBar({ value, max, active, width = "100%" }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <Track style={{ width }} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <Fill style={{ width: `${percent}%` }} data-active={active || undefined} />
    </Track>
  );
}

export default ProgressBar;

const Track = styled.div(({ theme }) => ({
  position: "relative",
  height: 4,
  borderRadius: 2,
  overflow: "hidden",
  backgroundColor: theme.surface300,
}));

const Fill = styled.div(({ theme }) => ({
  height: "100%",
  borderRadius: 2,
  backgroundColor: theme.successFg,
  transition: "width 0.4s var(--ease-out-quart)",
  "&[data-active]": {
    backgroundColor: theme.highlightStrong,
  },
}));

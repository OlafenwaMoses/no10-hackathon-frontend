import styled from "@emotion/styled";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { P } from "../lib/utilityComponents";

type EmptyStateProps = {
  icon: PhosphorIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
};

function EmptyState({ icon: IconComponent, title, description, action }: EmptyStateProps) {
  return (
    <Wrapper>
      <IconRing>
        <IconComponent size={22} />
      </IconRing>
      <P bold size="lg" funnel center>
        {title}
      </P>
      <P textSecondary center maxWidth={400}>
        {description}
      </P>
      {action && <Action>{action}</Action>}
    </Wrapper>
  );
}

export default EmptyState;

const Wrapper = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  padding: "64px 24px",
  border: `1px dashed ${theme.border200}`,
  borderRadius: 8,
  backgroundColor: theme.surface50,
}));

const IconRing = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  marginBottom: 10,
  borderRadius: "50%",
  backgroundColor: theme.surface200,
  border: `1px solid ${theme.border100}`,
  color: theme.textTertiary,
}));

const Action = styled.div({
  marginTop: 16,
});

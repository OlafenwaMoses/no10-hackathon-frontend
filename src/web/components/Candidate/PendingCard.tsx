import styled from "@emotion/styled";
import { SectionCard, SectionHead } from "../UI/PageStyles";
import Skeleton from "../UI/Skeleton";

type PendingCardProps = {
  title: string;
  message: string;
  animate: boolean;
};

function PendingCard({ title, message, animate }: PendingCardProps) {
  return (
    <SectionCard>
      <SectionHead>{title}</SectionHead>
      <Body>
        {animate && (
          <Lines>
            <Skeleton width="60%" height={10} />
            <Skeleton width="85%" height={10} />
          </Lines>
        )}
        <Message>{message}</Message>
      </Body>
    </SectionCard>
  );
}

export default PendingCard;

const Body = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: 16,
});

const Lines = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

const Message = styled.span(({ theme }) => ({
  fontSize: 12,
  color: theme.textTertiary,
}));

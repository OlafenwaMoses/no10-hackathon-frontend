import styled from "@emotion/styled";
import { motion, useReducedMotion, type Transition } from "motion/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { P, Spacer, Flex } from "../../lib/utilityComponents";
import { SPRING3 } from "../../lib/springs";
import Icon from "./Icon";

type ErrorStateProps = {
  icon: PhosphorIcon;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  detail?: string;
};

function ErrorState({ icon, title, description, actions, detail }: ErrorStateProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Outer>
      <Card
        variants={cardVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        transition={SPRING3 as Transition}
      >
        <IconRing variants={iconVariants} transition={SPRING3 as Transition}>
          <Icon icon={icon} size={22} />
        </IconRing>
        <Spacer height={18} />
        <Item variants={itemVariants} transition={SPRING3 as Transition}>
          <Title bold size="lg" funnel center>
            {title}
          </Title>
        </Item>
        {description && (
          <>
            <Spacer height={6} />
            <Item variants={itemVariants} transition={SPRING3 as Transition}>
              <Description textSecondary center maxWidth={360}>
                {description}
              </Description>
            </Item>
          </>
        )}
        {actions && (
          <>
            <Spacer height={24} />
            <Item variants={itemVariants} transition={SPRING3 as Transition}>
              <Flex gap={8} justifyContent="center" flexWrap="wrap">
                {actions}
              </Flex>
            </Item>
          </>
        )}
        {detail && (
          <>
            <Spacer height={24} />
            <Item
              variants={itemVariants}
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              transition={SPRING3 as Transition}
            >
              <Detail size="sm" textTertiary>
                {detail}
              </Detail>
            </Item>
          </>
        )}
      </Card>
    </Outer>
  );
}

export default ErrorState;

const cardVariants = {
  hidden: { opacity: 0, transform: "translateY(8px)" },
  visible: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
};

const iconVariants = {
  hidden: { opacity: 0, transform: "scale(0.92)" },
  visible: { opacity: 1, transform: "scale(1)" },
};

const itemVariants = {
  hidden: { opacity: 0, transform: "translateY(6px)" },
  visible: { opacity: 1, transform: "translateY(0px)" },
};

const Outer = styled.div(({ theme }) => ({
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 32,
  overflow: "hidden",
  backgroundColor: theme.surface100,
}));

const Card = styled(motion.div)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: 420,
  padding: "40px 32px",
  borderRadius: 8,
  border: `1px solid ${theme.border100}`,
  backgroundColor: theme.surface00 + "f2",
  backdropFilter: "blur(12px)",
  boxShadow: `0 1px 2px ${theme.transparentHover}, 0 16px 40px ${theme.transparentActive}`,
}));

const IconRing = styled(motion.div)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: "50%",
  backgroundColor: theme.surface200,
  border: `1px solid ${theme.border100}`,
  color: theme.textTertiary,
}));

const Item = styled(motion.div)({
  width: "100%",
});

const Title = styled(P)({
  textWrap: "balance",
});

const Description = styled(P)({
  textWrap: "pretty",
});

const Detail = styled(P)(({ theme }) => ({
  paddingTop: 16,
  borderTop: `1px solid ${theme.border100}`,
  fontFamily: "monospace",
  overflowWrap: "break-word",
}));

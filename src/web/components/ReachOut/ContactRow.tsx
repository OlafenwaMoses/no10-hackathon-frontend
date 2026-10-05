import styled from "@emotion/styled";
import { toast } from "sonner";
import { ArrowSquareOutIcon, CopyIcon, type Icon as PhosphorIcon } from "@phosphor-icons/react";
import Icon from "../UI/Icon";
import IconButton from "../UI/IconButton";
import Tooltip from "../UI/Tooltip";

type ContactRowProps = {
  icon: PhosphorIcon;
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

function ContactRow({ icon, label, value, href, external }: ContactRowProps) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(external ? href : value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Couldn't copy to the clipboard");
    }
  };

  return (
    <Row>
      <IconWrap>
        <Icon icon={icon} size={16} />
      </IconWrap>
      <Text>
        <Label>{label}</Label>
        <Value href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
          {value}
        </Value>
      </Text>
      <Actions>
        <IconButton icon={CopyIcon} size="sm" secondary tooltip={`Copy ${label.toLowerCase()}`} onClick={() => void copy()} />
        <Tooltip content={external ? "Open in a new tab" : `Open in your ${label === "Phone" ? "dialler" : "mail app"}`} openDelay={500}>
          <OpenLink
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            aria-label={`Open ${label.toLowerCase()}`}
          >
            <ArrowSquareOutIcon size={16} />
          </OpenLink>
        </Tooltip>
      </Actions>
    </Row>
  );
}

export default ContactRow;

const Row = styled.li(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 12px",
  borderBottom: `1px solid ${theme.borderFaint}`,
  "&:last-of-type": { borderBottom: "none" },
}));

const IconWrap = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 32,
  height: 32,
  borderRadius: 4,
  color: theme.textSecondary,
  backgroundColor: theme.surface200,
}));

const Text = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 2,
  flex: 1,
  minWidth: 0,
});

const Label = styled.span(({ theme }) => ({
  fontSize: 11,
  color: theme.textTertiary,
}));

const Value = styled.a(({ theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 13,
  fontWeight: 500,
  color: theme.textPrimary,
  textDecoration: "none",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: theme.border200 },
  },
}));

const Actions = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 2,
  flexShrink: 0,
});

const OpenLink = styled.a(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 8,
  borderRadius: 4,
  color: theme.textSecondary,
  transition: "background-color 200ms ease, color 200ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { backgroundColor: theme.transparentHover, color: theme.textPrimary },
  },
  "&:focus-visible": { boxShadow: theme.focusRing, outline: "none" },
}));

import styled from "@emotion/styled";
import { useLocation } from "@tanstack/react-router";
import { MagnifyingGlassIcon, UsersThreeIcon } from "@phosphor-icons/react";
import Tooltip from "../UI/Tooltip";
import NavCollapseToggle from "./NavCollapseToggle";
import { Footer, IconSlot, Items, LogoLink, NavRow, Rail, RowLabel, SwitcherSlot, TopSlot } from "./navChrome";
import useNavRail from "../../hooks/useNavRail";
import LogoIcon from "../../assets/logo.svg?react";

const NAV_ITEMS = [
  { to: "/", label: "Talent database", icon: UsersThreeIcon, prefix: "/candidates" },
  { to: "/searches", label: "Searches", icon: MagnifyingGlassIcon, prefix: "/searches" },
] as const;

function AppNav() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const { collapsed, forced, toggleCollapsed, railProps } = useNavRail();

  return (
    <Rail {...railProps}>
      <TopSlot>
        <LogoLink to="/" aria-label="Global Talent Radar">
          <LogoIcon width={20} height={20} />
        </LogoLink>
        <SwitcherSlot>
          <Wordmark>Global Talent Radar</Wordmark>
        </SwitcherSlot>
      </TopSlot>
      <Items>
        {NAV_ITEMS.map((item) => (
          <Tooltip key={item.to} content={item.label} side="right" openDelay={0} disabled={!collapsed}>
            <NavRow
              to={item.to}
              activeOptions={{ exact: true, includeSearch: false }}
              data-current={pathname.startsWith(item.prefix) || undefined}
              aria-label={item.label}
            >
              <IconSlot>
                <item.icon size={20} />
              </IconSlot>
              <RowLabel>{item.label}</RowLabel>
            </NavRow>
          </Tooltip>
        ))}
      </Items>
      <Footer>
        {!forced && <NavCollapseToggle collapsed={collapsed} onToggle={toggleCollapsed} />}
        <SwitcherSlot>
          <Caption>Global Talent Taskforce</Caption>
        </SwitcherSlot>
      </Footer>
    </Rail>
  );
}

export default AppNav;

const Wordmark = styled.span(({ theme }) => ({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontFamily: theme.fontDisplay,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: theme.textPrimary,
}));


const Caption = styled.span(({ theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 11,
  color: theme.textTertiary,
}));

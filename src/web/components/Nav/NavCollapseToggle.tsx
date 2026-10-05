import Tooltip from "../UI/Tooltip";
import { IconSlot, RailAction } from "./navChrome";
import { SidebarSimpleIcon } from "@phosphor-icons/react";

type NavCollapseToggleProps = {
  collapsed: boolean;
  onToggle: () => void;
};

function NavCollapseToggle({ collapsed, onToggle }: NavCollapseToggleProps) {
  const label = collapsed ? "Expand sidebar" : "Collapse sidebar";

  return (
    <Tooltip content={label} side="right" openDelay={0}>
      <RailAction type="button" onClick={onToggle} aria-label={label} data-muted>
        <IconSlot>
          <SidebarSimpleIcon size={18} />
        </IconSlot>
      </RailAction>
    </Tooltip>
  );
}

export default NavCollapseToggle;

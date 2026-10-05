import type { Icon as PhosphorIcon, IconProps as PhosphorIconProps } from "@phosphor-icons/react";

type IconProps = {
  icon: PhosphorIcon;
} & PhosphorIconProps;

function Icon({ icon: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

export default Icon;

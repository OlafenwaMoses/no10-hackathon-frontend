import styled from "@emotion/styled";
import { useState } from "react";
import initials from "../lib/initials";

type AvatarProps = {
  name: string;
  src: string | null;
  size?: number;
};

function Avatar({ name, src, size = 32 }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = !!src && failedSrc !== src;

  return (
    <Circle style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}>
      {showImage ? (
        <Image src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailedSrc(src)} />
      ) : (
        initials(name)
      )}
    </Circle>
  );
}

export default Avatar;

const Circle = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  overflow: "hidden",
  borderRadius: "50%",
  backgroundColor: theme.avatarFill,
  color: theme.textSecondary,
  fontWeight: 500,
  letterSpacing: "0.02em",
  boxShadow: `inset 0 0 0 1px ${theme.transparentHover}`,
  userSelect: "none",
}));

const Image = styled.img({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

import { keyframes } from "@emotion/react";

export const fadeInAndSlideUp = keyframes`
  from {
    opacity: 0;
    transform: scale(0.6) translateY(5px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
`;

export const fadeInAndSlideDown = keyframes`
  from {
    opacity: 0;
    transform: scale(0.6) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
`;

export const fadeOutAndSlideDown = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
`;

export const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const popOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.97);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

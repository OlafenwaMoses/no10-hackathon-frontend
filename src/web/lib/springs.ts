export const SPRING2 = {
  type: "spring" as const,
  stiffness: 220,
  damping: 24,
  restDelta: 0.01,
  mass: 0.7,
};

export const SPRING3 = {
  type: "spring" as const,
  duration: 0.4,
  bounce: 0,
};

export const WINDOW_SETTLE = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
};

export const TRAY_SPRING = {
  type: "spring" as const,
  duration: 0.3,
  bounce: 0,
};

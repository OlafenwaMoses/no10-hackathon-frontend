const LAUNCHER = {
  text: "Ask a question",
  backgroundColor: "#1d5fd1",
  borderColor: "#1d5fd1",
  textColor: "#ffffff",
  hoverBackgroundColor: "#1747a6",
  hoverBorderColor: "#1747a6",
  hoverTextColor: "#ffffff",
};

export const SIERRA_CONFIG = `window.sierraConfig = ${JSON.stringify({ launcher: LAUNCHER })};`;

export const SIERRA_EMBED =
  '<script type="module" src="https://sierra.chat/agent/OTWYMj4BoQiXwxwBoQiXw6MAijEM2XJjGkjsw0KBcCA/embed"></script>';

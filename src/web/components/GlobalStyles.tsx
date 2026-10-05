import { Global, css, useTheme } from "@emotion/react";

function GlobalStyles() {
  const theme = useTheme();

  return (
    <Global
      styles={css({
        html: {
          colorScheme: theme.colorScheme,
        },
        "*": {
          scrollbarColor: `${theme.scrollbarThumb} ${theme.scrollbarTrack}`,
        },
        "::-webkit-scrollbar": {
          width: 12,
          height: 12,
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: theme.scrollbarTrack,
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: theme.scrollbarThumb,
          borderRadius: 8,
          border: `3px solid ${theme.scrollbarTrack}`,
        },
        "::-webkit-scrollbar-thumb:hover": {
          backgroundColor: theme.scrollbarThumbHover,
        },
      })}
    />
  );
}

export default GlobalStyles;

import "@emotion/react";
import type { Theme as ThemeType } from "./lib/themes";

declare module "@emotion/react" {
  export interface Theme extends ThemeType {}
}

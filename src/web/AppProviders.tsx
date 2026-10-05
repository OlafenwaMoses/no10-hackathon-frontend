import { ThemeProvider } from "@emotion/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, type AnyRouter } from "@tanstack/react-router";
import GlobalStyles from "./components/GlobalStyles";
import { lighterTheme } from "./lib/themes";
import { queryClient } from "./lib/queryClient";

type AppProvidersProps = {
  router: AnyRouter;
};

function AppProviders({ router }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lighterTheme}>
        <GlobalStyles />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;

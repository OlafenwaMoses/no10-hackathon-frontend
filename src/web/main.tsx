import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import AppProviders from "./AppProviders";
import NotFoundPage from "./components/NotFoundPage";
import ErrorPage from "./components/ErrorPage";

const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: "intent",
  defaultPreloadDelay: 50,
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ErrorPage,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

window.addEventListener("vite:preloadError", (event) => {
  const alreadyReloaded = sessionStorage.getItem("chunk-reload");
  if (alreadyReloaded) return;
  sessionStorage.setItem("chunk-reload", "1");
  event.preventDefault();
  window.location.reload();
});
window.addEventListener("load", () => {
  sessionStorage.removeItem("chunk-reload");
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders router={router} />
  </StrictMode>,
);

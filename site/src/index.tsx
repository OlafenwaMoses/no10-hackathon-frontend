import { Hono } from "hono";
import { TopicPage } from "./components/TopicPage";
import { HEALTHCARE } from "./content/pages/healthcare";
import { LIVING } from "./content/pages/living";
import { SCHOOLS } from "./content/pages/schools";
import { SUPPORT } from "./content/pages/support";
import { TAX } from "./content/pages/tax";
import type { AppEnv } from "./env";
import { AccessibilityPage } from "./pages/AccessibilityPage";
import { MovingPage } from "./pages/MovingPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { RegionsPage } from "./pages/RegionsPage";
import { ServerErrorPage } from "./pages/ServerErrorPage";
import { VisasPage } from "./pages/visas/VisasPage";
import { getConfirmation } from "./routes/contact/confirmation";
import { getContact } from "./routes/contact/get";
import { postContact } from "./routes/contact/post";
import { getGuide } from "./routes/guide";
import { getHome } from "./routes/home";
import { getPersona } from "./routes/persona";
import { refresh } from "./routes/refresh";
import { scheduled } from "./scraper/scheduled";

const app = new Hono<AppEnv>();

app.get("/", getHome);
app.get("/visas", (c) => c.html(<VisasPage />));
app.get("/visas/:guide/:part?", getGuide);
app.get("/moving-to-the-uk", (c) => c.html(<MovingPage />));
for (const content of [TAX, SCHOOLS, HEALTHCARE, LIVING, SUPPORT]) {
  app.get(content.path, (c) => c.html(<TopicPage content={content} />));
}
app.get("/regions", (c) => c.html(<RegionsPage />));
app.get("/your-route/:persona", getPersona);
app.get("/get-in-touch", getContact);
app.post("/get-in-touch", postContact);
app.get("/get-in-touch/confirmation", getConfirmation);
app.get("/accessibility", (c) => c.html(<AccessibilityPage />));
app.get("/privacy", (c) => c.html(<PrivacyPage />));
app.on(["GET", "POST"], "/refresh", refresh);

app.notFound((c) => c.html(<NotFoundPage path={c.req.path} />, 404));
app.onError((error, c) => {
  console.error(error);
  return c.html(<ServerErrorPage path={c.req.path} />, 500);
});

export default { fetch: app.fetch, scheduled } satisfies ExportedHandler<CloudflareBindings>;

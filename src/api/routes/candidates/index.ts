import { Hono } from "hono";
import type { AppEnv } from "../../index";
import { list } from "./list";
import { create } from "./create";
import { importCandidates } from "./import";
import { get } from "./get";
import { rerun } from "./rerun";
import { remove } from "./remove";
import { chatHistory } from "./chat-history";
import { chat } from "./chat";
import { contact } from "./contact";
import { findContact } from "./find-contact";
import { outreach } from "./outreach";

const app = new Hono<AppEnv>();

app.get("/", list);
app.post("/", create);
app.post("/import", importCandidates);
app.get("/:candidateId", get);
app.post("/:candidateId/rerun", rerun);
app.delete("/:candidateId", remove);
app.get("/:candidateId/chat", chatHistory);
app.post("/:candidateId/chat", chat);
app.get("/:candidateId/contact", contact);
app.post("/:candidateId/contact", findContact);
app.patch("/:candidateId/outreach", outreach);

export default app;

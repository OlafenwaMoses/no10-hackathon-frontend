import { Hono } from "hono";
import type { AppEnv } from "../../index";
import { list } from "./list";
import { create } from "./create";
import { get } from "./get";
import { rerun } from "./rerun";
import { remove } from "./remove";
import { chatHistory } from "./chat-history";
import { chat } from "./chat";

const app = new Hono<AppEnv>();

app.get("/", list);
app.post("/", create);
app.get("/:candidateId", get);
app.post("/:candidateId/rerun", rerun);
app.delete("/:candidateId", remove);
app.get("/:candidateId/chat", chatHistory);
app.post("/:candidateId/chat", chat);

export default app;

import { Hono } from "hono";
import type { AppEnv } from "../../index";
import { list } from "./list";
import { summary } from "./summary";
import { create } from "./create";
import { update } from "./update";
import { remove } from "./remove";

const app = new Hono<AppEnv>();

app.get("/", list);
app.get("/summary", summary);
app.post("/", create);
app.patch("/:entryId", update);
app.delete("/:entryId", remove);

export default app;

import { Hono } from "hono";
import type { AppEnv } from "../../index";
import { list } from "./list";
import { get } from "./get";
import { create } from "./create";

const app = new Hono<AppEnv>();

app.get("/", list);
app.post("/", create);
app.get("/:searchId", get);

export default app;

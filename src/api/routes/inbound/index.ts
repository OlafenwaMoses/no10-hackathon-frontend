import { Hono } from "hono";
import type { AppEnv } from "../../index";
import { create } from "./create";

const app = new Hono<AppEnv>();

app.post("/", create);

export default app;

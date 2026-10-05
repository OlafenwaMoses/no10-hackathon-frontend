import { Hono } from "hono";
import type { AppEnv } from "../../index";
import { get } from "./get";

const app = new Hono<AppEnv>();

app.get("/", get);

export default app;

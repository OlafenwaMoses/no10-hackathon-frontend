import type { Context } from "hono";
import type { AppEnv } from "../env";
import { HomePage } from "../pages/HomePage";

export const getHome = (c: Context<AppEnv>) => c.html(<HomePage />);

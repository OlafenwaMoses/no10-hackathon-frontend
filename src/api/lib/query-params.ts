import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "../index";

export type QueryParamsFn = <T extends readonly string[]>(
  keys: T
) => Record<T[number], string>;

export const withQueryParams: MiddlewareHandler<AppEnv> = async (c, next) => {
  c.set("queryParams", <T extends readonly string[]>(keys: T) => {
    const params: Record<string, string> = {};
    const missing: string[] = [];

    for (const key of keys) {
      const value = c.req.query(key);
      if (!value) {
        missing.push(key);
      } else {
        params[key] = value;
      }
    }

    if (missing.length > 0) {
      throw new HTTPException(400, {
        message: `${missing.join(", ")} ${
          missing.length === 1 ? "is" : "are"
        } required`,
      });
    }

    return params as Record<T[number], string>;
  });

  await next();
};

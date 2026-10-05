import type { Config } from "drizzle-kit";

export default {
  schema: "./src/api/db/schema/**/*",
  out: "./src/api/drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;

import type { Context } from "hono";
import type { AppEnv } from "../../env";
import { ConfirmationPage } from "../../pages/ConfirmationPage";

export const getConfirmation = (c: Context<AppEnv>) => c.html(<ConfirmationPage />);

import { refreshAll } from "./refresh-all";

export const scheduled: ExportedHandlerScheduledHandler<CloudflareBindings> = (_controller, env, ctx) => {
  ctx.waitUntil(
    refreshAll(env).then((results) => console.log(JSON.stringify({ event: "guides_refreshed", results }))),
  );
};
